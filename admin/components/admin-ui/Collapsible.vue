<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useResizeObserver, usePreferredReducedMotion } from '@vueuse/core';
import gsap from 'gsap';

const isOpen = defineModel({ default: true });

defineProps({
  title: { type: String, default: '' },
  sticky: { type: Boolean, default: false },
});

const emit = defineEmits<{
  'content-resize': [height: number];
}>();

const contentRef = ref<HTMLElement | null>(null);
const contentId = `collapsible-content-${Math.random().toString(36).slice(2, 9)}`;
const prefersReducedMotion = usePreferredReducedMotion();

function setInstantOpenStyle(el: HTMLElement) {
  gsap.set(el, { height: 'auto', opacity: 1, marginTop: 12, overflow: 'visible' });
}

function setInstantClosedStyle(el: HTMLElement) {
  gsap.set(el, { height: 0, opacity: 0, marginTop: 0, overflow: 'hidden' });
}

function animate(open: boolean) {
  const el = contentRef.value;
  if (!el) return;

  if (prefersReducedMotion.value === 'reduce') {
    if (open) setInstantOpenStyle(el);
    else setInstantClosedStyle(el);
    return;
  }

  if (open) {
    el.style.overflow = 'hidden';
    const fromH = el.getBoundingClientRect().height || 0;
    el.style.height = 'auto';
    const toH = el.scrollHeight;

    el.style.height = `${fromH}px`;

    gsap.to(el, {
      height: toH,
      duration: 0.36,
      ease: 'power2.out',
      opacity: 1,
      marginTop: 12,
      onComplete() {
        el.style.height = 'auto';
        el.style.overflow = 'visible';
        emit('content-resize', toH);
      },
    });
  } else {
    el.style.overflow = 'hidden';
    const fromH = el.getBoundingClientRect().height || el.scrollHeight || 0;

    gsap.to(el, {
      height: 0,
      duration: 0.28,
      ease: 'power2.inOut',
      opacity: 0,
      marginTop: 0,
      onComplete() {
        el.style.height = '0px';
        el.style.overflow = 'hidden';
        emit('content-resize', 0);
      },
    });
  }
}

watch(isOpen, (val) => {
  nextTick(() => animate(val));
});

watch(
  contentRef,
  (el) => {
    if (!el) return;
    if (isOpen.value) setInstantOpenStyle(el);
    else setInstantClosedStyle(el);
  },
  { immediate: true }
);

useResizeObserver(contentRef, () => {
  if (isOpen.value && contentRef.value) {
    const el = contentRef.value;
    const toH = el.scrollHeight;

    emit('content-resize', toH);

    if (el.style.height !== 'auto') {
      el.style.height = `${toH}px`;
      requestAnimationFrame(() => {
        if (el) el.style.height = 'auto';
      });
    }
  }
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

defineExpose({ toggle, open, close, isOpen });
</script>

<template>
  <client-only>
    <div class="flex flex-col">
      <header
        class="flex w-full shrink-0 items-center justify-between bg-white select-none dark:bg-neutral-950"
        :class="{ 'sticky top-0 z-10 border-b border-transparent transition-colors': sticky }"
      >
        <button
          type="button"
          class="group flex items-center gap-2 text-neutral-500 transition-colors outline-none hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200"
          @click="toggle"
        >
          <Icon
            name="lucide:chevron-down"
            class="size-4 transition-transform duration-300"
            :class="{ '-rotate-90': !isOpen }"
          />
          <span class="cursor-pointer text-xs uppercase">{{ title }} </span>
        </button>

        <div class="ml-auto flex items-center justify-end">
          <slot name="actions" />
        </div>
      </header>

      <div ref="contentRef" :id="contentId" :aria-hidden="!isOpen">
        <slot />
      </div>
    </div>
  </client-only>
</template>
