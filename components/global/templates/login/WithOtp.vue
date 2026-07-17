<!--
  LOGIN WITH OTP STANDARD TEMPLATE
  
  Purpose: Advanced login template with OTP flow and complete state management
  
  Key Features:
  - Full state management with setSectionState (can change states dynamically)
  - Two-step authentication: Login → OTP → Success
  - Shared data management between login and OTP forms (sharedLoginData/Model)
  - Campaign expiration handling (auto-expires when redemption is closed)
  - Smart transition control (prevents animations during data updates)
  - Bi-directional data binding with section components (v-model)
  - Provides separate handlers for login and OTP components
  
  Authentication Flow:
  1. Initial state → renders login form
  2. On login success → switches to 'otp' state, stores login data
  3. OTP state → renders OTP form with access to login data
  4. On OTP success → navigates to campaign home
  5. If campaign expires → switches to 'expired' state
  
  Data Flow:
  - Login form → sharedLoginData (API response) + sharedLoginModel (form data)
  - OTP form → accesses shared data via provide/inject
  - Section renderer → two-way binding with sharedLoginModel
  
  Transition Logic:
  - Uses dynamic transition names to prevent animations during data updates
  - Only animates when actual section changes occur (state transitions)
  
  Layout: Uses 'centered-compact' layout with advanced transition control
  
  Usage: Primary login template for campaigns requiring OTP verification
-->
<script setup lang="ts">
interface Props {
  classes?: {
    outer?: string;
    wrapper?: string;
  };
}

const { classes } = defineProps<Props>();

//section state logic
const { settings } = useSettings();
const loginTemplate = computed(() => {
  return settings.value?.pages?.login || [];
});

const { setSectionState, visibleSections, currentSectionState, isSectionUpdating } =
  useSectionState(loginTemplate.value?.states || [], loginTemplate.value.sections);

//login with otp logic
const sharedLoginData = ref(); // response from the login form that is needed in otp form
const sharedLoginModel = ref(); // data from the login form that is needed in otp form
const campaign = useCampaignState();

function handleLoginSuccess(data: LoginData) {
  sharedLoginData.value = data;
  setSectionState('otp');
}

function handleLoginOtpSuccess() {
  navigateTo(`/campaign/${campaign.value.id}/`);
}

provide('login', {
  handleLoginSuccess,
});

provide('otp', {
  sharedLoginData,
  sharedLoginModel,
  handleLoginOtpSuccess,
});

// to set section state to expired if the campaign is closed
watch(
  () => campaign.value.isRedemptionClosed,
  (isClosed) => {
    if (isClosed) {
      setSectionState('expired');
    }
  },
  { immediate: true }
);
</script>
<template>
  <NuxtLoadingIndicator :color="settings?.theme?.colors?.['--accent-500'] || '#a263f0'" />

  <NuxtLayout name="centered-compact" :class="classes?.outer">
    <!--
      Dynamically set the transition name to 'list' only when the section list updates.
      This prevents TransitionGroup from animating when sharedLoginModel changes,
      ensuring transitions only occur on actual section changes.
    -->
    <TransitionGroup
      tag="div"
      :name="isSectionUpdating ? 'list' : ''"
      :class="cn('relative flex flex-col gap-8 px-6 pb-12', classes?.wrapper)"
    >
      <SectionRenderer
        v-for="section in visibleSections"
        :key="section.id"
        :section
        v-model="sharedLoginModel"
      />
    </TransitionGroup>
  </NuxtLayout>
</template>
