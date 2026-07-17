<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

const attrs = useAttrs();

const { settings, serverDateTime } = useSettings();
const campaign = useCampaignState();

onMounted(() => {
  if (settings.value?.schedule?.registration?.endDateTime) {
    useDateCountdown(
      serverDateTime.value,
      settings.value?.schedule.registration.endDateTime,
      () => {
        campaign.value.isRegistrationClosed = true;
      },
      1
    );
  }

  if (settings.value?.schedule?.redemption?.endDateTime) {
    useDateCountdown(
      serverDateTime.value,
      settings.value?.schedule.redemption.endDateTime,
      () => {
        campaign.value.isRedemptionClosed = true;
      },
      1
    );
  }
});

const route = useRoute();

const showDevTools = computed(() => {
  return !route.path.includes('builder');
});
</script>
<template>
  <div
    :class="
      cn(
        'relative mx-auto min-h-dvh max-w-full overflow-hidden border-border-secondary bg-surface-lower-1 text-text-primary shadow-sm [--container-margin-y:--spacing(12)] xs:my-(--container-margin-y) xs:min-h-[calc(100vh-var(--container-margin-y)*2)] xs:max-w-107.5 xs:rounded-2xl xs:border xs:shadow-md dark:text-white dark:shadow-sm',
        attrs.class as string
      )
    "
  >
    <slot />
  </div>
  <VueQueryDevtools v-show="showDevTools" />
</template>
