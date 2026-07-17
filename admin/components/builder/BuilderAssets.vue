<script setup lang="ts">
import draggable from 'vuedraggable';
import Collapsible from '~/admin/components/admin-ui/Collapsible.vue';
import CreatePageModal from '~admin/components/builder/modals/CreatePage.vue';
import DragOverlay from './DragOverlay.vue';
import { useModalStore } from '~admin/stores/modal';
import { useComponentProperties } from '~/admin/composables/builder/useComponentProperties';
import GenericPreview from './preview/GenericPreview.vue';

interface ComponentProperties {
  name?: string;
  [key: string]: any;
}

const LAYOUT_OFFSET_PX = 200;

const dragOptions = {
  group: {
    name: 'campaign-builder',
    pull: 'clone',
    put: false,
    revertClone: true,
  },
  sort: false,
};

const modalStore = useModalStore();
const builderStore = useBuilderStore();
const { campaignConfig, activePageId, activeCanvasTool, isDragging, activeState } =
  storeToRefs(builderStore);
const { semanticCategories } = useComponentProperties();

const componentSearchQuery = ref<string>('');
const draggedComponent = shallowRef<ComponentProperties | null>(null);
const COMPONENT_SPACE_TO_SUBTRACT = ref<number>(0);

const pages = computed(() => {
  const pagesMap = campaignConfig.value.pages || {};

  return Object.keys(pagesMap).map((key) => {
    return {
      id: key, // "home", "login"
      ...pagesMap[key], // { template: "", sections: [] }
    };
  });
});

const filteredComponents = computed(() => {
  if (!componentSearchQuery.value) {
    return semanticCategories;
  }

  const query = componentSearchQuery.value.toLowerCase();
  const filtered: Record<string, ComponentProperties[]> = {};

  Object.keys(semanticCategories).forEach((groupName) => {
    const components = semanticCategories[groupName].filter((component) =>
      component.name?.toLowerCase().includes(query)
    );

    if (components.length > 0) {
      filtered[groupName] = components;
    }
  });

  return filtered;
});

