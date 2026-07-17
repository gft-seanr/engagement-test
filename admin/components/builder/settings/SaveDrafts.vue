<script setup lang="ts">
import { useStorage } from '@vueuse/core';

const builderStore = useBuilderStore();

const { campaignConfig } = storeToRefs(builderStore);

interface SaveFile {
  id: string;
  campaignId: string;
  name: string;
  timestamp: number;
  config: any;
}

const route = useRoute();
const editCampaignId = computed(() => route.query.editId as string);

const savedDrafts = useStorage<SaveFile[]>('builder-saves', []);

const currentCampaignDrafts = computed(() => {
  if (!editCampaignId.value) return [];
  return savedDrafts.value.filter((draft: SaveFile) => draft.campaignId === editCampaignId.value);
});

const loadDraft = (saveFile: SaveFile) => {
  if (confirm('Load this draft? Any unsaved changes on the canvas will be lost.')) {
    campaignConfig.value = JSON.parse(JSON.stringify(saveFile.config));
  }
  deleteDraft(saveFile.id);
};

const deleteDraft = (id: string) => {
  savedDrafts.value = savedDrafts.value.filter((draft) => draft.id !== id);
};
</script>

<template>
  <div v-if="currentCampaignDrafts.length > 0" class="group relative">
    <button
      class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      <Icon name="lucide:history" size="14" />
      <span>Load Draft ({{ savedDrafts.length }})</span>
    </button>

    <div
      class="absolute top-full right-0 z-10 mt-1 hidden w-64 flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl group-hover:flex dark:border-neutral-700 dark:bg-neutral-800"
    >
      <div class="mb-1 px-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
        Recent Saves
      </div>

      <div
        v-for="draft in currentCampaignDrafts"
        :key="draft.id"
        class="group/item flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <button @click="loadDraft(draft)" class="flex flex-col text-left">
          <span class="text-xs font-medium text-neutral-700 dark:text-neutral-200">{{
            draft.name
          }}</span>
          <span class="text-[10px] text-neutral-400">{{
            new Date(draft.timestamp).toLocaleDateString()
          }}</span>
        </button>
        <button
          @click="deleteDraft(draft.id)"
          class="hidden p-1 text-red-500 group-hover/item:block hover:text-red-600"
        >
          <Icon name="lucide:trash-2" size="12" />
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-xs text-neutral-400">No drafts saved yet.</div>
</template>
