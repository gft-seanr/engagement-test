<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query';
import { createCampaign, getCampaigns } from '~/admin/services/builder/settings';
import { programStatusId } from '~/admin/types/builder';
import StepInfo from '~admin/components/builder/dashboard/form/steps/CampaignInfo.vue';
import StepSchedule from '~admin/components/builder/dashboard/form/steps/CampaignSchedule.vue';
import SheetLayout from '~admin/components/builder/dashboard/SheetLayout.vue';
import CardThumbnail from '~admin/components/builder/dashboard/CardThumbnail.vue';
import CreateCampaignSheet from '~/admin/components/builder/modals/CreateCampaignSheet.vue';

definePageMeta({
  name: 'campaign-builder-home',
  layout: 'ge-admin',
  middleware: ['admin', 'entry'],
  breadcrumbs: [{ label: 'Campaigns' }],
});

interface StatusItem {
  label: string;
  icon: string;
  classes: string;
}

const route = useRoute();
const campaignId = computed(() => route.params.campaignId as string | undefined);

const activeFilter = ref('All');
const statusFilters = ['All', 'Live', 'UAT', 'Draft'];

const searchQuery = ref('');
const isCreateModalOpen = ref(false);

const statusConfig: Record<number, StatusItem> = {
  [programStatusId.Live]: {
    label: 'Live',
    icon: 'lucide:rocket',
    classes: 'bg-green-100 text-green-700',
  },
  [programStatusId.UAT]: {
    label: 'UAT',
    icon: 'lucide:test-tube-2',
    classes: 'bg-blue-100 text-blue-700',
  },
  [programStatusId.Draft]: {
    label: 'Draft',
    icon: 'lucide:file-text',
    classes: 'bg-slate-100 text-slate-700',
  },
};

const { isPending: isCampaignsPending, data } = useQuery({
  queryKey: ['campaigns', campaignId.value],
  queryFn: () => getCampaigns(campaignId.value),
});

const campaigns = computed(() => {
  if (!data.value) return [];
  return data.value.data.programs || [];
});

const filteredCampaigns = computed(() => {
  let result = campaigns.value;

  if (activeFilter.value !== 'All') {
    result = result.filter((campaign: any) => {
      const statusId = campaign.programStatusId;
      const campaignStatusLabel = statusConfig[statusId]?.label || 'Draft';
      return campaignStatusLabel === activeFilter.value;
    });
  }

  const query = searchQuery.value.trim().toLowerCase();

  if (query) {
    const searchTerms = query.split(/[\s\-:]+/).filter(Boolean);

    result = result.filter((campaign: any) => {
      const name = campaign.name?.toLowerCase() || '';
      return searchTerms.every((term) => name.includes(term));
    });
  }

  return result;
});

function clearSearch() {
  searchQuery.value = '';
}

function openBuilder(campaignIdToEdit: string) {
  navigateTo({
    name: 'campaign-builder-builder',
    query: {
      editId: campaignIdToEdit,
    },
  });
}
</script>

