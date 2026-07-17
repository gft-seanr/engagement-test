<script setup lang="ts">
const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);

const isDevMode = ref(false);
const showWarning = ref(false);
const errorMsg = ref('');
const rawJson = ref('');
const validationErrors = ref<string[]>([]);

const hasUnsavedChanges = computed(() => {
  if (!isDevMode.value) return false;
  try {
    const currentStoreString = JSON.stringify(campaignConfig.value, null, 2);
    return rawJson.value !== currentStoreString;
  } catch {
    return true;
  }
});

defineProps<{
  isFullscreen: boolean;
}>();

const emit = defineEmits(['toggle']);

function copyToClipboard() {
  navigator.clipboard?.writeText(rawJson.value).catch(() => {});
}

function validateConfig(obj: any) {
  const errors: string[] = [];
  if (obj === null || typeof obj !== 'object') {
    errors.push('Root must be an object');
    return errors;
  }
  if (!obj.pages || typeof obj.pages !== 'object') {
    errors.push('Missing or invalid `pages` object');
  } else {
    for (const [pid, page] of Object.entries(obj.pages)) {
      if (!page || typeof page !== 'object') {
        errors.push(`pages.${pid} must be an object`);
        continue;
      }
      if (!Array.isArray((page as any).sections)) {
        errors.push(`pages.${pid}.sections should be an array`);
      }
    }
  }
  return errors;
}

watch(
  campaignConfig,
  (newVal) => {
    if (!isDevMode.value) {
      rawJson.value = JSON.stringify(newVal, null, 2);
    }
  },
  { deep: true, immediate: true }
);

function handleEditClick() {
  if (isDevMode.value) return;
  showWarning.value = true;
}

function enableEditing() {
  isDevMode.value = true;
  showWarning.value = false;
  errorMsg.value = '';
}

function cancelEditing() {
  showWarning.value = false;
}

const sanitizeConfig = (cfg: any) => cfg;

function saveAndExit() {
  const confirmed = window.confirm(
    'Are you sure you want to save these JSON changes? This will update the campaign configuration and can cause an error to occur.'
  );

  if (!confirmed) return;

  try {
    const parsed = JSON.parse(rawJson.value);

    const errs = validateConfig(parsed);
    if (errs.length) {
      validationErrors.value = errs;
      errorMsg.value = 'Validation failed';
      return;
    }

    const safeConfig = sanitizeConfig(parsed);

    campaignConfig.value = safeConfig;
    isDevMode.value = false;
    errorMsg.value = '';
    validationErrors.value = [];
  } catch (e: any) {
    errorMsg.value = e.message || 'Invalid JSON syntax';
    setTimeout(() => {
      errorMsg.value = '';
    }, 3000);
  }
}
</script>

<template>
  <div class="flex shrink-0 items-center justify-between">
    <div class="flex items-center gap-2">
      <span
        class="text-[11px] font-bold tracking-wider uppercase"
        :class="isDevMode ? 'text-amber-600' : 'text-purple-600'"
      >
        {{ isDevMode ? '' : 'JSON Viewer' }}
      </span>

      <span
        v-if="hasUnsavedChanges"
        class="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-700 uppercase"
      >
        <span class="size-1.5 animate-pulse rounded-full bg-amber-500"></span>
        Unsaved Changes
      </span>
    </div>

    <div class="flex items-center gap-3">
      <button
        v-if="!isDevMode"
        @click="handleEditClick"
        class="text-[11px] font-medium text-neutral-400 transition-colors outline-none hover:text-neutral-600 hover:underline dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        Edit Config
      </button>

      <button
        v-else
        @click="saveAndExit"
        class="flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-amber-700 transition-colors hover:bg-amber-200 hover:text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 dark:hover:text-amber-300"
      >
        <Icon name="lucide:check" size="14" />
        <span>Save & Lock</span>
      </button>

      <button
        type="button"
        @click="emit('toggle')"
        class="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        title="Toggle fullscreen"
      >
        <Icon :name="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'" size="16" />
      </button>
    </div>
  </div>

  <div
    class="relative flex flex-1 flex-col overflow-hidden rounded-lg border transition-colors"
    :class="[
      isDevMode
        ? 'border-amber-300 shadow-sm ring-1 ring-amber-100 dark:border-amber-700 dark:ring-amber-900'
        : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900',
      errorMsg ? 'border-red-400 ring-1 ring-red-100 dark:border-red-600 dark:ring-red-900' : '',
    ]"
  >
    <div class="absolute top-2 right-2 z-20">
      <button
        @click="copyToClipboard"
        class="rounded p-1.5 text-xs text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
      >
        <Icon name="lucide:copy" size="14" />
      </button>
    </div>

    <textarea
      v-model="rawJson"
      :disabled="!isDevMode"
      class="custom-scrollbar h-full w-full resize-none bg-transparent p-4 font-mono text-[12px] leading-relaxed text-neutral-700 focus:outline-none disabled:cursor-not-allowed disabled:text-neutral-500 dark:text-neutral-300 dark:disabled:text-neutral-600"
      spellcheck="false"
    ></textarea>

    <div
      v-if="errorMsg"
      class="absolute right-3 bottom-3 left-3 rounded-md border border-red-200 bg-red-50 p-3 text-[11px] text-red-600 shadow-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
    >
      <span class="font-bold">Error:</span> {{ errorMsg }}
    </div>

    <div
      v-if="validationErrors.length"
      class="absolute top-12 left-3 z-20 max-h-56 w-96 overflow-auto rounded-md border border-red-100 bg-white/95 p-3 text-[11px] text-red-600 shadow-lg backdrop-blur-sm dark:border-red-900 dark:bg-neutral-900/95 dark:text-red-400"
    >
      <div class="mb-2 text-xs font-bold text-red-700 dark:text-red-400">Validation Issues</div>
      <ul class="flex list-disc flex-col gap-1 pl-4">
        <li v-for="(e, i) in validationErrors" :key="i">{{ e }}</li>
      </ul>
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showWarning"
        class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 p-6 text-center backdrop-blur-sm dark:bg-neutral-950/90"
      >
        <div
          class="max-w-sm rounded-xl border border-red-100 bg-white p-6 shadow-2xl shadow-red-500/10 dark:border-red-900 dark:bg-neutral-900"
        >
          <div class="mb-4 flex justify-center text-red-500">
            <div
              class="flex size-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950"
            >
              <Icon name="lucide:alert-triangle" size="24" />
            </div>
          </div>

          <h3 class="mb-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
            Enable Raw Editing?
          </h3>
          <p class="mb-6 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Directly editing the schema can break the project layout and functionality. Only proceed
            if you are comfortable working with raw JSON.
          </p>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="cancelEditing"
              class="rounded-lg border border-neutral-200 bg-white py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              @click="enableEditing"
              class="rounded-lg bg-red-600 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-700 dark:hover:bg-red-600"
            >
              I know what I'm doing
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <p class="shrink-0 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
    {{ isDevMode ? 'Changes are applied only on Save & Lock.' : 'Read-only view' }}
  </p>
</template>
