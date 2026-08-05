<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

interface ProgressStyleType {
  fillColorHex?: string;
  bgColorHex?: string;
  widthPx?: number;
}

interface AnimationConfigType {
  isAnimated?: boolean;
  speedMs?: number;
}

const props = defineProps<{
  tier: number;
  progressBarStyle?: ProgressStyleType;
  animationConfig?: AnimationConfigType;
  class?: HTMLAttributes['class'];
}>();

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const progressBarRef = useTemplateRef<HTMLElement>('progressBarRef');
const progressBarFillRef = useTemplateRef<HTMLElement>('progressBarFillRef');

const totalBarHeight = ref(0);
const currentFillHeight = ref(0);
const currentAnimatedTier = ref(0);
const checkpointElements = ref<HTMLElement[]>([]);
const timeoutIds = ref<ReturnType<typeof setTimeout>[]>([]);

const progressBarStyle = computed(() => ({
  fillColorHex: props.progressBarStyle?.fillColorHex ?? '#99a1af',
  bgColorHex: props.progressBarStyle?.bgColorHex ?? '#e5e5e5',
  widthPx: props.progressBarStyle?.widthPx ?? 8,
}));

const animationConfig = computed(() => ({
  isAnimated: props.animationConfig?.isAnimated ?? false,
  speedMs: props.animationConfig?.speedMs ?? 400,
}));

const progressBarFillScaleY = computed(() => {
  if (totalBarHeight.value === 0) return 0;
  return currentFillHeight.value / totalBarHeight.value;
});

async function calculateBarGeometry() {
  await nextTick();
  const progressBar = progressBarRef.value;
  const progressBarFill = progressBarFillRef.value;
  const containerElement = containerRef.value;
  const elements = checkpointElements.value.filter(Boolean);

  if (!progressBar || !progressBarFill || !containerElement || elements.length < 2) return;

  const containerRect = containerElement.getBoundingClientRect();
  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();

  const startY = firstRect.top + firstRect.height / 2 - containerRect.top;
  const endY = lastRect.top + lastRect.height / 2 - containerRect.top;
  const centerX = firstRect.left + firstRect.width / 2 - containerRect.left;

  totalBarHeight.value = endY - startY;

  progressBar.style.top = `${startY}px`;
  progressBar.style.height = `${totalBarHeight.value}px`;
  progressBar.style.left = `${centerX}px`;

  progressBarFill.style.top = `${startY}px`;
  progressBarFill.style.height = `${totalBarHeight.value}px`;
  progressBarFill.style.left = `${centerX}px`;

  const currentTierIndex = Math.min(
    Math.max(currentAnimatedTier.value - 1, -1),
    elements.length - 1
  );

  if (currentTierIndex < 0) {
    currentFillHeight.value = 0;
  } else {
    const activeRect = elements[currentTierIndex].getBoundingClientRect();
    currentFillHeight.value = activeRect.top + activeRect.height / 2 - containerRect.top - startY;
  }
}

// Clear any pending animation and setTimeouts before starting a new animation
function clearActiveAnimations() {
  timeoutIds.value.forEach((id) => clearTimeout(id));
  timeoutIds.value = [];
}

// This function increments the currentAnimatedTier by one per specified speedMs
// This provides the look of a stagger animation
function animateTierProgress(newTier: number) {
  clearActiveAnimations();

  if (!animationConfig.value.isAnimated) {
    currentAnimatedTier.value = newTier;
    calculateBarGeometry();
    return;
  }

  const startFrom = currentAnimatedTier.value;
  const steps = Math.abs(newTier - startFrom);

  for (let i = 1; i <= steps; i++) {
    const id = setTimeout(() => {
      if (newTier > startFrom) {
        currentAnimatedTier.value++;
      } else {
        currentAnimatedTier.value--;
      }
      calculateBarGeometry();

      timeoutIds.value = timeoutIds.value.filter((t) => t !== id);
    }, i * animationConfig.value.speedMs);

    timeoutIds.value.push(id);
  }
}

// This function is used by the AccumulatedTierItemCheckpoint
// This is needed in order to compute the style of the progress bar
function registerCheckpoint(el: HTMLElement, index: number) {
  checkpointElements.value[index] = el;
  calculateBarGeometry();
}

provide('tier-context', {
  currentAnimatedTier,
  registerCheckpoint,
  speedMs: animationConfig.value.speedMs,
});

watch(
  () => props.tier,
  (tier) => animateTierProgress(tier)
);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  animateTierProgress(props.tier);
  resizeObserver = new ResizeObserver(() => {
    calculateBarGeometry();
  });

  if (containerRef.value && resizeObserver) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  clearActiveAnimations();
});
</script>

<template>
  <!-- The v-show is to make sure that the progress bar is calculated before rendering the whole component -->
  <div
    v-show="checkpointElements.length > 1"
    ref="containerRef"
    :class="cn('relative grid grid-cols-12 gap-y-4', props.class)"
  >
    <div
      ref="progressBarRef"
      class="absolute -translate-x-1/2"
      :style="{ background: progressBarStyle.bgColorHex, width: `${progressBarStyle.widthPx}px` }"
    />

    <div
      ref="progressBarFillRef"
      class="absolute origin-top transition-all"
      :style="{
        background: progressBarStyle.fillColorHex,
        width: `${progressBarStyle.widthPx}px`,
        transform: `translateX(-50%) scaleY(${progressBarFillScaleY})`,
        transitionDuration: `${animationConfig.speedMs}ms`,
      }"
    />

    <slot />
  </div>
</template>
