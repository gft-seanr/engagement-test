<script setup>
import { ref, nextTick, onUnmounted } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  position: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  delay: { type: Number, default: 300 },
});

const show = ref(false);
const triggerRef = ref(null);
const tooltipRef = ref(null);
const coords = ref({ top: 0, left: 0 });
let timer = null;

function updatePosition() {
  if (!triggerRef.value || !tooltipRef.value) return;

  const trigger = triggerRef.value.getBoundingClientRect();
  const tooltip = tooltipRef.value.getBoundingClientRect();
  const gap = 8;

  let top = 0;
  let left = 0;

  switch (props.position) {
    case 'top':
      top = trigger.top - tooltip.height - gap;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
      break;
    case 'bottom':
      top = trigger.bottom + gap;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
      break;
    case 'left':
      top = trigger.top + trigger.height / 2 - tooltip.height / 2;
      left = trigger.left - tooltip.width - gap;
      break;
    case 'right':
      top = trigger.top + trigger.height / 2 - tooltip.height / 2;
      left = trigger.right + gap;
      break;
  }

  coords.value = { top, left };
}

function onMouseEnter() {
  timer = setTimeout(async () => {
    show.value = true;
    await nextTick();
    updatePosition();
  }, props.delay);
}

function onMouseLeave() {
  if (timer) clearTimeout(timer);
  show.value = false;
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <div
    ref="triggerRef"
    class="tooltip-trigger"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onMouseEnter"
    @focusout="onMouseLeave"
  >
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="show"
        ref="tooltipRef"
        class="fixed z-[9999] max-w-xs rounded bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white shadow-xl ring-1 ring-white/10"
        :style="{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
        }"
      >
        <slot name="content">{{ text }}</slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-trigger {
  display: inline-flex; /* Ensures it wraps the content tightly */
  width: max-content;
}

/* Animation:
  A subtle scale-up and fade-in feels much more premium than a simple fade.
*/
.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.96); /* Slight shrink effect */
}
</style>
