<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { getSchemaSettings } from '~/admin/services/builder/settings';

definePageMeta({
  name: 'v1-campaign-editor',
  layout: 'ge-admin',
  breadcrumbs: [{ label: 'Campaign Editor' }],
  middleware: ['admin', 'entry'],
});

const adminAppStore = useAdminAppStore();
const { currentCampaignId } = storeToRefs(adminAppStore);

// Form State
const editCampaignId = ref<string>('');
const settingsContent = ref<string>('');
const originalSettingsContent = ref<string>('');

const isAltered = computed(() => {
  return settingsContent.value !== originalSettingsContent.value;
});

const { isFetching, refetch } = useQuery({
  queryKey: ['campaignSettings', editCampaignId],
  queryFn: () => getSchemaSettings(editCampaignId.value),
  enabled: false,
  retry: 1,
});

async function handleFetch() {
  if (!editCampaignId.value) {
    alert('Please enter a Campaign ID');
    return;
  }

  const { data, isSuccess, isError } = await refetch();

  if (isSuccess && data) {
    const formattedData = JSON.stringify(data.data, null, 2);
    settingsContent.value = formattedData;
    originalSettingsContent.value = formattedData;
  } else if (isError) {
    alert('Failed to fetch settings. Please check the Campaign ID.');
  }
}

const { isPending: isUpdating, mutate } = useMutation({
  mutationFn: (params: any) => updateSettings(params),
  onSuccess: (response: any) => {
    if (response?.isSuccessful !== false) {
      alert('Settings updated successfully!');
      originalSettingsContent.value = settingsContent.value;
    } else {
      console.error('Update failed:', response);
      alert('Update failed! Check console for details.');
    }
  },
  onError: (error) => {
    console.error('Error:', error);
    alert('An error occurred while updating.');
  },
});

function handleUpdate() {
  if (!editCampaignId.value || !settingsContent.value) {
    alert('Campaign ID and Settings are required.');
    return;
  }

  let parsedSettings = {};

  try {
    parsedSettings = JSON.parse(settingsContent.value);
  } catch (err) {
    alert('Invalid JSON format! Please check your syntax before saving.');
    return;
  }

  mutate({
    bearerId: currentCampaignId.value,
    id: editCampaignId.value,
    settingsType: 5211,
    settings: parsedSettings,
  });
}
</script>

<template>
  <div
    class="flex h-full flex-col bg-neutral-50/50 p-4 transition-colors duration-300 md:p-6 dark:bg-neutral-950"
  >
    <div
      class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div class="relative flex flex-1 flex-col overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-neutral-100 px-6 py-3 dark:border-neutral-800/50"
        >
          <span
            class="text-[11px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500"
          >
            JSON Configuration
          </span>
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
          >
            <span
              v-if="isAltered"
              class="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-500"
            >
              UNSAVED
            </span>
          </Transition>
        </div>

        <textarea
          :disabled="!settingsContent"
          v-model="settingsContent"
          class="h-full w-full resize-none bg-transparent p-6 font-mono text-[14px] leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-300 dark:text-neutral-200 dark:placeholder:text-neutral-700"
          placeholder="Paste or edit your JSON here..."
        />
      </div>

      <div
        class="border-t border-neutral-100 bg-white p-4 transition-colors dark:border-neutral-800/60 dark:bg-neutral-900"
      >
        <div class="mx-auto flex max-w-3xl items-center gap-3">
          <div class="relative flex-1">
            <input
              v-model="editCampaignId"
              type="text"
              placeholder="Enter Campaign ID..."
              class="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 text-sm font-medium text-neutral-900 transition-all duration-200 placeholder:text-neutral-400 focus:border-purple-500/50 focus:outline-none dark:border-neutral-700/50 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-purple-500/50"
            />

            <div
              v-if="editCampaignId"
              class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-neutral-200/50 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              ID
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="handleFetch"
              :disabled="isFetching || !editCampaignId"
              class="group flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition-all hover:border-neutral-300 hover:text-purple-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-purple-400"
            >
              <Icon v-if="isFetching" name="lucide:loader-circle" class="size-5 animate-spin" />
              <Icon
                v-else
                name="lucide:cloud-download"
                class="size-5 transition-transform group-hover:-translate-y-0.5"
              />
            </button>

            <button
              @click="handleUpdate"
              :disabled="isUpdating || !isAltered"
              class="flex h-12 items-center gap-2 rounded-xl bg-purple-600 px-6 text-[13px] font-bold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
            >
              <Icon v-if="isUpdating" name="lucide:loader-circle" class="size-4 animate-spin" />
              <Icon v-else name="lucide:send" class="size-4" />
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
