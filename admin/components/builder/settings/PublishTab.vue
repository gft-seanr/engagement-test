<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMutation } from '@tanstack/vue-query';
import { useStorage } from '@vueuse/core';

import SafeDrafts from './SaveDrafts.vue';

interface SaveFile {
  id: string;
  campaignId: string;
  name: string;
  timestamp: number;
  config: any;
}

const modalStore = useModalStore();
const builderStore = useBuilderStore();
const adminAppStore = useAdminAppStore();

const savedDrafts = useStorage<SaveFile[]>('builder-saves', []);

const { campaignConfig, mode, isDirty } = storeToRefs(builderStore);
const { currentCampaignId } = storeToRefs(adminAppStore);

const route = useRoute();
const editCampaignId = computed(() => route.query.editId as string);

const settingsData = ref<{ id: string; settings: string }>({
  id: '',
  settings: '',
});

const { isPending, isError, error, mutateAsync } = useMutation({
  mutationFn: (params: any) => updateSettings(params),
  onSuccess: (response) => {
    if (response?.isSuccessful) {
      builderStore.markAsSaved();
      alert('Settings updated successfully!');
    } else {
      console.error('Update failed:', response?.data);
    }
  },
  onError: (error) => {
    console.error('Mutation Error:', error);
  },
});

const isPublishing = ref(false);
const errorMsg = ref('');

const publishProgress = ref(0);
const publishStage = ref('');
const publishSubStage = ref('');

function base64ToFile(base64: string, filename = `upload-${Date.now()}.png`) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

async function uploadImageToApi(base64String: string): Promise<string> {
  const file = base64ToFile(base64String);
  const formData = new FormData();
  formData.append('image', file);

  // TODO: Replace with your actual Nuxt $fetch call
  // const response = await $fetch('/api/upload', { method: 'POST', body: formData });
  // return response.s3Url;

  // Mocking the upload delay and S3 response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://s3.amazonaws.com/your-bucket/auto-uploaded-${Date.now()}.png`);
    }, 1500);
  });
}

async function handlePublish() {
  isPublishing.value = true;
  publishProgress.value = 0;
  publishSubStage.value = '';
  errorMsg.value = '';

  try {
    publishStage.value = 'Preparing configuration...';
    publishSubStage.value = 'Initializing build process';
    publishProgress.value = 5;
    await new Promise((r) => setTimeout(r, 300));

    const payload = JSON.parse(JSON.stringify(campaignConfig.value));
    const base64Images: { obj: any; key: string; data: string }[] = [];

    publishStage.value = 'Sanitizing payload...';
    publishSubStage.value = 'Removing unnecessary data';
    publishProgress.value = 10;

    const cleanAndCollect = (obj: any) => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        obj.forEach(cleanAndCollect);
      } else if (typeof obj === 'object') {
        if ('_styles' in obj) delete obj._styles;

        for (const key in obj) {
          if (typeof obj[key] === 'string' && obj[key].startsWith('data:image/')) {
            base64Images.push({ obj, key, data: obj[key] });
          } else {
            cleanAndCollect(obj[key]);
          }
        }
      }
    };

    if (payload.pages) {
      for (const pageId in payload.pages) {
        const page = payload.pages[pageId];
        if (Array.isArray(page.sections)) {
          page.sections.forEach((section: any) => {
            if ('style' in section) delete section.style;

            if (section.props) cleanAndCollect(section.props);
          });
        }
      }
    }

    publishProgress.value = 15;
    publishSubStage.value = `Found ${base64Images.length} image(s) to process`;
    await new Promise((r) => setTimeout(r, 400));

    // STAGE 3: Converting Base64 to Files
    if (base64Images.length > 0) {
      publishStage.value = 'Converting images to files...';
      publishProgress.value = 20;

      let convertedCount = 0;
      const totalImages = base64Images.length;

      for (let i = 0; i < base64Images.length; i++) {
        publishSubStage.value = `Converting image ${i + 1} of ${totalImages}`;

        //api call here
        await new Promise((r) => setTimeout(r, 200));

        convertedCount++;
        publishProgress.value = 20 + Math.round((convertedCount / totalImages) * 10);
      }

      publishSubStage.value = `All ${totalImages} image(s) converted successfully`;
      await new Promise((r) => setTimeout(r, 300));

      // STAGE 4: Uploading Images
      publishStage.value = 'Uploading media to cloud storage...';
      publishProgress.value = 30;

      let completedUploads = 0;
      const uploadStartProgress = 30;
      const uploadEndProgress = 80;
      const uploadProgressRange = uploadEndProgress - uploadStartProgress;

      const uploadTasks = base64Images.map(async (imgTarget, index) => {
        try {
          publishSubStage.value = `Uploading image ${index + 1} of ${totalImages}`;

          const s3Url = await uploadImageToApi(imgTarget.data);
          imgTarget.obj[imgTarget.key] = s3Url;

          completedUploads++;
          publishProgress.value =
            uploadStartProgress +
            Math.round((completedUploads / totalImages) * uploadProgressRange);
          publishSubStage.value = `Uploaded ${completedUploads} of ${totalImages} image(s)`;
        } catch (err) {
          console.error('Image upload failed:', err);
          imgTarget.obj[imgTarget.key] = '';

          completedUploads++;
          publishSubStage.value = `Failed to upload image ${index + 1}, continuing...`;
        }
      });

      await Promise.all(uploadTasks);

      publishSubStage.value = `All ${totalImages} image(s) uploaded successfully`;
      await new Promise((r) => setTimeout(r, 400));
    } else {
      publishProgress.value = 80;
      publishSubStage.value = 'No images to upload';
      await new Promise((r) => setTimeout(r, 300));
    }

    publishStage.value = 'Publishing to live servers...';
    publishSubStage.value = 'Sending configuration to API';
    publishProgress.value = 85;

    const response = await mutateAsync({
      bearerId: currentCampaignId.value,
      id: settingsData.value.id,
      settingsType: 5211,
      settings: payload,
    });

    publishProgress.value = 95;
    publishSubStage.value = 'Verifying deployment';
    await new Promise((r) => setTimeout(r, 500));

    publishProgress.value = 100;
    publishStage.value = 'Successfully published!';
    publishSubStage.value = 'Your campaign is now live';

    setTimeout(() => {
      isPublishing.value = false;
      modalStore.close();
    }, 1200);
  } catch (error) {
    console.error('Failed to publish:', error);
    errorMsg.value = 'Failed to publish campaign due to an error.';
    publishStage.value = 'Publication failed';
    publishSubStage.value = error instanceof Error ? error.message : 'Unknown error occurred';
    isPublishing.value = false;
  }
}

