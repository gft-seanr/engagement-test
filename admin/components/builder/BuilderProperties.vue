<script setup lang="ts">
import draggable from 'vuedraggable';
import Collapsible from '~/admin/components/admin-ui/Collapsible.vue';
import EditorPanel from '~admin/components/builder/EditorPanel.vue';

import { gsap } from 'gsap';
const emit = defineEmits(['openAddComponent', 'openBrowseTemplates']);

const builderStore = useBuilderStore();
const { activePageConfig, activePageId, selectedSectionId, selectedSection, campaignConfig } =
  storeToRefs(builderStore);

const deleteStateIds = ref<string[]>([]);
const confirmingDeleteId = ref<string | null>(null);

function promptDelete(componentId: string) {
  if (confirmingDeleteId.value === componentId) return;

  const prevConfirm = confirmingDeleteId.value;
  if (prevConfirm) cancelDelete(prevConfirm);

  confirmingDeleteId.value = componentId;

  gsap.to(`#wipe-${componentId}`, {
    width: '100%',
    duration: 0.3,
    ease: 'power2.out',
  });
}

function deleteFromButton() {
  if (!selectedSectionId.value) {
    return;
  }

  const pageSections = activePageConfig.value.sections;

  const delIndex = pageSections.findIndex((section: any) => {
    return section.id === selectedSectionId.value;
  });

  if (delIndex === -1) {
    return;
  }

  pageSections.splice(delIndex, 1);

  selectedSectionId.value = null;
}

function confirmDelete(componentId: string, index: number) {
  gsap.to(`#component-${componentId}`, {
    height: 0,
    opacity: 0,
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 0,
    padding: 0,
    duration: 0.3,
    onComplete: () => {
      activePageConfig.value.sections.splice(index, 1);
      confirmingDeleteId.value = null;
    },
  });
}

function cancelDelete(componentId: string) {
  confirmingDeleteId.value = null;

  gsap.to(`#wipe-${componentId}`, {
    width: '0%',
    duration: 0.25,
    ease: 'power2.in',
  });
}

function isActive(state: string) {
  return (
    builderStore.activeState === state ||
    (!builderStore.activeState && activePageConfig.value.states?.[0] === state)
  );
}

function handleStateClick(state: string) {
  builderStore.activeState = state;
}

function handleDeletePage() {
  const currentPages = campaignConfig.value.pages;
  const currentPageKeys = Object.keys(currentPages);

  const idToDelete = activePageId.value;
  if (!idToDelete) return;

  const oldIndex = currentPageKeys.indexOf(idToDelete);

  const { [idToDelete]: deletedPage, ...remainingPages } = currentPages;
  campaignConfig.value.pages = remainingPages;

  const newPageKeys = Object.keys(remainingPages);
  const newActiveIndex = Math.max(0, oldIndex - 1);
  const nextActiveId = newPageKeys[newActiveIndex];

  activePageId.value = nextActiveId;
}

const { definitions } = useComponentProperties();
</script>

