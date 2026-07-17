<script setup lang="ts">
import draggable from 'vuedraggable';
import CustomRenderer from './CustomRenderer.vue';
import campaign from '~/middleware/campaign';

const props = defineProps<{
  id: string;
  template: string;
  sections: any[];
  states?: string[];
  props?: Record<string, any>;
  preview?: boolean;
}>();

const builderStore = useBuilderStore();
const {
  campaignConfig,
  selectedSectionId,
  activePageConfig,
  activeState,
  activeCanvasTool,
  isDragging,
  mode,
} = storeToRefs(builderStore);

const draggableSections = computed({
  get: () => {
    const sourceSections = props.sections || [];
    const activeState = builderStore.activeState;
    console.log('[BuilderPageRenderer] draggableSections re-running, sections:', sourceSections.length);

    if (!activeState) return sourceSections;

    return sourceSections.filter((s: any) => s.state === activeState || !s.state);
  },
  set: (sortedVisibleList) => {
    if (props.preview) return;

    const currentFullList = [...(campaignConfig.value.pages?.[props.id]?.sections || [])];
    const activeState = builderStore.activeState;

    if (!activeState) {
      if (campaignConfig.value.pages?.[props.id]) {
        campaignConfig.value.pages[props.id].sections = sortedVisibleList;
      }
      return;
    }

    const mergedList: any[] = [];
    let newIndex = 0;

    for (const originalSection of currentFullList) {
      const wasVisible = originalSection.state === activeState || !originalSection.state;

      if (wasVisible) {
        if (newIndex < sortedVisibleList.length) {
          mergedList.push(sortedVisibleList[newIndex]);
          newIndex++;
        }
      } else {
        mergedList.push(originalSection);
      }
    }

    while (newIndex < sortedVisibleList.length) {
      mergedList.push(sortedVisibleList[newIndex]);
      newIndex++;
    }

    if (campaignConfig.value.pages?.[props.id]) {
      campaignConfig.value.pages[props.id].sections = mergedList;
    }
  },
});

const { delete: del, backspace } = useMagicKeys();

const isDeletePressed = computed(() => {
  return del.value || backspace.value;
});

function handleDelete() {
  if (!selectedSectionId.value) return;

  const pageSections = campaignConfig.value.pages?.[props.id]?.sections;
  if (!pageSections) return;

  const delIndex = pageSections.findIndex((s: any) => s.id === selectedSectionId.value);
  if (delIndex !== -1) {
    pageSections.splice(delIndex, 1);
    selectedSectionId.value = null;
  }
}

function onListChange(event: any) {
  if (!event.added) return;

  const { element, newIndex } = event.added;
  const sections = activePageConfig.value.sections;

  if (element.component.startsWith('input-')) {
    const formIndex = sections.findIndex((s: any) => s.component === 'form-login');

    if (formIndex !== -1) {
      const formKitNode = element.schema[0];
      formKitNode.id = `field_${Math.random().toString(36).substr(2, 5)}`;
      formKitNode.name = formKitNode.id;
      sections[formIndex].schema.push(formKitNode);
      sections.splice(newIndex, 1);
      console.log('Moved input into Form Login');
    } else {
      console.warn('No form found to accept this input!');
    }
  }
}

const containerRef = useTemplateRef<HTMLElement | null>('containerRef');
const hoveredId = ref<string | null>(null);

const selectedHighlightStyle = ref<any>({ display: 'none' });
const hoverHighlightStyle = ref<any>({ display: 'none' });

function calculateHighlight(targetId: string | null, color: string, opacity: string) {
  if (!containerRef.value || !targetId) return { display: 'none' };

  const target = containerRef.value.querySelector(`[data-section-id="${targetId}"]`) as HTMLElement;

  if (!target) return { display: 'none' };

  const containerRect = containerRef.value.getBoundingClientRect();
  const rect = target.getBoundingClientRect();

  const scaleX = containerRect.width / containerRef.value.offsetWidth || 1;
  const scaleY = containerRect.height / containerRef.value.offsetHeight || 1;

  return {
    display: 'block',
    top: `${(rect.top - containerRect.top) / scaleY}px`,
    left: `${(rect.left - containerRect.left) / scaleX}px`,
    width: `${rect.width / scaleX}px`,
    height: `${rect.height / scaleY}px`,
    borderColor: color,
    opacity: opacity,
  };
}

function updateHighlights() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      selectedHighlightStyle.value = calculateHighlight(selectedSectionId.value, '#a855f7', '1');

      if (hoveredId.value === selectedSectionId.value) {
        hoverHighlightStyle.value = { display: 'none' };
      } else {
        hoverHighlightStyle.value = calculateHighlight(hoveredId.value, '#3b82f6', '0.5');
      }
    });
  });
}

