<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import ContextMenu from '../../shared/ContextMenu.vue';

const isOpen = ref(false);
const searchQuery = ref('');
const containerRef = useTemplateRef<HTMLElement | null>('containerRef');
const allIcons = ref<string[]>([]);
const isLoading = ref(false);

const filteredIcons = computed(() => {
  if (!searchQuery.value) return allIcons.value.slice(0, 100);

  const query = searchQuery.value.toLowerCase();
  return allIcons.value.filter((icon) => icon.includes(query)).slice(0, 100);
});

const propsModel = defineModel<string>('props');

function selectIcon(iconName: string) {
  const formattedValue = `lucide:${iconName}`;
  propsModel.value = formattedValue;
  isOpen.value = false;
}

function clearIcon() {
  propsModel.value = '';
  isOpen.value = false;
}

const currentIconName = computed(() => {
  return propsModel.value?.replace('lucide:', '') || '';
});

const isMenuOpen = ref(false);

onClickOutside(containerRef, () => (isOpen.value = false));

watch(isOpen, (val) => {
  if (val) searchQuery.value = '';
});

onMounted(async () => {
  if (allIcons.value.length > 0) return;

  isLoading.value = true;
  try {
    const res = await fetch('https://api.iconify.design/collection?prefix=lucide');
    const data = await res.json();
    if (data && data.uncategorized) {
      allIcons.value = data.uncategorized;
    }
  } catch (e) {
    console.error('Failed to load icons', e);

    allIcons.value = ['home', 'user', 'settings', 'search', 'menu', 'x', 'chevron-down'];
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="relative w-full" ref="containerRef">
    <button
      type="button"
      @click="isMenuOpen = true"
      class="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-xs text-neutral-600 transition-all hover:bg-neutral-200 focus:outline focus:outline-purple-500 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700/80 dark:focus:outline-purple-400"
    >
      <div
        class="flex size-5 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
      >
        <Icon v-if="propsModel" :name="propsModel" class="size-3.5" />
        <Icon v-else name="lucide:image" class="size-3.5 opacity-50" />
      </div>

      <span class="flex-1 truncate text-left">
        {{ currentIconName || 'Select icon...' }}
      </span>
    </button>

    <ContextMenu
      :open="isMenuOpen"
      :trigger="containerRef"
      :menu-width="260"
      :gap="160"
      @close="isMenuOpen = false"
    >
      <div
        class="flex flex-col overflow-hidden rounded-lg bg-white font-sans text-[11px] shadow-lg ring-1 ring-neutral-200 dark:bg-neutral-900 dark:shadow-none dark:ring-neutral-800"
      >
        <div
          class="border-b border-neutral-100 bg-neutral-50/50 p-2 dark:border-neutral-800 dark:bg-neutral-900/50"
        >
          <div class="relative">
            <Icon
              name="lucide:search"
              class="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search icons..."
              class="w-full rounded border border-neutral-200 bg-white py-1.5 pr-2 pl-7 text-xs text-neutral-700 placeholder-neutral-400 transition-all outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:placeholder-neutral-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/30"
              autoFocus
            />
          </div>
        </div>

        <div class="no-scrollbar grid max-h-60 grid-cols-6 gap-1 overflow-y-auto p-2">
          <div
            v-if="isLoading"
            class="col-span-6 flex flex-col items-center gap-2 py-6 text-center text-[10px] text-neutral-400 dark:text-neutral-500"
          >
            <Icon name="lucide:loader-2" class="size-4 animate-spin" />
            <span>Loading library...</span>
          </div>

          <div
            v-else-if="filteredIcons.length === 0"
            class="col-span-6 py-6 text-center text-[10px] text-neutral-400 dark:text-neutral-500"
          >
            No icons found.
          </div>

          <button
            v-for="icon in filteredIcons"
            :key="icon"
            type="button"
            @click="selectIcon(icon)"
            class="group relative flex aspect-square items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            :class="{
              'bg-purple-50 text-purple-600 ring-1 ring-purple-200 hover:bg-purple-50 hover:text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 dark:ring-purple-500/30 dark:hover:bg-purple-500/20 dark:hover:text-purple-400':
                currentIconName === icon,
            }"
            :title="icon"
          >
            <Icon
              :name="`lucide:${icon}`"
              class="size-4 transition-transform group-hover:scale-110"
            />
          </button>
        </div>

        <div
          class="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900/80"
        >
          <span class="text-[9px] text-neutral-400 dark:text-neutral-500">
            {{ filteredIcons.length }} results
          </span>
          <button
            v-if="propsModel"
            @click="clearIcon"
            type="button"
            class="flex items-center gap-1 text-[9px] font-medium text-neutral-500 transition-colors hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400"
          >
            <Icon name="lucide:trash-2" class="size-3" />
            Clear
          </button>
        </div>
      </div>
    </ContextMenu>
  </div>
</template>