<template>
  <aside
    class="relative overflow-y-auto rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <template v-if="selectedSectionId && selectedSection">
      <div class="flex flex-col border-b border-neutral-300 dark:border-neutral-800">
        <div class="flex h-full flex-col bg-white dark:bg-neutral-950">
          <div class="mb-4 w-full rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
            <div class="flex flex-col items-start">
              <span class="text-xs font-bold text-neutral-900 capitalize dark:text-neutral-100"
                >{{ formatKebab(selectedSection?.component) }}
              </span>
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400"
                >Component</span
              >
            </div>
          </div>

          <div
            v-if="selectedSection?.template"
            class="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-neutral-900 dark:text-neutral-100"
                >Template</span
              >
              <span class="text-xs text-neutral-500 dark:text-neutral-400">{{
                formatKebab(selectedSection?.template)
              }}</span>
            </div>
            <div
              class="h-10 w-14 shrink-0 rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>
      </div>

      <div class="py-4" v-if="!definitions[selectedSection.component]">
        <div
          class="flex items-start gap-1.5 rounded border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <Icon name="lucide:triangle-alert" class="mt-px size-3 shrink-0" />
          <p>
            This component was added dynamically via code and hasn't been configured for editing in
            the builder. If you need to make changes to this component, please reach out to the
            developer assigned to this campaign.
          </p>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto py-4">
        <EditorPanel />
      </div>

      <div class="py-4">
        <Button variant="destructive" class="w-full cursor-pointer" @click="deleteFromButton">
          Delete Component
        </Button>
      </div>
    </template>

    <div v-else-if="!selectedSectionId && activePageConfig" class="flex h-full flex-col">
      <div class="mb-4 w-full rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
        <div class="flex flex-col items-start">
          <span class="text-xs font-bold text-neutral-900 capitalize dark:text-neutral-100"
            >{{ activePageId }}
          </span>
          <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Page</span>
        </div>
      </div>

      <div
        class="flex w-full items-center justify-between border-b border-neutral-300 pb-4 dark:border-neutral-800"
      >
        <div class="flex w-full flex-col items-start">
          <span class="text-xs font-bold text-neutral-900 dark:text-neutral-100">Template</span>
          <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {{ splitWord(formatKebab(activePageConfig.template), 1) || activePageConfig.template }}
          </span>
        </div>

        <div
          class="relative flex h-18 w-22 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <component
            class="-scale-[45%] rotate-180 object-cover"
            :is="
              resolveTemplateImage(
                splitWord(formatKebab(activePageConfig.template), 0),
                splitWord(formatKebab(activePageConfig.template), 1)
              )
            "
          />
        </div>
      </div>

      <div
        v-if="activePageConfig.states?.length"
        class="border-b border-neutral-300 py-4 dark:border-neutral-800"
      >
        <Collapsible title="States">
          <div class="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
            <button
              v-for="state in activePageConfig.states"
              :key="state"
              @click="handleStateClick(state)"
              class="cursor-pointer rounded-md border p-3 text-left transition-all"
              :class="[
                isActive(state)
                  ? 'border-purple-500 bg-purple-50 font-semibold text-purple-500 dark:bg-purple-500/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700',
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium capitalize">{{ state }}</span>
                <span v-if="isActive(state)" class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
              </div>
            </button>
          </div>
        </Collapsible>
      </div>

      <div class="py-4">
        <Collapsible title="Components">
          <div v-if="activePageConfig.sections.length" class="flex flex-col gap-1">
            <client-only>
              <draggable
                :list="activePageConfig.sections"
                group="components"
                item-key="id"
                handle=".drag-handle"
                class="custom-scrollbar space-y-1 overflow-y-auto rounded-lg bg-neutral-100 p-1.5 shadow-inner dark:bg-neutral-900/50 dark:shadow-none"
                style="max-height: 280px"
                ghost-class="opacity-50"
                :animation="200"
              >
                <template #item="{ element, index }">
                  <button
                    @click="builderStore.selectedSectionId = element.id"
                    :id="`component-${element.id}`"
                    class="group relative w-full shrink-0 overflow-hidden rounded-md border border-neutral-300 bg-white px-3 py-2 text-left transition-colors hover:border-purple-300 focus:ring-2 focus:ring-purple-500/50 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/50"
                  >
                    <div
                      :id="`wipe-${element.id}`"
                      class="absolute top-0 right-0 bottom-0 z-20 flex w-0 items-center justify-between overflow-hidden bg-red-600 px-0 transition-colors"
                    >
                      <div class="flex items-center gap-2 pl-4 whitespace-nowrap">
                        <Icon name="lucide:alert-triangle" class="text-white/80" size="16" />
                        <span class="text-xs font-bold text-white"> Confirm Deletion? </span>
                      </div>

                      <div class="flex items-center gap-2 pr-2">
                        <button
                          @click.stop="cancelDelete(element.id)"
                          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white/20 transition-colors hover:bg-white/30"
                        >
                          <Icon name="lucide:x" class="text-white" size="14" />
                        </button>
                        <button
                          @click.stop="confirmDelete(element.id, index)"
                          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white transition-colors hover:bg-neutral-100"
                        >
                          <Icon name="lucide:check" class="text-red-600" size="14" />
                        </button>
                      </div>
                    </div>

                    <div class="relative z-10 flex w-full items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          @click.stop
                          class="drag-handle flex h-6 w-5 cursor-grab items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                        >
                          <Icon name="lucide:grip-vertical" class="size-4" />
                        </div>
                        <span
                          class="text-xs font-medium transition-colors duration-300 select-none"
                          :class="
                            deleteStateIds.includes(element.id)
                              ? 'text-white'
                              : 'text-neutral-900 dark:text-neutral-100'
                          "
                        >
                          {{ formatKebab(element.component) }}
                        </span>
                      </div>

                      <button
                        @click.stop="promptDelete(element.id)"
                        type="button"
                        class="group flex h-6 w-6 cursor-pointer items-center justify-center rounded text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-500/10"
                      >
                        <Icon name="lucide:trash" size="14" />
                      </button>
                    </div>
                  </button>
                </template>
              </draggable>
            </client-only>
          </div>

          <div
            v-else
            class="group flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl bg-neutral-50/50 text-center dark:bg-neutral-900/30"
          >
            <div
              class="mb-4 flex size-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200 transition-transform duration-300 dark:bg-neutral-900 dark:ring-neutral-800"
            >
              <Icon
                name="lucide:component"
                class="text-neutral-400 dark:text-neutral-500"
                size="24"
              />
            </div>

            <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Start building your page
            </h3>
            <p
              class="mt-1.5 max-w-[240px] text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"
            >
              Drag and drop components from the sidebar onto the canvas to get started.
            </p>
          </div>
        </Collapsible>
      </div>

      <div class="mt-auto mb-4 bg-white dark:bg-transparent">
        <Button variant="destructive" class="w-full cursor-pointer" @click="handleDeletePage">
          Delete Page
        </Button>
      </div>
    </div>

    <div v-else class="flex h-full flex-col items-center justify-center text-center select-none">
      <div class="group relative mb-6 cursor-default">
        <div
          class="flex size-16 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors group-hover:border-neutral-300 group-hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:group-hover:border-neutral-700"
        >
          <Icon
            name="lucide:mouse-pointer-click"
            class="size-6 text-neutral-300 transition-colors group-hover:text-neutral-400 dark:text-neutral-600 dark:group-hover:text-neutral-500"
          />
        </div>

        <div
          class="absolute -top-2 -right-2 size-4 rounded bg-purple-100 ring-2 ring-white dark:bg-purple-900 dark:ring-neutral-950"
        />
        <div
          class="absolute -bottom-1 -left-1 size-3 rounded-full bg-blue-100 ring-2 ring-white dark:bg-blue-900 dark:ring-neutral-950"
        />
      </div>

      <div class="max-w-[240px] space-y-1">
        <h3
          class="text-xs font-semibold tracking-wide text-neutral-900 uppercase dark:text-neutral-100"
        >
          No Selection
        </h3>
        <p class="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Select a component on the canvas to view and edit its properties.
        </p>
      </div>
    </div>
  </aside>
</template>
