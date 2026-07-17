<script setup lang="ts">
import { animate, stagger } from 'motion-v';
const {
  target = 0,
  current = 0,
  hasAnimation = false,
} = defineProps<{
  target: number;
  current: number;
  hasAnimation?: boolean;
}>();

onMounted(() => {
  if (hasAnimation) {
    runAnimation();
  }
});

function runAnimation() {
  animate(
    '.progress-item .bg-accent-primary',
    { opacity: 1, x: [-200, 0] },
    { delay: stagger(0.5), ease: 'easeInOut' }
  );
}
</script>
<template>
  <div class="flex w-full justify-evenly gap-1.5" @click="runAnimation">
    <div
      v-for="count in target"
      class="progress-item h-2 w-full overflow-hidden rounded-full border border-border-neutral bg-surface-lower-2"
      :key="count"
    >
      <div
        :class="count <= current ? 'bg-accent-primary' : 'bg-surface-lower-2'"
        class="h-full w-full"
      ></div>
    </div>
  </div>
</template>