watch(
  [selectedSectionId, hoveredId, () => props.sections, activeState],
  async () => {
    await nextTick();
    updateHighlights();
  },
  { deep: true, immediate: true }
);

function handleSelect(id: string | null) {
  if (props.preview) return;
  if (activeCanvasTool.value !== 'pointer') return;

  selectedSectionId.value = id;
}

function onItemEnter(id: string) {
  if (props.preview) return;
  hoveredId.value = id;
}

function onItemLeave() {
  if (props.preview) return;
  hoveredId.value = null;
}

useResizeObserver(containerRef, updateHighlights);

const debouncedUpdate = useDebounceFn(updateHighlights, 50);
useMutationObserver(
  containerRef,
  () => {
    debouncedUpdate();
  },
  {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  }
);

whenever(isDeletePressed, () => {
  const activeEl = document.activeElement;
  const isTyping =
    activeEl &&
    (['INPUT', 'TEXTAREA'].includes(activeEl.tagName) ||
      (activeEl as HTMLElement).isContentEditable);
  if (isTyping) return;

  if (props.preview) return;
  if (!selectedSectionId.value) return;

  handleDelete();
});

watch(activeCanvasTool, (newTool) => {
  if (newTool !== 'pointer') selectedSectionId.value = null;
});

watch(mode, (newMode) => {
  if (newMode === 'preview') selectedSectionId.value = null;
});
</script>

<template>
  <NuxtLayout name="centered-compact">
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-10 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-10 opacity-0"
      >
        <div
          v-if="props.preview"
          class="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 rounded-full border border-neutral-700/80 bg-[#1e1e1e]/95 p-1.5 pl-4 text-[13px] shadow-2xl backdrop-blur-md"
        >
          <div class="flex items-center gap-2 text-neutral-200">
            <Icon name="lucide:eye" size="14" class="text-blue-400" />
            <span class="font-medium tracking-wide">You are in preview mode</span>
          </div>

          <div class="h-4 w-px bg-neutral-700"></div>

          <button
            @click="mode = 'build'"
            class="flex items-center justify-center rounded-full bg-neutral-800 px-4 py-1.5 font-semibold text-white transition-all hover:bg-neutral-700 active:scale-95"
          >
            Exit Preview
          </button>
        </div>
      </Transition>
    </Teleport>

    <div
      class="relative min-h-[50vh]"
      ref="containerRef"
      @mousedown.self="selectedSectionId = null"
    >
      <draggable
        v-model="draggableSections"
        @change="onListChange"
        ghost-class="ghost-indicator"
        group="campaign-builder"
        class="relative flex flex-col gap-8 px-6 pb-12"
        item-key="id"
        :revert-on-spill="true"
        :force-fallback="true"
        :animation="200"
        :disabled="props.preview || (activeCanvasTool !== 'hand' && !isDragging)"
      >
        <template #item="{ element }">
          <div
            v-if="!props.preview"
            @mousedown.stop.prevent="handleSelect(element.id)"
            @click.stop.prevent
            @mouseenter="onItemEnter(element.id)"
            @mouseleave="onItemLeave"
            @drop.prevent
            @dragover.capture.prevent
            :data-section-id="element.id"
            class="group relative"
          >
            <div class="absolute inset-0 z-1 active:cursor-grabbing"></div>

            <CustomRenderer :section="element" :no-pointer-events="!props.preview" />
          </div>

          <CustomRenderer v-else :section="element" :no-pointer-events="!props.preview" />
        </template>
      </draggable>

      <div
        v-show="selectedHighlightStyle.display !== 'none'"
        class="pointer-events-none absolute z-50 transition-opacity duration-75"
        :style="selectedHighlightStyle"
      >
        <div
          class="box-border h-full w-full rounded-sm border-2 border-purple-500 shadow-[0_0_0_1px_rgba(168,85,247,0.2)]"
        />
      </div>

      <div
        v-show="hoverHighlightStyle.display !== 'none'"
        class="pointer-events-none absolute z-40 transition-opacity duration-75"
        :style="hoverHighlightStyle"
      >
        <div
          class="box-border h-full w-full rounded-sm border-2 border-dashed border-blue-500 bg-blue-500/5"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
:deep(.ghost-indicator) {
  height: 4px !important;
  min-height: 4px !important;
  padding: 0 !important;
  margin: 4px 0 !important;
  width: 100%;
  background-color: #3b82f6;
  border: none !important;
  opacity: 1 !important;

  overflow: hidden !important;

  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

:deep(.ghost-indicator > *) {
  display: none !important;
}
</style>
