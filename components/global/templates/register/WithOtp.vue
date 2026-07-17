<!--
  REGISTER MAIN STANDARD TEMPLATE
  Usage: Primary registration template for campaigns requiring user registration with OTP verification
  
  Key Features:
  - Dynamic section rendering based on settings.pages.register.sections
  - State management with useSectionState (handles multiple registration steps)
  - Registration success flow (sets state to 'success' on completion)
  - Campaign expiration handling (auto-expires when registration is closed)
  - Event-driven architecture (passes onRegisterSuccess to section components)
  
  State Flow:
  1. Initial state → renders registration form sections
  2. On successful registration → switches to 'otp' state -> renders OTP verification section
  3. On successful OTP verification → switches to 'success' state
  4. If campaign registration closes → switches to 'expired' state
  
  Layout: Uses 'centered-compact' layout with transition animations
-->
<script setup lang="ts">
interface Props {
  classes?: {
    outer?: string;
    wrapper?: string;
  };
}

const { classes } = defineProps<Props>();

const { settings } = useSettings();
const registerTemplate = computed(() => {
  return settings.value?.pages?.register || [];
});

const { setSectionState, visibleSections, currentSectionState, isSectionUpdating } =
  useSectionState(registerTemplate.value?.states || [], registerTemplate.value.sections);

// register with otp logic
const sharedRegisterData = ref(); // response from the register form that is needed in otp form
const sharedRegisterModel = ref(); // data from the register form that is needed in otp form
const campaign = useCampaignState();

function handleRegisterSuccess(data: RegisterData) {
  sharedRegisterData.value = data;
  setSectionState('otp');
}

function handleRegisterOtpSuccess() {
  setSectionState('success');
}

provide('register', {
  handleRegisterSuccess,
});

provide('otp', {
  sharedRegisterData,
  sharedRegisterModel,
  handleRegisterOtpSuccess,
});

watch(
  () => campaign.value.isRegistrationClosed,
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
    <TransitionGroup
      tag="div"
      :name="isSectionUpdating ? 'list' : ''"
      :class="cn('flex flex-col gap-8 px-6 pb-12', classes?.wrapper)"
    >
      <SectionRenderer
        v-for="section in visibleSections"
        :key="section.id"
        :section
        v-model="sharedRegisterModel"
      />
    </TransitionGroup>
  </NuxtLayout>
</template>
