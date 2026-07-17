<script setup lang="ts">
import { ref, watch, watchEffect, type PropType } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { watchDebounced } from '@vueuse/core';
import { checkAffiliate } from '~/admin/services/builder/settings';
import Row from '../Row.vue';

interface CampaignInfo {
  name: string;
  description: string;
  affiliate: string;
  comment: string;
  pageTitle: string;
}

const formModel = defineModel<CampaignInfo>('form', {
  type: Object as PropType<CampaignInfo>,
  required: true,
});

const route = useRoute();
const campaignId = computed(() => route.params.campaignId as string | undefined);

const initName = formModel.value.name || '';
const envType = ref<'Staging' | 'Live'>(initName.startsWith('[Live]') ? 'Live' : 'Staging');
const baseName = ref(initName.replace(/^\[(?:Live|Test)\]\s*/, ''));

const localAffiliateInput = ref(formModel.value.affiliate || '');
const isValidAffiliate = ref<boolean | null>(null);
const isChecking = ref(false);

const { mutateAsync } = useMutation({
  mutationFn: checkAffiliate,
});

watchEffect(() => {
  const prefix = envType.value === 'Staging' ? '[Test]' : '[Live]';
  formModel.value.name = baseName.value.trim() ? `${prefix} ${baseName.value}` : prefix;
});

watch(localAffiliateInput, (newVal) => {
  isValidAffiliate.value = null;
  formModel.value.affiliate = '';
  isChecking.value = !!newVal.trim();
});

watchDebounced(
  localAffiliateInput,
  async (newVal, _, onCleanup) => {
    if (!newVal.trim()) return;

    let aborted = false;
    onCleanup(() => {
      aborted = true;
    });

    try {
      const { data } = await mutateAsync({
        subdomain: newVal,
        campaignId: campaignId.value || '',
      });

      if (aborted) return;

      isValidAffiliate.value = !!data?.exists;
      formModel.value.affiliate = isValidAffiliate.value ? newVal : '';
    } catch {
      if (!aborted) isValidAffiliate.value = false;
    } finally {
      if (!aborted) isChecking.value = false;
    }
  },
  { debounce: 500 }
);
</script>

<template>
  <div class="flex flex-col gap-10 p-6">
    <div class="flex flex-col gap-3 rounded-2xl bg-neutral-50/50 p-5 dark:bg-neutral-900/50">
      <div class="flex items-center justify-between">
        <label class="text-sm font-bold text-gray-900 dark:text-neutral-100">
          Campaign Name <span class="text-red-500">*</span>
        </label>

        <div class="flex items-center gap-1 rounded-lg bg-neutral-200/50 p-1 dark:bg-neutral-800">
          <label
            class="relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1 transition-all"
            :class="
              envType === 'Staging'
                ? 'bg-white text-amber-600 shadow-sm dark:bg-neutral-700 dark:text-amber-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            "
          >
            <input v-model="envType" type="radio" value="Staging" class="sr-only" />
            <span class="text-xs font-bold tracking-wider uppercase">Staging</span>
          </label>

          <label
            class="relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1 transition-all"
            :class="
              envType === 'Live'
                ? 'bg-white text-purple-600 shadow-sm dark:bg-neutral-700 dark:text-purple-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            "
          >
            <input v-model="envType" type="radio" value="Live" class="sr-only" />
            <span class="text-xs font-bold tracking-wider uppercase">Live</span>
          </label>
        </div>
      </div>

      <div
        class="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all dark:border-neutral-700 dark:bg-neutral-950"
      >
        <div
          class="flex shrink-0 items-center justify-center rounded-md px-2.5 py-1 transition-colors"
          :class="
            envType === 'Staging'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
          "
        >
          <span class="font-mono text-sm font-bold tracking-tight">
            {{ envType === 'Staging' ? '[Test]' : '[Live]' }}
          </span>
        </div>

        <input
          v-model="baseName"
          type="text"
          placeholder="e.g. Summer Sale Promo"
          class="w-full bg-transparent font-heading text-xl font-bold text-gray-900 placeholder:font-sans placeholder:font-normal placeholder:text-gray-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-600"
          autofocus
        />
      </div>
    </div>
    <div class="flex flex-col gap-10">
      <Row label="Affiliate" for="affiliate">
        <div class="flex flex-col gap-1.5">
          <div class="relative w-full max-w-xs">
            <input
              v-model="localAffiliateInput"
              id="affiliate"
              type="text"
              placeholder="Enter Affiliate Name "
              class="peer h-10 w-full rounded-lg border bg-white px-3 pr-10 text-xs text-gray-900 transition-all duration-200 focus:outline-none dark:bg-neutral-900 dark:text-neutral-100"
              :class="[
                {
                  'border-red-500 bg-red-50/30 focus:border-red-600 dark:bg-red-950/30':
                    isValidAffiliate === false,
                  'border-green-500 bg-green-50/30 focus:border-green-600 dark:bg-green-950/30':
                    isValidAffiliate === true,
                  'border-[#c2c2c1] focus:border-purple-500 dark:border-neutral-700':
                    isValidAffiliate === null,
                },
              ]"
            />

            <div class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center">
              <Icon
                v-if="isChecking"
                name="lucide:loader-2"
                class="size-4 animate-spin text-gray-400 dark:text-neutral-500"
              />
              <Icon
                v-else-if="isValidAffiliate === true"
                name="lucide:check-circle-2"
                class="size-4 text-green-500"
              />
              <Icon
                v-else-if="isValidAffiliate === false"
                name="lucide:x-circle"
                class="size-4 text-red-500"
              />
            </div>
          </div>

          <Transition
            enter-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <p v-if="isValidAffiliate === false" class="text-[11px] font-medium text-red-500">
              Invalid affiliate name. Please try again.
            </p>
          </Transition>
        </div>
      </Row>

      <Row label="Page Title" for="page_title">
        <div class="w-full max-w-xs">
          <div class="group flex items-center">
            <input
              v-model="formModel.pageTitle"
              id="page_title"
              type="text"
              placeholder="Enter page title"
              class="h-10 w-full rounded-l-lg border-y border-l border-[#c2c2c1] bg-white px-3 text-xs text-gray-900 transition-colors focus:border-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />

            <div
              class="flex h-10 shrink-0 items-center gap-2 rounded-r-lg border border-[#c2c2c1] bg-gray-100 px-3 text-xs text-gray-500 transition-colors dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
            >
              <span class="opacity-50">|</span>
              <span class="text-xs"> Giftaway</span>
            </div>
          </div>
        </div>
      </Row>

      <Row label="Description" for="page_description">
        <div class="w-full max-w-xs">
          <div class="group flex items-center">
            <input
              v-model="formModel.description"
              id="page_description"
              type="text"
              placeholder="Enter page description"
              class="h-10 w-full rounded-lg border border-[#c2c2c1] bg-white px-3 text-xs text-gray-900 transition-colors focus:border-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </Row>
      <Row label="Comment" for="page_comment">
        <div class="w-full max-w-xs">
          <div class="group flex items-center">
            <input
              v-model="formModel.comment"
              id="page_description"
              type="text"
              placeholder="Enter comment"
              class="h-10 w-full rounded-lg border border-[#c2c2c1] bg-white px-3 text-xs text-gray-900 transition-colors focus:border-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </Row>
    </div>
  </div>
</template>
