<!--
  LOGIN MAIN STANDARD TEMPLATE
  
  Purpose: Simple login template with basic state management (no OTP flow)
  
  Key Features:
  - Basic section rendering from settings.pages.login.sections
  - Read-only state management (displays sections based on current state)
  - Direct navigation on login success (no intermediate steps)
  - Provides login handler to child components
  
  Authentication Flow:
  1. Renders login sections based on current state
  2. On successful login → directly navigates to campaign home
  3. No OTP or multi-step authentication
  
  Layout: Uses 'centered-compact' layout with basic transitions
  
  Usage: Simple login scenarios without OTP or complex authentication flows

  Todo: Add Expired state handling if needed
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
  return settings?.value.pages?.login || [];
});

const { visibleSections } = useSectionState(
  loginTemplate.value?.states || [],
  loginTemplate.value.sections
);

//login success logic
const campaign = useCampaignState();

function handleLoginSuccess() {
  navigateTo(`/campaign/${campaign.value.id}/`);
}

provide('login', {
  handleLoginSuccess,
});
</script>
<template>
  <NuxtLoadingIndicator :color="settings?.theme?.colors?.['--accent-500'] || '#a263f0'" />
  <NuxtLayout name="centered-compact" :class="classes?.outer">
    <TransitionGroup
      name="list"
      tag="div"
      :class="cn('flex flex-col gap-8 px-6 pb-12', classes?.wrapper)"
    >
      <SectionRenderer v-for="section in visibleSections" :key="section.id" :section />
    </TransitionGroup>
  </NuxtLayout>
</template>
