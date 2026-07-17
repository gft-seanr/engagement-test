<script setup lang="ts">
import { animate, stagger } from 'motion-v';
const {
  target = 0,
  current = 0,
  hasAnimation = false,
} = defineProps<{
  target: number;
  current: number;
  labels?: string[];
  hasAnimation?: boolean;
}>();

onMounted(() => {
  if (hasAnimation && current > 0) {
    runAnimation();
  }
});

function runAnimation() {
  animate(
    '.progress-item .bg-primary',
    { opacity: 1, x: [-200, 0] },
    { delay: stagger(0.5), ease: 'easeInOut' }
  );
}
</script>
<template>
  <div class="flex w-full justify-around gap-1.5">
    <div v-for="count in target" class="shrink grow basis-0">
      <div
        class="progress-item h-2 w-full overflow-hidden rounded-full border border-border-neutral bg-surface-lower-2"
        :key="count"
      >
        <div
          :class="count <= current ? 'bg-primary' : 'bg-surface-lower-2'"
          class="active size-full"
        ></div>
      </div>
      <div class="mt-4 text-center" v-if="labels?.length">
        <div class="text-xs text-text-muted">
          {{ labels[count - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>
