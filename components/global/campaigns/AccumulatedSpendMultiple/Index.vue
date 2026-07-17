<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';

type Props = {
  classes: {
    outer: HTMLAttributes['class'];
  };
  rewards: { tier: number; title: string; description: string }[];
};

const { rewards, classes } = defineProps<Props>();
const {
  tokens,
  isPending: tokensIsPending,
  isError: tokensIsError,
  errors: tokensErrors,
  alerts: tokensAlerts,
} = useTokensQuery();
const {
  transactions,
  isPending: transactionsIsPending,
  isError: transactionsIsError,
  errors: transactionsErrors,
  alerts: transactionsAlerts,
} = useTransactionsQuery();

const reward = computed(() => {
  return tokens.value?.[0] || null;
});

const currentTier = computed(() => {
  if (reward.value) {
    return reward.value.tier;
  }
  return transactions.value?.[0]?.tier || 0;
});

const hasPending = computed(() => {
  return tokensIsPending.value || transactionsIsPending.value;
});

const hasError = computed(() => {
  return tokensIsError.value || transactionsIsError.value;
});

const alerts = computed(() => {
  if (tokensAlerts.value?.length || transactionsAlerts.value?.length) {
    return [...tokensAlerts.value, ...transactionsAlerts.value];
  }

  return [generalAlert['InternalServerError']];
});
</script>

<template>
  <section>
    <!-- Loading State -->
    <div v-if="hasPending" class="py-20">
      <LoaderCircle class="mx-auto block size-20 animate-spin text-text-secondary" />
      <span class="sr-only">Loading</span>
    </div>

    <!-- Error State -->
    <div v-else-if="(hasError && alerts) || true" class="py-20">
      <alert-hero-centered :alert="alerts[0]"> </alert-hero-centered>
    </div>

    <AccumulatedSpendMultiple
      v-else
      :class="cn('', classes?.outer)"
      :mapped-rewards="rewards"
      :current-tier
      :reward
    />
  </section>
</template>
