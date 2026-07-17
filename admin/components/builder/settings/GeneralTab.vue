<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useBuilderStore } from '~/admin/stores/builder';
import { watchDebounced } from '@vueuse/core';

import UrlHolder from '~/admin/components/builder/settings/UrlHolder.vue';

const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);
const route = useRoute();

if (!campaignConfig.value.pageHead) {
  campaignConfig.value.pageHead = { title: '', description: '' };
}

const localTitle = ref(campaignConfig.value.pageHead.title || '');

watchDebounced(
  localTitle,
  (newTitle) => {
    campaignConfig.value.pageHead.title = newTitle;
    console.log('[GeneralTab] Updated page title:', newTitle);
  },
  { debounce: 600 }
);

const editCampaignId = computed(() => route.query.editId as string);

const stagingCampaignUrl = computed(() => {
  const base = `https://gentle-river-06010fb10-staging.centralus.6.azurestaticapps.net/campaign/${editCampaignId.value}`;
  const pages = campaignConfig.value.pages || {};

  if (pages.register) return `${base}/register`;
  if (pages.login) return `${base}/login`;
  return `${base}/`;
});

const liveCampaignUrl = computed(() => {
  const base = `https://engagement.giftaway.ph/campaign/${editCampaignId.value}`;
  const pages = campaignConfig.value.pages || {};

  if (pages.register) return `${base}/register`;
  if (pages.login) return `${base}/login`;
  return `${base}/`;
});

onBeforeUnmount(() => {
  if (localTitle.value !== campaignConfig.value.pageHead.title) {
    campaignConfig.value.pageHead.title = localTitle.value;
  }
});
</script>

<template>
  <div class="mb-4 flex flex-col gap-1">
    <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">General Settings</h3>
    <p class="text-[13px] text-neutral-500 dark:text-neutral-400">
      Manage campaign identity, browser metadata, and deployment URLs.
    </p>
  </div>

  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Browser Identity</h4>

      <div
        class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="flex items-end gap-4 border-b border-neutral-200 bg-neutral-100/70 px-4 pt-4 dark:border-neutral-700 dark:bg-neutral-800/70"
        >
          <div class="mb-3 flex items-center gap-1.5 opacity-60">
            <div class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
            <div class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
            <div class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
          </div>

          <div
            class="relative flex h-8 max-w-[220px] min-w-[160px] flex-1 items-center gap-2 rounded-t-lg border-x border-t border-neutral-200/50 bg-white px-3 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] dark:border-neutral-700/50 dark:bg-neutral-900"
          >
            <Icon name="lucide:layout-template" class="size-3.5 shrink-0 text-purple-500" />
            <span
              class="truncate text-[11px] font-semibold tracking-wide text-neutral-700 dark:text-neutral-300"
            >
              {{ localTitle || 'Untitled Campaign' }}
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-[12px] font-medium text-neutral-700 dark:text-neutral-300"
              >Page Title</label
            >
            <div
              class="group relative flex h-9 items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-inner transition-all focus-within:border-purple-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500/20 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900/50 dark:focus-within:bg-neutral-900 dark:hover:border-neutral-600"
            >
              <div
                class="flex h-full items-center justify-center pr-2 pl-3 text-neutral-400 transition-colors group-focus-within:text-purple-500 dark:text-neutral-500"
              >
                <Icon name="lucide:text-cursor-input" class="size-3.5" />
              </div>
              <input
                v-model="localTitle"
                type="text"
                placeholder="e.g., Brand - Promo | Home"
                class="h-full w-full appearance-none bg-transparent py-1 pr-3 text-[13px] text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <p class="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              This appears in the browser tab when users visit your page.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Deployment Links</h4>

      <div
        class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/30"
      >
        <UrlHolder
          :campaignUrl="stagingCampaignUrl"
          title="Staging URL"
          description="The default staging entry point for testing this campaign."
        />

        <div class="h-px w-full bg-neutral-200 dark:bg-neutral-800"></div>

        <UrlHolder
          :campaignUrl="liveCampaignUrl"
          title="Live URL"
          description="The public live entry point for this campaign. The live campaign ID may differ from staging."
        />
      </div>
    </div>
  </div>
</template>
