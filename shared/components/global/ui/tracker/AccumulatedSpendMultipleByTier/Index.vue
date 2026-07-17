<script setup lang="ts">
import { computed } from 'vue';
import RewardCard from './RewardCard.vue';

type MappedReward = {
  tier: number;
  title: string;
  description: string;
};

const props = defineProps<{
  mappedRewards: MappedReward[];
  currentTier: number;
  reward: Token | null;
}>();

const totalRewards = computed(() => props.mappedRewards?.length);

const progressPercentage = computed(() => {
  if (totalRewards.value <= 1) return 0;
  return (props.currentTier - 1) / (totalRewards.value - 1);
});

function getRewardStatus(rewardTier: number): 'active' | 'pending' | 'locked' {
  if (props.currentTier === rewardTier) {
    return props.reward ? 'active' : 'pending';
  }

  return 'locked';
}
</script>

<template>
  <section
    class="relative grid grid-cols-12 gap-y-4"
    :style="{
      '--total-rewards': totalRewards,
      '--progress-percentage': progressPercentage,
    }"
  >
    <!-- Progress Bar -->
    <div class="col-span-2 grid grid-rows-subgrid" :style="{ gridRow: `span ${totalRewards}` }">
      <!-- Bar -->
      <div
        class="absolute top-1/2 left-[11.5px] w-2 -translate-y-1/2 overflow-clip rounded-full bg-surface-disable"
        style="height: calc((var(--total-rewards) - 1) / var(--total-rewards) * 100%)"
      >
        <div
          class="w-full rounded-full bg-accent-primary transition-all duration-300 ease-out"
          style="height: calc(var(--progress-percentage) * 100%)"
        />
      </div>

      <!-- Circles -->
      <div
        v-for="reward in mappedRewards"
        :key="reward.tier"
        class="z-10 my-auto flex size-8 items-center justify-center rounded-full font-bold"
        :class="currentTier >= reward.tier ? 'bg-accent-primary text-white' : 'bg-surface-disable'"
      >
        {{ String.fromCharCode(64 + reward.tier) }}
      </div>
    </div>

    <!-- Cards -->
    <div class="col-span-10 grid grid-rows-subgrid" :style="{ gridRow: `span ${totalRewards}` }">
      <RewardCard
        v-for="reward in mappedRewards"
        :key="reward.tier"
        :title="reward.title"
        :description="reward.description"
        :status="getRewardStatus(reward.tier)"
        :gift-url="props.currentTier === reward.tier ? props.reward?.link : undefined"
      />
    </div>
  </section>
</template>
