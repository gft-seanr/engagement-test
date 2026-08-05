<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

interface TierContextType {
  currentAnimatedTier: Ref<number>;
  registerCheckpoint: (el: HTMLElement, index: number) => void;
  speedMs: number;
}

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const context = inject<TierContextType>('tier-context')!;
const index = inject<number>('item-index')!;

const isActive = computed(() => context.currentAnimatedTier.value >= index + 1);
</script>

<template>
  <div :class="cn('col-span-10', props.class)">
    <slot :isActive="isActive" :index="index" />
  </div>
</template>
