<script setup lang="ts">
import { computed, type CSSProperties, ref, toRef } from 'vue';
import { useElementBounding, onClickOutside, useWindowSize } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    open: boolean;
    trigger: HTMLElement | null;
    gap?: number;
    menuWidth?: number;
  }>(),
  {
    gap: 12,
    menuWidth: 200,
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const menuElement = ref<HTMLDivElement | null>(null);
const triggerElement = toRef(props, 'trigger');

// 1. Get the viewport dimensions
const { height: windowHeight } = useWindowSize();

// 2. Get the trigger's position
const { top: triggerTop, left: triggerLeft } = useElementBounding(triggerElement);

// 3. Get the menu's actual rendered height
const { height: menuHeight } = useElementBounding(menuElement);

const menuStyle = computed<CSSProperties>(() => {
  // Start with the default alignment (top of the trigger)
  let calculatedTop = triggerTop.value;

  // Collision Detection: If the menu overflows the bottom edge of the screen
  if (menuHeight.value > 0 && calculatedTop + menuHeight.value > windowHeight.value) {
    // Shift it up so it rests 16px above the bottom of the window
    calculatedTop = windowHeight.value - menuHeight.value - 16;
  }

  // Safety Check: Make sure it doesn't get pushed off the TOP of the screen either
  if (calculatedTop < 16) {
    calculatedTop = 16;
  }

  return {
    position: 'fixed',
    top: `${calculatedTop}px`,
    left: `${triggerLeft.value - props.menuWidth - props.gap}px`,
    width: `${props.menuWidth}px`,
    maxHeight: 'calc(100vh - 32px)',
  };
});

onClickOutside(menuElement, () => {
  if (props.open) {
    emit('close');
  }
});
</script>

<template>
  <Teleport to="body">
    <client-only>
      <div
        v-if="open"
        ref="menuElement"
        :style="menuStyle"
        class="z-50 overflow-hidden rounded-lg border bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <slot />
      </div>
    </client-only>
  </Teleport>
</template>
