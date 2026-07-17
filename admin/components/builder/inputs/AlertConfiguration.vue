<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useComponentProperties } from '~/admin/composables/builder/useComponentProperties';
import { INPUT_COMPONENTS } from '~/admin/constants/builder/inputs';

const alertModel = defineModel<any>('alert', {
  required: true,
});

const { alertPropertyFiles } = useComponentProperties();

const alertComponent = ref(alertModel.value.component || 'alert-card');

const componentSchemas = Object.keys(alertPropertyFiles).reduce((acc: any, path) => {
  const folderName = path.split('/alert/')[1].split('/')[0];
  const rawName = `alert-${folderName}`;

  // @ts-ignore
  acc[rawName] = alertPropertyFiles[path].properties;
  return acc;
}, {});

const alertComponents = Object.keys(componentSchemas).map((key) => ({
  label: key
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '), // 'Alert Card'
  value: key,
}));

const currentSchema = computed(() => {
  const selectedComp = alertModel.value.component;
  return componentSchemas[selectedComp] || {};
});

watch(alertComponent, (newVal) => {
  alertModel.value.component = newVal;
});

const previewEntry = computed(() => {
  const map = alertModel.value.map || {};
  const keys = Object.keys(map || {});
  return keys.length ? (map as any)[keys[0]] : null;
});

// "map": {
//   "InvalidUserPassword": {
//     "type": "error",
//     "title": "Invalid Mobile Number",
//     "description": "The mobile number is either invalid or not yet registered for this promotion."
//   }
</script>

<template>
  <div class="flex flex-col gap-4">
    <span class="text-xs font-semibold whitespace-nowrap dark:text-neutral-300"
      >Alert Overrides</span
    >
    <div
      class="flex flex-col gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div class="flex items-center justify-between">
        <span
          class="text-[10px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
          >Component
        </span>

        <div class="relative w-32">
          <select
            v-model="alertComponent"
            class="w-full appearance-none rounded border border-neutral-200 bg-white py-1 pr-6 pl-2 text-xs font-medium text-neutral-700 transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option v-for="comp in alertComponents" :key="comp.value" :value="comp.value">
              {{ comp.label }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
          >
            <Icon name="lucide:chevrons-up-down" class="h-3 w-3" />
          </div>
        </div>
      </div>

      <div class="h-px bg-neutral-200 dark:bg-neutral-700"></div>

      <div class="flex gap-4">
        <div class="flex flex-1 flex-col gap-3">
          <template v-if="Object.keys(currentSchema).length > 0">
            <div
              v-for="(config, propKey) in currentSchema"
              :key="propKey"
              class="rounded-md border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {{ propKey }}
                </div>
                <div class="text-[10px] text-neutral-400 dark:text-neutral-500">
                  {{ config.title || config.editor.type }}
                </div>
              </div>

              <component :is="INPUT_COMPONENTS[config.editor.type]" v-model:map="alertModel.map" />
            </div>
          </template>

          <template v-else>
            <div
              class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            >
              No configurable properties for the selected component.
            </div>
          </template>
        </div>

        <div class="w-80">
          <div
            class="preview-card rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Preview</div>

            <div v-if="previewEntry" class="mt-3 flex flex-col gap-2">
              <div class="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {{ previewEntry.title || 'Title' }}
              </div>
              <div class="text-[12px] text-neutral-600 dark:text-neutral-400">
                {{ previewEntry.description || 'Description' }}
              </div>
              <div
                class="mt-2 inline-block rounded border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
              >
                {{ previewEntry.type || 'type' }}
              </div>
            </div>

            <pre v-else class="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
Select an alert and configure overrides to preview.</pre
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