function generateInstanceId(baseId?: string) {
  const cryptoObj = (globalThis as any)?.crypto;

  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    try {
      return cryptoObj.randomUUID();
    } catch (e) {
      // fallthrough to fallback
    }
  }

  return `${baseId ?? 'component'}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function deepClone<T>(value: T): T {
  const sc = (globalThis as any)?.structuredClone;

  if (typeof sc === 'function') {
    return sc(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function handleClone(item: ComponentProperties) {
  const { props, rootOverrides } = extractDefaultsAndOverrides(item.properties || {});

  const instanceId = generateInstanceId(item?.id);

  const hasStateProperty = item.properties?.state?.root === true;
  console.log('hasStateProperty', hasStateProperty, item.properties?.state);
  const finalRootOverrides =
    hasStateProperty && activeState.value
      ? { ...rootOverrides, state: activeState.value }
      : rootOverrides;

  console.log('finalRootOverrides', finalRootOverrides);
  return {
    id: instanceId,
    component: item?.id ?? 'component',
    ...(finalRootOverrides ? { ...finalRootOverrides } : {}),
    props: deepClone(props || {}),
    classes: {},
    attrs: {},
  };
}

function handleDragStart(evt: any) {
  const rawItem = evt.item.__draggable_context.element;

  isDragging.value = true;

  draggedComponent.value = rawItem;
}

function handleDragEnd() {
  isDragging.value = false;
  draggedComponent.value = null;
}

function handleSetData(dataTransfer: any) {
  const img = new Image();
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  dataTransfer.setDragImage(img, 0, 0);
}
</script>

<template>
  <aside
    class="relative flex h-[calc(100dvh-5.5rem)] flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div class="flex flex-1 flex-col gap-4 p-4">
      <Collapsible
        title="Pages"
        sticky
        class="shrink-0"
        @content-resize="(h) => (COMPONENT_SPACE_TO_SUBTRACT = h + LAYOUT_OFFSET_PX)"
      >
        <div
          v-if="pages.length === 0"
          class="mb-2 flex flex-col items-center justify-center overflow-y-auto bg-white text-center dark:bg-neutral-950"
        >
          <div
            class="my-2 flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200 transition-transform duration-300 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <Icon
              name="lucide:panels-top-left"
              class="text-neutral-400 dark:text-neutral-500"
              size="24"
            />
          </div>

          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            No pages yet.
          </h3>

          <button
            @click="modalStore.open(CreatePageModal)"
            type="button"
            class="my-4 rounded-lg bg-purple-600 px-4 py-1.5 text-[10px] font-medium text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-sm active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            Create Page
          </button>
        </div>

        <div v-else ref="pagesEl" class="flex flex-col gap-1">
          <div class="space-y-1 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
            <button
              v-for="page in pages"
              :key="page.id"
              @click="builderStore.setActivePage(page.id)"
              class="flex w-full cursor-pointer items-start rounded-md border p-3 text-left transition-all"
              :class="[
                activePageId === page.id
                  ? 'border-purple-500 bg-purple-50 font-medium text-purple-500 dark:bg-purple-500/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700',
              ]"
            >
              <span class="text-xs font-medium capitalize">{{ page.id }}</span>
            </button>
          </div>
        </div>

        <template #actions>
          <button
            @click="modalStore.open(CreatePageModal)"
            type="button"
            class="size-4 cursor-pointer text-neutral-400 transition-colors duration-200 hover:text-purple-600 dark:text-neutral-500 dark:hover:text-purple-400"
          >
            <Icon name="lucide:plus" />
          </button>
        </template>
      </Collapsible>

      <Collapsible title="Components" sticky>
        <div
          class="flex flex-col gap-4 overflow-y-auto"
          :style="{
            maxHeight: `calc(100dvh - ${COMPONENT_SPACE_TO_SUBTRACT}px)`,
          }"
        >
          <div class="sticky top-0 z-10 bg-white pb-2 dark:bg-neutral-950">
            <div class="relative shrink-0">
              <Icon
                name="lucide:search"
                class="absolute top-1/2 left-2 -translate-y-1/2 text-neutral-500"
              />
              <input
                v-model="componentSearchQuery"
                type="search"
                class="w-full rounded-lg bg-neutral-100 p-2 pl-8 text-xs focus:outline-none dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600"
                placeholder="Search"
              />
            </div>
          </div>

          <div
            v-if="Object.keys(filteredComponents).length === 0"
            class="flex flex-col items-center justify-center px-4 py-10 text-center"
          >
            <div
              class="my-2 flex size-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200 transition-transform duration-300 dark:bg-neutral-900 dark:ring-neutral-800"
            >
              <Icon
                name="lucide:search-x"
                class="text-neutral-400 dark:text-neutral-500"
                size="24"
              />
            </div>

            <h3 class="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              No components found
            </h3>
            <p
              class="mt-1 max-w-[180px] text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400"
            >
              We couldn't find anything matching "<span
                class="font-medium text-purple-500 dark:text-purple-400"
                >{{ componentSearchQuery }}</span
              >"
            </p>

            <button
              @click="componentSearchQuery = ''"
              type="button"
              class="mt-3 inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              Clear search
            </button>
          </div>

          <DragOverlay v-if="isDragging" :element="draggedComponent" />

          <div
            v-for="(components, groupName) in filteredComponents"
            :key="groupName"
            class="flex flex-col gap-2"
          >
            <span class="text-xs font-semibold text-neutral-900 capitalize dark:text-neutral-200">{{
              groupName
            }}</span>
            <client-only>
              <draggable
                class="flex flex-wrap gap-2"
                :list="components"
                v-bind="dragOptions"
                :set-data="handleSetData"
                item-key="id"
                :force-fallback="true"
                :clone="handleClone"
                @start="handleDragStart"
                @end="handleDragEnd"
              >
                <template #item="{ element: component }">
                  <div class="group relative flex w-[48%] cursor-grab flex-col gap-1.5 select-none">
                    <div
                      class="relative h-28 w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition-all duration-200 group-hover:border-purple-500 group-hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:group-hover:border-purple-500/50"
                    >
                      <div class="grid h-full w-full place-items-center">
                        <Component :is="component.thumbnail || GenericPreview" />
                      </div>
                    </div>
                    <span
                      class="text-center text-[10px] font-medium break-all text-neutral-600 capitalize group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                    >
                      {{ formatKebab(component.name) }}
                    </span>
                  </div>
                </template>
              </draggable>
              <template #fallback>
                <div class="animate-pulse text-[10px] text-neutral-400">Fetching components...</div>
              </template>
            </client-only>
          </div>
        </div>
      </Collapsible>
    </div>
  </aside>
</template>

<style scoped>
.sortable-drag {
  opacity: 0 !important;
}

.sortable-fallback {
  opacity: 0 !important;
  display: none !important;
}
</style>
