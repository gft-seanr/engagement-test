<script setup lang="ts">
import { type PropType } from 'vue';
import Row from '../Row.vue';

const formModel = defineModel<any>('form', {
  type: Object as PropType<any>,
  required: true,
});
</script>

<template>
  <div class="flex flex-col gap-10 p-6">
    <Row label="Registration" :align-top="true">
      <div class="w-full rounded-lg bg-gray-100 p-4 dark:bg-neutral-800">
        <div class="grid auto-rows-min gap-6">
          <div class="flex flex-col gap-1.5">
            <span class="shrink-0 text-xs font-bold text-[#141414] dark:text-neutral-200"
              >Start</span
            >
            <div
              class="flex items-center divide-x divide-gray-200 rounded-md border border-gray-300 bg-white transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <input
                v-model="formModel.registrationStartDate"
                type="date"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
              <input
                v-model="formModel.registration.startTime"
                type="time"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="shrink-0 text-xs font-bold text-[#141414] dark:text-neutral-200">End</span>
            <div
              class="flex items-center divide-x divide-gray-200 rounded-md border border-gray-300 bg-white transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <input
                v-model="formModel.registration.endDate"
                type="date"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
              <input
                v-model="formModel.registration.endTime"
                type="time"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      </div>
    </Row>

    <Row label="Redemption" :align-top="true">
      <div class="w-full rounded-lg bg-gray-100 p-4 dark:bg-neutral-800">
        <div class="grid auto-rows-min gap-6">
          <div class="flex flex-col gap-1.5">
            <span class="shrink-0 text-xs font-bold text-[#141414] dark:text-neutral-200"
              >Start</span
            >
            <div
              class="flex items-center divide-x divide-gray-200 rounded-md border border-gray-300 bg-white transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <input
                v-model="formModel.redemption.startDate"
                type="date"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
              <input
                v-model="formModel.redemption.startTime"
                type="time"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="shrink-0 text-xs font-bold text-[#141414] dark:text-neutral-200">End</span>
            <div
              class="flex items-center divide-x divide-gray-200 rounded-md border border-gray-300 bg-white transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <input
                v-model="formModel.redemption.endDate"
                type="date"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
              <input
                v-model="formModel.redemption.endTime"
                type="time"
                class="w-full appearance-none bg-transparent p-2 text-gray-900 outline-none dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      </div>
    </Row>
  </div>
</template>
