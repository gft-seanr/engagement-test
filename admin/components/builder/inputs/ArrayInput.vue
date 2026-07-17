<script setup lang="ts">
import { ref } from 'vue';
import { INPUT_COMPONENTS } from '~/admin/constants/builder/inputs';
import ContextMenu from '~admin/components/shared/ContextMenu.vue';

const propsModel = defineModel<Record<string, any>[]>('props', {
  default: () => [],
});

const props = defineProps<{
  label?: string;
  itemSchema: Record<string, any>;
}>();

const isExpanded = ref<boolean[]>(propsModel.value.map(() => false));

const addItem = () => {
  if (!propsModel.value) propsModel.value = [];

  const newItem: Record<string, any> = {};
  Object.entries(props.itemSchema).forEach(([key, config]: [string, any]) => {
    newItem[key] = config.default ?? '';
  });

  propsModel.value.push(newItem);

  isExpanded.value.push(true);
};

const removeItem = (index: number) => {
  propsModel.value.splice(index, 1);

  isExpanded.value.splice(index, 1);
};

const isMenuOpen = ref(false);

const triggerEl = ref<HTMLElement | null>(null);
const selectedItemIndex = ref<number | null>(null);
function handleOpen(index: number, event: MouseEvent) {
  triggerEl.value = event.currentTarget as HTMLElement;
  isMenuOpen.value = true;
  selectedItemIndex.value = index;
}

function handleCloseMenu() {
  isMenuOpen.value = false;
  selectedItemIndex.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-800">
      <button
        v-for="(_, index) in propsModel"
        :key="index"
        @click="handleOpen(index, $event)"
        class="cursor-pointer rounded-md border border-neutral-200 bg-white px-3 py-2 text-left transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
      >
        <span
          class="text-xs font-semibold text-neutral-900 capitalize select-none dark:text-neutral-100"
        >
          {{ props.label || 'Item' }} {{ index + 1 }}
        </span>
      </button>

      <button
        @click="addItem"
        class="group flex w-full items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white/50 px-3 py-2 text-neutral-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
      >
        <div
          class="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors group-hover:border-purple-400 group-hover:text-purple-600 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:text-purple-400"
        >
          <Icon name="lucide:plus" class="size-3" />
        </div>
        <span class="text-xs font-medium">Add {{ props.label || 'Item' }}</span>
      </button>
    </div>

    <ContextMenu
      :open="isMenuOpen"
      :trigger="triggerEl"
      :menu-width="350"
      :gap="26"
      @close="handleCloseMenu"
    >
      <div class="flex w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-neutral-900">
        <div
          class="flex items-center justify-between border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3
            class="text-xs font-semibold tracking-wider text-neutral-900 uppercase dark:text-neutral-100"
          >
            Edit Properties
          </h3>
          <button
            @click="handleCloseMenu"
            class="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <Icon name="lucide:x" class="size-3.5" />
          </button>
        </div>

        <div class="no-scrollbar flex-1 overflow-y-auto p-4">
          <div class="flex flex-col gap-5">
            <template v-for="(fieldConfig, fieldKey) in itemSchema" :key="fieldKey">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold capitalize dark:text-neutral-200">
                    {{ fieldConfig.label || fieldKey }}
                  </label>
                </div>

                <component
                  v-if="INPUT_COMPONENTS[fieldConfig.type]"
                  v-model:props="propsModel[selectedItemIndex!][fieldKey]"
                  :is="INPUT_COMPONENTS[fieldConfig.type]"
                  v-bind="fieldConfig"
                  :placeholder="fieldConfig.default"
                  class="w-full"
                />

                <p
                  v-if="fieldConfig.description"
                  class="mt-0.5 text-[10px] leading-tight text-neutral-400 dark:text-neutral-500"
                >
                  {{ fieldConfig.description }}
                </p>
              </div>
            </template>
          </div>
        </div>

        <div
          class="flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <button
            v-if="selectedItemIndex !== null"
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
            @click="
              () => {
                removeItem(selectedItemIndex!);
                handleCloseMenu();
              }
            "
          >
            <Icon name="lucide:trash-2" class="size-3.5" />
            Remove
          </button>
        </div>
      </div>
    </ContextMenu>
  </div>
</template>
