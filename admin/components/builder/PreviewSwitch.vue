<script setup lang="ts">
import { computed } from 'vue';

const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);

const mode = defineModel<'build' | 'preview'>('mode', { default: 'build' });

const isBuild = computed(() => mode.value === 'build');

const hasPages = computed(() => {
  return !!campaignConfig.value.pages && Object.keys(campaignConfig.value.pages).length > 0;
});

function setMode(newMode: 'build' | 'preview') {
  mode.value = newMode;
}
</script>

<template>
  <div
    class="flex items-center rounded-lg bg-neutral-100 p-1 transition-colors duration-300 dark:bg-neutral-900"
  >
    <button
      @click="setMode('build')"
      aria-label="Switch to build mode"
      class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200"
      :class="[
        isBuild
          ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-500 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/50'
          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
      ]"
    >
      <Icon name="lucide:hammer" class="h-4 w-4" />
      Build
    </button>

    <button
      @click="setMode('preview')"
      :disabled="!hasPages"
      aria-label="Switch to preview mode"
      class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent disabled:hover:text-neutral-300 dark:disabled:text-neutral-700"
      :class="[
        !isBuild
          ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-500 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/50'
          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
      ]"
    >
      <Icon name="lucide:eye" class="h-4 w-4" />
      Preview
    </button>
  </div>
</template>
