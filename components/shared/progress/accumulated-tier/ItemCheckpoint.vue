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

const checkpointRef = ref<HTMLElement | null>(null);

const isActive = computed(() => context.currentAnimatedTier.value >= index + 1);

onMounted(() => {
  if (checkpointRef.value) context.registerCheckpoint(checkpointRef.value, index);
});
</script>

<template>
  <div
    ref="checkpointRef"
    :class="cn('z-10 col-span-2 flex items-center justify-center', props.class)"
  >
    <slot :isActive="isActive" :index="index" />
  </div>
</template>
