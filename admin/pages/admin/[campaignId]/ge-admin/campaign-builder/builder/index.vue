<script setup lang="ts">
import PreviewSwitch from '~/admin/components/builder/PreviewSwitch.vue';
import SettingsModal from '~admin/components/builder/modals/SettingsModal.vue';
import BuilderAssets from '~admin/components/builder/BuilderAssets.vue';
import BuilderPageLoader from '~/admin/components/builder/loader/BuilderPageLoader.vue';
import BuilderCanvas from '~admin/components/builder/BuilderCanvas.vue';
import BuilderProperties from '~admin/components/builder/BuilderProperties.vue';
import { useBuilderTitle } from '~/admin/composables/builder/useBuilderTitle';
import { useQuery } from '@tanstack/vue-query';
import { getSchemaSettings } from '~/admin/services/builder/settings';
import { computed, watch, onMounted, onUnmounted } from 'vue';

definePageMeta({
  name: 'campaign-builder-builder',
  middleware: [
    'admin',
    'entry',
    function (to, from) {
      if (!to.query.editId) {
        return navigateTo({ name: 'campaign-builder-home' });
      }
    },
  ],
  layout: 'ge-admin',
  breadcrumbs: [{ label: 'Campaigns', to: 'campaign-builder-home' }, { label: 'Builder' }],
});

const builderStore = useBuilderStore();
const modalStore = useModalStore();
const { mode, isDirty, campaignConfig, isInitialized } = storeToRefs(builderStore);

const { setTitle } = useBuilderTitle();
const route = useRoute();

const editCampaignId = computed(() => route.query.editId as string | undefined);

const { isLoading, data, isError } = useQuery({
  queryKey: ['campaignSettings', editCampaignId.value],
  enabled: !!editCampaignId.value,
  queryFn: async () => getSchemaSettings(editCampaignId.value!),
  retry: 1,
});

const isActuallyReady = computed(() => {
  return !isLoading.value && isInitialized.value && !!campaignData.value;
});

const campaignData = computed(() => data.value?.data || null);

const dynamicTitle = computed(() => {
  if (!editCampaignId.value) return 'New Campaign';

  if (isLoading.value) return 'Loading Campaign...';
  if (isError.value) return 'Error Loading Campaign';

  const rawTitle = campaignConfig.value?.pageHead?.title || campaignConfig.value?.name;

  if (rawTitle) {
    let cleanName = rawTitle.split('|')[0].trim();
    cleanName = cleanName.replace(/^[^:-]+[:-]\s*/, '');
    return cleanName;
  }

  return 'Untitled Campaign';
});

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = '';
  }
}

onMounted(() => {
  if (!editCampaignId.value) {
    builderStore.initializeBuilder(null);
  }

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Set title on client-side only to avoid hydration mismatch
  watchEffect(() => {
    setTitle(dynamicTitle.value);
  });
});

onBeforeUnmount(() => {
  setTitle('');
  builderStore.clearBuilder();
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    const answer = window.confirm('You have unsaved changes! Are you sure you want to leave?');
    if (!answer) {
      return next(false);
    }
  }

  if (to.path.includes('/campaign-builder') && Object.keys(to.query).length > 0) {
    return next({ path: to.path, query: {} });
  }

  next();
});

watch(
  campaignData,
  (newVal) => {
    if (newVal) {
      builderStore.initializeBuilder(newVal);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full w-full transition-colors duration-300 dark:bg-neutral-950">
    <template v-if="!isActuallyReady">
      <BuilderPageLoader />
    </template>

    <template v-else>
      <client-only>
        <teleport to="#actions">
          <div class="flex items-center gap-3">
            <button
              @click="modalStore.open(SettingsModal)"
              type="button"
              title="Open Project Settings"
              class="group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <Icon
                name="lucide:settings"
                class="size-3.5 text-neutral-400 transition-colors group-hover:text-purple-600 dark:text-neutral-500 dark:group-hover:text-purple-400"
              />
              <span>Settings</span>
            </button>
            <div class="h-4 w-px bg-neutral-200 dark:bg-neutral-800"></div>

            <PreviewSwitch v-model:mode="mode" />
          </div>
        </teleport>
      </client-only>

      <div
        class="grid h-full gap-4 overflow-hidden transition-all duration-300 ease-in-out"
        :class="
          mode === 'preview'
            ? 'grid-cols-1 py-0 pr-0 pl-0'
            : 'py-3 pr-2.5 pl-3 md:grid-cols-[18rem_1fr_23rem]'
        "
      >
        <BuilderAssets v-show="mode === 'build'" />

        <div class="grid w-full place-items-center overflow-y-auto">
          <client-only>
            <BuilderCanvas />

            <template #fallback>
              <div
                class="flex flex-1 items-center justify-center bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600"
              >
                <Icon name="lucide:loader" class="animate-spin text-2xl" />
              </div>
            </template>
          </client-only>
        </div>

        <BuilderProperties v-show="mode === 'build'" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-slide {
  animation: slide 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes slide {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(350%);
  }
}
</style>