<template>
  <div
    class="flex h-full w-full flex-col overflow-hidden bg-white transition-colors duration-300 dark:bg-neutral-950"
  >
    <div class="flex w-full items-center gap-4 p-8">
      <div class="group relative">
        <Icon
          name="lucide:search"
          class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-gray-500 dark:text-neutral-500"
        />
        <input
          v-model="searchQuery"
          type="search"
          class="h-10 w-[240px] rounded-lg border border-purple-200 bg-white pr-4 pl-9 text-xs text-gray-900 placeholder-gray-500 shadow-lg shadow-purple-500/10 transition-all focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600 dark:shadow-none dark:focus:border-purple-500/50"
          placeholder="Search campaigns..."
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-neutral-200"
        >
          <Icon name="lucide:x" class="size-3.5" />
        </button>
      </div>

      <div
        class="flex h-10 items-center rounded-lg border border-gray-200/80 bg-gray-50/80 p-1 shadow-inner dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
      >
        <button
          v-for="filter in statusFilters"
          :key="filter"
          @click="activeFilter = filter"
          class="relative flex h-full cursor-pointer items-center justify-center rounded-md px-3.5 text-[11px] font-semibold tracking-wide transition-all duration-200 ease-out"
          :class="
            activeFilter === filter
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/5'
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800 dark:text-neutral-500 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-300'
          "
        >
          {{ filter }}
        </button>
      </div>

      <div class="ml-auto">
        <button
          class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow active:scale-[0.97]"
          @click="isCreateModalOpen = true"
        >
          <Icon name="lucide:plus" class="size-4" />
          <span>Create</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto px-8 py-4">
      <div
        v-if="isCampaignsPending"
        class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] items-stretch gap-6"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="m-2 h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800"></div>
          <div class="flex flex-1 flex-col justify-between px-4 py-4">
            <div class="flex flex-col gap-3">
              <div class="h-4 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800"></div>
              <div class="h-3 w-1/3 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800"></div>
            </div>
            <div class="mt-6 flex flex-col gap-4">
              <div class="h-px w-full bg-gray-100 dark:bg-neutral-800"></div>
              <div class="flex items-center gap-2 pb-1">
                <div
                  class="size-4 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800"
                ></div>
                <div
                  class="h-3 w-1/2 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="campaigns.length === 0"
        class="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div
          class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 ring-8 ring-purple-50 dark:bg-purple-900/30 dark:ring-purple-900/10"
        >
          <Icon
            name="lucide:layout-template"
            class="size-10 text-purple-600 dark:text-purple-400"
          />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-neutral-100">No campaigns yet</h3>
        <p class="mt-2 max-w-sm text-sm text-gray-500 dark:text-neutral-400">
          You don't have any active campaigns right now. Start building your first one to engage
          your audience.
        </p>
      </div>

      <div
        v-else-if="filteredCampaigns.length === 0"
        class="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-slate-50/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div
          class="mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-neutral-800 dark:ring-white/5"
        >
          <Icon name="lucide:search" class="h-5 w-5 text-slate-400 dark:text-neutral-500" />
        </div>
        <h3 class="text-[15px] font-semibold text-slate-900 dark:text-neutral-100">
          No matching campaigns
        </h3>
        <p class="mt-1.5 max-w-sm text-[13px] leading-relaxed text-slate-500 dark:text-neutral-400">
          We couldn't find anything matching "<span
            class="font-medium text-slate-700 dark:text-neutral-200"
            >{{ searchQuery }}</span
          >".
        </p>
        <button
          class="mt-6 flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          @click="clearSearch"
        >
          Clear search
        </button>
      </div>

      <div v-else class="w-full overflow-y-auto pr-2 pb-10">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] items-stretch gap-6">
          <button
            @dblclick="openBuilder(campaign.campaignId)"
            v-for="campaign in filteredCampaigns"
            :key="campaign.id"
            class="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all hover:border-purple-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/50"
          >
            <div
              class="relative m-2 flex h-48 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div class="absolute top-0 right-0 z-10 p-2">
                <div
                  v-if="statusConfig[campaign.programStatusId as programStatusId]"
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md transition-colors"
                  :class="statusConfig[campaign.programStatusId as programStatusId].classes"
                >
                  <Icon
                    :name="statusConfig[campaign.programStatusId as programStatusId].icon"
                    class="mr-1.5 h-4 w-4"
                  />
                  {{ statusConfig[campaign.programStatusId as programStatusId].label }}
                </div>
              </div>
              <CardThumbnail />
            </div>

            <div class="flex flex-1 flex-col justify-between px-4 py-3">
              <span
                class="line-clamp-2 text-[14px] font-semibold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-neutral-100 dark:group-hover:text-purple-400"
              >
                {{ campaign.name }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <CreateCampaignSheet
    v-model:open="isCreateModalOpen"
    :campaign-id="campaignId"
    @created="openBuilder"
  />
</template>