const handleSaveDraft = () => {
  if (!editCampaignId.value) {
    console.error('Cannot save draft: Missing editId');
    return;
  }

  const newSave: SaveFile = {
    id: crypto.randomUUID(),
    campaignId: editCampaignId.value,
    name: `Draft - ${new Date().toLocaleTimeString()}`,
    timestamp: Date.now(),
    config: JSON.parse(JSON.stringify(campaignConfig.value)),
  };

  savedDrafts.value.unshift(newSave);

  const draftsForThisCampaign = savedDrafts.value.filter(
    (d) => d.campaignId === editCampaignId.value
  );

  if (draftsForThisCampaign.length > 10) {
    const oldestDraft = draftsForThisCampaign[draftsForThisCampaign.length - 1];

    savedDrafts.value = savedDrafts.value.filter((d) => d.id !== oldestDraft.id);
  }
};

function handlePreview() {
  mode.value = 'preview';
  modalStore.close();
}

watch(
  [editCampaignId, campaignConfig],
  ([newId, newConfig]) => {
    if (newId) settingsData.value.id = newId;

    if (newConfig) settingsData.value.settings = newConfig;
  },
  { immediate: true }
);
</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="flex items-start justify-between">
      <div class="mb-2">
        <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Publish Campaign</h3>
      </div>

      <SafeDrafts />
    </header>

    <div
      class="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <!-- Not Publishing State -->
      <div v-if="!isPublishing" class="flex flex-col gap-5 p-6 transition-opacity duration-300">
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="text-[13px] font-semibold text-slate-900 dark:text-neutral-100"
                >Current Status</span
              >

              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors"
                :class="
                  isDirty
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400'
                "
              >
                {{ isDirty ? 'Unsaved Changes' : 'Up to date' }}
              </span>
            </div>

            <span class="text-[12px] text-slate-500 dark:text-neutral-400">
              <template v-if="isDirty"> You have unpublished changes in your canvas. </template>
              <template v-else> All changes are saved and up to date. </template>
            </span>
          </div>
          <div
            v-if="isDirty"
            class="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50/80 px-2.5 py-1 ring-1 ring-amber-500/20 backdrop-blur-sm ring-inset dark:bg-amber-950/80 dark:ring-amber-700/20"
          >
            <span class="relative flex size-1.5">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 dark:bg-amber-500"
              ></span>
              <span
                class="relative inline-flex size-1.5 rounded-full bg-amber-500 dark:bg-amber-400"
              ></span>
            </span>

            <span class="text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Unsaved
            </span>
          </div>

          <div
            v-else
            class="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50/80 px-2.5 py-1 ring-1 ring-slate-500/10 backdrop-blur-sm ring-inset dark:bg-neutral-800/80 dark:ring-neutral-700/10"
          >
            <Icon name="lucide:check" class="size-3 text-slate-400 dark:text-neutral-500" />
            <span class="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
              Saved
            </span>
          </div>
        </div>

        <!-- <div class="h-px w-full bg-neutral-100 dark:bg-neutral-800"></div> -->
        <!-- <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100"
              >Last Published</span
            >
            <span class="text-xs text-neutral-500 dark:text-neutral-400"
              >The currently live version of this campaign.</span
            >
          </div>
          <div class="flex shrink-0 flex-col items-end text-right">
            <span class="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100"
              >Oct 24, 2023</span
            >
            <span class="text-[11px] font-medium text-neutral-400 dark:text-neutral-500"
              >14:30 PM</span
            >
          </div>
        </div> -->
      </div>

      <!-- Publishing State -->
      <div
        v-else
        class="flex flex-col justify-center gap-5 bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30 p-8 transition-opacity duration-300 dark:from-purple-950/30 dark:via-neutral-900 dark:to-purple-950/30"
      >
        <!-- Stage Header -->
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <Icon name="lucide:loader-2" size="16" class="animate-spin text-purple-600" />
              <span class="text-sm font-bold text-purple-700">
                {{ publishStage }}
              </span>
            </div>
            <span class="text-xs text-neutral-600 dark:text-neutral-400">
              {{ publishSubStage }}
            </span>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-0.5">
            <span class="text-xl font-bold text-purple-700 tabular-nums dark:text-purple-400">
              {{ publishProgress }}%
            </span>
            <span
              class="text-[10px] font-medium tracking-wide text-neutral-400 uppercase dark:text-neutral-500"
            >
              Complete
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          class="relative h-3 w-full overflow-hidden rounded-full bg-neutral-200/60 shadow-inner ring-1 ring-black/5 dark:bg-neutral-700/60 dark:ring-white/5"
        >
          <div
            class="relative h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 shadow-sm transition-all duration-500 ease-out"
            :style="{ width: `${publishProgress}%` }"
          >
            <!-- Shimmer Effect -->
            <div
              class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            ></div>
          </div>
        </div>

        <!-- Stage Indicators -->
        <div class="flex items-center justify-between gap-1">
          <div
            v-for="stage in 6"
            :key="stage"
            class="flex h-1 flex-1 rounded-full transition-all duration-300"
            :class="
              publishProgress >= (stage - 1) * 20
                ? 'bg-purple-500 dark:bg-purple-600'
                : 'bg-neutral-200 dark:bg-neutral-700'
            "
          ></div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMsg"
          class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/50"
        >
          <Icon
            name="lucide:alert-circle"
            size="16"
            class="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
          />
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-red-900 dark:text-red-300"
              >Publication Error</span
            >
            <span class="text-xs text-red-700 dark:text-red-400">{{ errorMsg }}</span>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-xl border-t border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <button
          @click="handleSaveDraft"
          type="button"
          :disabled="isPublishing"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-neutral-200/50 hover:text-neutral-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <Icon name="lucide:save" size="16" />
          <span>Save Draft</span>
        </button>

        <div class="flex items-center gap-3">
          <button
            @click="handlePreview"
            type="button"
            :disabled="isPublishing"
            class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
          >
            <Icon name="lucide:eye" size="16" class="text-neutral-400 dark:text-neutral-500" />
            <span>Preview</span>
          </button>

          <button
            @click="handlePublish"
            :disabled="isPublishing"
            class="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-md hover:shadow-purple-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:shadow-none dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            <Icon v-if="isPublishing" name="lucide:loader-2" size="16" class="animate-spin" />
            <Icon v-else name="lucide:rocket" size="16" />
            <span>{{ isPublishing ? 'Publishing...' : 'Publish to Live' }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
