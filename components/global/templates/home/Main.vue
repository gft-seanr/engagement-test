<!--
  HOME MAIN STANDARD TEMPLATE

  Purpose: Protected home page template with authentication guard

  Key Features:
  - Authentication protection (redirects unauthorized users to login)
  - Static section rendering from settings.pages.home.sections
  - No state management (sections are always visible)
  - Simple navigation flow (unauthorized → login, authorized → home content)

  Security Flow:
  1. Watches auth.value.isUnauthorized
  2. If unauthorized AND login page exists → redirects to campaign login
  3. If unauthorized AND no login page → shows popup (TODO)
  4. If authorized → displays home sections

  Layout: Uses 'centered-compact' layout with transition animations

  Usage: Main home page for authenticated users in campaigns
-->
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';

interface Props {
  classes?: {
    outer?: string;
    wrapper?: string;
  };
}

const { classes } = defineProps<Props>();

const { settings } = useSettings();
const auth = useAuthState();
const campaign = useCampaignState();
const queryClient = useQueryClient();
const { handleLogout } = useLogoutMutation(handleLogoutSuccess);

async function handleLogoutSuccess() {
  navigateTo(`/campaign/${campaign.value.id}/login`);
  await queryClient.clear();
}

watch(
  () => auth.value.isUnauthorized,
  async (value) => {
    if (value && settings.value.pages.login) {
      handleLogout();
    }
  }
);
</script>
<template>
  <NuxtLoadingIndicator :color="settings?.theme?.colors?.['--accent-500'] || '#a263f0'" />

  <NuxtLayout name="centered-compact" :class="classes?.outer">
    <TransitionGroup
      name="list"
      tag="div"
      :class="
        cn(
          'flex h-full flex-col gap-8 px-6 pb-(--wrapper-padding-b) [--wrapper-padding-b:--spacing(12)]',
          classes?.wrapper
        )
      "
    >
      <SectionRenderer
        v-for="section in settings?.pages.home.sections"
        :key="section.id"
        :section="section"
      />
    </TransitionGroup>
  </NuxtLayout>
</template>
