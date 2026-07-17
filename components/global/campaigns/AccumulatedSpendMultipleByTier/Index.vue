<script setup lang="ts">
type Props = {
  rewards: { tier: number; title: string; description: string }[];
};

const { rewards } = defineProps<Props>();

const { tokens, isPending: tokensIsPending, alerts: tokensAlerts } = useTokensQuery();

const {
  transactions,
  isPending: transactionsIsPending,
  alerts: transactionsAlerts,
} = useTransactionsQuery();

const { alerts, hasAlerts } = useAlertCollection(tokensAlerts, transactionsAlerts);

const reward = computed(() => {
  return tokens.value?.[0] || null;
});

const currentTier = computed(() => {
  if (reward.value) {
    return Number(reward.value.tier);
  }
  return transactions.value?.[0]?.tier || 0;
});

const hasPending = computed(() => {
  return tokensIsPending.value || transactionsIsPending.value;
});
</script>

<template>
  <section>
    <!-- Loading State -->
    <div v-if="hasPending" class="py-20">
      <div class="mx-auto block w-fit text-text-secondary">
        <Icon name="lucide:loader-circle" :size="80" class="animate-spin" />
      </div>
      <span class="sr-only">Loading</span>
    </div>

    <!-- Error State -->
    <!-- <div v-else-if="hasAlerts" class="py-20">
      <alert-hero-centered :alert="alerts[0]"> </alert-hero-centered>
    </div> -->

    <TrackerAccumulatedSpendMultipleByTier v-else :mapped-rewards="rewards" :current-tier :reward />
  </section>
</template>
