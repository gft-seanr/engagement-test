<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);

const scheduleForm = ref({
  isRegistrationEnabled: false,
  registration: { startDate: '', startTime: '', endDate: '', endTime: '' },
  isRedemptionEnabled: false,
  redemption: { startDate: '', startTime: '', endDate: '', endTime: '' },
});

function parseDateTime(dtStr?: string) {
  if (!dtStr) return { date: '', time: '' };
  const [datePart, timePart] = dtStr.split(' ');
  return {
    date: datePart ? datePart.replace(/\//g, '-') : '',
    time: timePart ? timePart.substring(0, 5) : '',
  };
}

function formatDateTime(date: string, time: string) {
  if (!date && !time) return '';
  const d = date ? date.replace(/-/g, '/') : '';
  const t = time ? `${time}:00` : '00:00:00';
  return `${d} ${t}`.trim();
}

let isInitializing = false;

onMounted(() => {
  isInitializing = true;
  const schedule = campaignConfig.value?.schedule || {};

  const reg = schedule.registration || {};
  const red = schedule.redemption || {};

  const parsedRegStart = parseDateTime(reg.startDateTime);
  const parsedRegEnd = parseDateTime(reg.endDateTime);

  scheduleForm.value.isRegistrationEnabled = !!(reg.startDateTime || reg.endDateTime);
  scheduleForm.value.registration = {
    startDate: parsedRegStart.date,
    startTime: parsedRegStart.time,
    endDate: parsedRegEnd.date,
    endTime: parsedRegEnd.time,
  };

  const parsedRedStart = parseDateTime(red.startDateTime);
  const parsedRedEnd = parseDateTime(red.endDateTime);

  scheduleForm.value.isRedemptionEnabled = !!(red.startDateTime || red.endDateTime);
  scheduleForm.value.redemption = {
    startDate: parsedRedStart.date,
    startTime: parsedRedStart.time,
    endDate: parsedRedEnd.date,
    endTime: parsedRedEnd.time,
  };

  setTimeout(() => {
    isInitializing = false;
  }, 0);
});

watch(
  scheduleForm,
  (newVal) => {
    if (isInitializing) return;

    const newSchedule: any = {};

    if (newVal.isRegistrationEnabled) {
      newSchedule.registration = {
        startDateTime: formatDateTime(newVal.registration.startDate, newVal.registration.startTime),
        endDateTime: formatDateTime(newVal.registration.endDate, newVal.registration.endTime),
      };
    }

    if (newVal.isRedemptionEnabled) {
      newSchedule.redemption = {
        startDateTime: formatDateTime(newVal.redemption.startDate, newVal.redemption.startTime),
        endDateTime: formatDateTime(newVal.redemption.endDate, newVal.redemption.endTime),
      };
    }

    campaignConfig.value = {
      ...campaignConfig.value,
      schedule: newSchedule,
    };
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-col gap-1">
    <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Campaign Schedule</h3>
    <p class="text-[13px] text-neutral-500 dark:text-neutral-400">
      Configure the active dates for registration and redemption phases.
    </p>
  </div>

  <div
    class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900/50"
    :class="scheduleForm.isRegistrationEnabled ? 'opacity-100' : 'opacity-60 hover:opacity-100'"
  >
    <div class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex size-6 items-center justify-center rounded-full transition-colors"
          :class="
            scheduleForm.isRegistrationEnabled
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
          "
        >
          <Icon name="lucide:clipboard-list" size="12" />
        </div>
        <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Registration Phase
        </h4>
      </div>

      <button
        @click="scheduleForm.isRegistrationEnabled = !scheduleForm.isRegistrationEnabled"
        type="button"
        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        :class="scheduleForm.isRegistrationEnabled ? 'bg-purple-600' : 'bg-neutral-300'"
      >
        <span
          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          :class="scheduleForm.isRegistrationEnabled ? 'translate-x-4' : 'translate-x-0'"
        />
      </button>
    </div>

    <div v-if="scheduleForm.isRegistrationEnabled" class="grid gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label class="text-[13px] font-medium text-neutral-700 dark:text-neutral-300"
          >Start Date & Time</label
        >
        <div
          class="flex items-center divide-x divide-neutral-200 rounded-lg border border-neutral-300 bg-white shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <input
            v-model="scheduleForm.registration.startDate"
            type="date"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
          <input
            v-model="scheduleForm.registration.startTime"
            type="time"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[13px] font-medium text-neutral-700 dark:text-neutral-300"
          >End Date & Time</label
        >
        <div
          class="flex items-center divide-x divide-neutral-200 rounded-lg border border-neutral-300 bg-white shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <input
            v-model="scheduleForm.registration.endDate"
            type="date"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
          <input
            v-model="scheduleForm.registration.endTime"
            type="time"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-center rounded-lg border border-dashed border-neutral-300 py-6 dark:border-neutral-700"
    >
      <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >Enable to configure dates</span
      >
    </div>
  </div>

  <div
    class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900/50"
    :class="scheduleForm.isRedemptionEnabled ? 'opacity-100' : 'opacity-60 hover:opacity-100'"
  >
    <div class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex size-6 items-center justify-center rounded-full transition-colors"
          :class="
            scheduleForm.isRedemptionEnabled
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
          "
        >
          <Icon name="lucide:gift" size="12" />
        </div>
        <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Redemption Phase
        </h4>
      </div>

      <button
        @click="scheduleForm.isRedemptionEnabled = !scheduleForm.isRedemptionEnabled"
        type="button"
        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        :class="scheduleForm.isRedemptionEnabled ? 'bg-purple-600' : 'bg-neutral-300'"
      >
        <span
          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          :class="scheduleForm.isRedemptionEnabled ? 'translate-x-4' : 'translate-x-0'"
        />
      </button>
    </div>

    <div v-if="scheduleForm.isRedemptionEnabled" class="grid gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label class="text-[13px] font-medium text-neutral-700 dark:text-neutral-300"
          >Start Date & Time</label
        >
        <div
          class="flex items-center divide-x divide-neutral-200 rounded-lg border border-neutral-300 bg-white shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <input
            v-model="scheduleForm.redemption.startDate"
            type="date"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
          <input
            v-model="scheduleForm.redemption.startTime"
            type="time"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[13px] font-medium text-neutral-700 dark:text-neutral-300"
          >End Date & Time</label
        >
        <div
          class="flex items-center divide-x divide-neutral-200 rounded-lg border border-neutral-300 bg-white shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <input
            v-model="scheduleForm.redemption.endDate"
            type="date"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
          <input
            v-model="scheduleForm.redemption.endTime"
            type="time"
            class="w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none dark:text-neutral-100"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-center rounded-lg border border-dashed border-neutral-300 py-6 dark:border-neutral-700"
    >
      <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >Enable to configure dates</span
      >
    </div>
  </div>
</template>
