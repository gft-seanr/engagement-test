<script setup lang="ts">
import clsx from 'clsx';
import BuilderPageRenderer from './BuilderPageRenderer.vue';

const builderStore = useBuilderStore();
const { campaignConfig, activePageId, selectedSectionId, activeState, mode, zoomLevel } =
  storeToRefs(builderStore);

const isScrolling = ref(false);
const pageRefs = ref<Record<string, HTMLElement | null>>({});

interface Page {
  id: string;
  template: string;
  sections: any[];
  [key: string]: any;
}

const pages = computed<Page[]>(() => {
  const pagesMap = (campaignConfig.value.pages || {}) as Record<string, any>;

  if (mode.value === 'preview') {
    const active = pagesMap[activePageId.value as string];
    if (!active) return [];

    return [
      {
        id: activePageId.value as string,
        template: active.template || 'home-main',
        sections: active.sections || [],
        ...active,
      },
    ];
  }

  return Object.entries(pagesMap).map(([key, val]) => {
    return {
      id: key,
      template: val.template || 'home-main',
      sections: val.sections || [],
      ...val,
    };
  });
});

const pageElements = computed(() => Object.values(pageRefs.value).filter((el) => el));

const currentPage = computed(() => {
  const pagesMap = campaignConfig.value.pages || {};
  if (!activePageId.value) return undefined;
  return pagesMap[activePageId.value as string];
});

const availableStates = computed(() => currentPage.value?.states || []);

useIntersectionObserver(
  pageElements,
  (entries) => {
    entries.forEach((entry) => {
      if (mode.value === 'preview') return;

      if (entry.isIntersecting) {
        const visiblePageId = (entry.target as HTMLElement).dataset.pageId;

        if (visiblePageId && !isScrolling.value) {
          isScrolling.value = true;
          activePageId.value = visiblePageId;
          selectedSectionId.value = null;

          if (availableStates.value) {
            activeState.value = availableStates.value[0];
          } else {
            activeState.value = '';
          }

          setTimeout(() => {
            isScrolling.value = false;
          }, 100);
        }
      }
    });
  },
  {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  }
);

const { cleanup } = useBuilderStyleInjection(campaignConfig);

onUnmounted(() => {
  cleanup();
});

watch(activePageId, async (newId) => {
  if (!newId || isScrolling.value) return;
  await nextTick();
  pageRefs.value[newId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
</script>

<template>
  <div
    @click="mode === 'build' ? (selectedSectionId = null) : null"
    class="relative flex w-full flex-col gap-4 transition-all duration-300"
    :class="mode === 'preview' ? 'px-0 pt-0' : 'px-10 pt-10'"
    :style="{
      transform: `scale(${zoomLevel})`,
      transformOrigin: 'top center',
    }"
  >
    <div
      v-for="page in pages"
      :key="page.id"
      :data-page-id="page.id"
      :ref="(el) => (pageRefs[page.id] = el as HTMLElement)"
      class="flex h-full flex-shrink-0 flex-col gap-2"
    >
      <span
        v-if="mode === 'build'"
        class="text-xs text-neutral-500 capitalize dark:text-neutral-400"
      >
        {{ page.id }}
      </span>
      <div
        :class="
          clsx('w-full flex-1 transition-colors duration-300', {
            'bg-neutral-200 dark:bg-neutral-800': mode === 'build',
            'bg-neutral-50 dark:bg-neutral-900': mode === 'preview',
          })
        "
      >
        <BuilderPageRenderer v-bind="page" :preview="mode === 'preview'" />
      </div>
    </div>
  </div>
</template>
