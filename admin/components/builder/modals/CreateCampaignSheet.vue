<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { createCampaign } from '~/admin/services/builder/settings';

import SheetLayout from '~admin/components/builder/dashboard/SheetLayout.vue';
import StepInfo from '~admin/components/builder/dashboard/form/steps/CampaignInfo.vue';
import StepSchedule from '~admin/components/builder/dashboard/form/steps/CampaignSchedule.vue';

const props = defineProps<{
  campaignId?: string;
}>();

const emit = defineEmits<{
  (e: 'created', campaignId: string): void;
}>();

const isOpen = defineModel('open', { type: Boolean, required: true });

interface Schedule {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface CampaignForm {
  name: string;
  affiliate: string;
  description: string;
  comment: string;
  pageTitle: string;
  registration: Schedule;
  redemption: Schedule;
}

const steps = {
  'campaign-info': {
    title: 'Info',
    component: shallowRef(StepInfo),
  },
  'campaign-schedule': {
    title: 'Schedule',
    component: shallowRef(StepSchedule),
  },
};

const { index, current, isFirst, isLast, goToNext, goToPrevious } = useStepper(steps);

const { isPending, mutate } = useMutation({
  mutationFn: (data: CampaignForm & { campaignId?: string }) => createCampaign(data),
  onSuccess: (response) => {
    isOpen.value = false;

    console.log(response);

    const newId = response?.data?.campaignId;

    if (newId) {
      emit('created', newId);
    } else {
      navigateTo('/admin/campaign-builder');
    }
  },
});

const form = ref<CampaignForm>({
  name: '',
  affiliate: '',
  description: '',
  comment: '',
  pageTitle: '',
  registration: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },
  redemption: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },
});

const isNextDisabled = computed(() => {
  if (!current.value) return true;

  switch (current.value.title) {
    case 'Info':
      return !form.value.name || !form.value.affiliate || !form.value.pageTitle;
    case 'Schedule':
      return false;
    case 'Theme':
      return false;
    default:
      return false;
  }
});

function startBuilding() {
  const params = {
    campaignId: props.campaignId,
    ...form.value,
  };

  mutate(params);
}
</script>

<template>
  <SheetLayout :open="isOpen" @close="isOpen = false">
    <div class="flex h-full w-full flex-col bg-white dark:bg-neutral-950">
      <div class="grid h-full grid-rows-[auto_1fr_auto]">
        <header class="flex flex-col gap-5 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="lucide:arrow-left" class="text-[#737373] dark:text-neutral-500" />
              <span class="text-xs font-semibold text-gray-900 dark:text-neutral-100"
                >Setup Campaign</span
              >
            </div>
            <span class="text-xs font-semibold text-[#737373] uppercase dark:text-neutral-500">
              {{ current?.title }}
            </span>
          </div>
          <div class="flex w-full items-center gap-1.5">
            <div
              v-for="(step, i) in Object.values(steps)"
              :key="step.title"
              class="h-1.5 w-full rounded-full transition-colors duration-300"
              :class="i <= index ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-800'"
            />
          </div>
        </header>

        <div class="overflow-y-auto px-6">
          <keep-alive>
            <component :is="current.component" v-model:form="form" />
          </keep-alive>
        </div>

        <div
          class="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50"
        >
          <div class="grid grid-cols-2 gap-4">
            <button
              v-if="!isFirst"
              class="h-12 w-full cursor-pointer rounded-lg bg-gray-100 font-semibold text-gray-500 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              @click="goToPrevious"
            >
              Previous
            </button>

            <button
              @click="isLast ? startBuilding() : goToNext()"
              :disabled="isNextDisabled || isPending"
              class="group relative col-start-2 flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed"
              :class="[
                isNextDisabled && !isPending
                  ? 'bg-gray-200 text-gray-400 dark:bg-neutral-800 dark:text-neutral-600'
                  : isLast
                    ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700 dark:shadow-none'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40',
              ]"
            >
              <Icon v-if="isPending" name="lucide:loader-circle" class="animate-spin text-xl" />
              <div
                class="absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500"
                :class="isPending ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'"
              >
                <Icon v-if="isLast" name="lucide:layout-template" class="size-4" />
                <span>{{ isLast ? 'Start Building' : 'Next' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </SheetLayout>
</template>
