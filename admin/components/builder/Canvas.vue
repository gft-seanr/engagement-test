<script setup lang="ts">
import clsx from 'clsx';
import gsap from 'gsap';

const builderStore = useBuilderStore();
const { campaignConfig, activePageId, activeState, activeCanvasTool, zoomLevel } =
  storeToRefs(builderStore);

const currentPage = computed(() => {
  const pages = campaignConfig.value?.pages || {};
  const id = activePageId.value;
  if (!id) return undefined;
  return pages[id];
});

const availableStates = computed(() => currentPage.value?.states || []);

const showStateSelector = computed(() => availableStates.value.length > 1);

const zoomOptions = [
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '88%', value: 0.88 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
];

const onEnter = (el: Element) => {
  gsap.fromTo(
    el,
    { width: 0, opacity: 0, scale: 0.95 },
    {
      width: 'auto',
      opacity: 1,
      scale: 1,
      duration: 0.4,
    }
  );
};

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    width: 0,
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    onComplete: done,
  });
};

watch(activeCanvasTool, (newTool) => {
  if (newTool === 'hand') {
    document.body.style.cursor = 'grab';
  } else {
    document.body.style.cursor = 'default';
  }
});
</script>

<template>
  <footer class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2" aria-label="Footer navigation">
    <div
      class="flex h-14 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 shadow-lg transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <button
        @click="activeCanvasTool = 'pointer'"
        :class="
          clsx(
            'flex size-8 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
            {
              'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400':
                activeCanvasTool === 'pointer',
            }
          )
        "
      >
        <Icon name="lucide:mouse-pointer-2" :size="18" />
      </button>

      <button
        @click="activeCanvasTool = 'hand'"
        :class="
          clsx(
            'flex size-8 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
            {
              'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400':
                activeCanvasTool === 'hand',
            }
          )
        "
      >
        <Icon name="lucide:hand" :size="18" />
      </button>

      <div class="h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>

      <Transition @enter="onEnter" @leave="onLeave" :css="false">
        <div v-if="showStateSelector" class="flex origin-left items-center gap-2 px-2">
          <label
            for="page_state"
            class="text-sm font-medium tracking-wide text-neutral-500 dark:text-neutral-500"
            >State</label
          >

          <div class="flex items-center text-neutral-300 dark:text-neutral-700">·</div>
          <select
            v-model="activeState"
            id="page_state"
            class="cursor-pointer bg-transparent py-1 text-sm font-semibold text-purple-600 outline-none hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <option
              v-for="state in availableStates"
              :key="state"
              :value="state"
              class="dark:bg-neutral-900 dark:text-neutral-100"
            >
              {{ formatCapitalize(state) }}
            </option>
          </select>

          <div class="h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </Transition>

      <div class="pl-2">
        <select
          v-model="zoomLevel"
          class="cursor-pointer rounded-md bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-600 transition-colors outline-none hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <option
            v-for="option in zoomOptions"
            :key="option.value"
            :value="option.value"
            class="dark:bg-neutral-900 dark:text-neutral-100"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </footer>
</template>
