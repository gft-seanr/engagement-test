<script setup lang="ts">
import { ref, watch } from 'vue';

const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);

const isDevMode = ref(false);
const showWarning = ref(false);
const errorMsg = ref('');

const rawJson = ref('');
const modalRoot = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);

function toggleFullscreen() {
  const el = modalRoot.value;
  if (!el) return;

  if (!isFullscreen.value && el.requestFullscreen) {
    el.requestFullscreen().catch(() => {
      isFullscreen.value = true;
    });
    return;
  }

  if (isFullscreen.value && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {
      isFullscreen.value = false;
    });
    return;
  }

  isFullscreen.value = !isFullscreen.value;
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

document.addEventListener('fullscreenchange', onFullscreenChange);

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
  import.meta.hot.dispose(() =>
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  );
}

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

function saveAndExit() {
  try {
    const parsed = JSON.parse(rawJson.value);

    // structural validation
    const errs = validateConfig(parsed);
    if (errs.length) {
      validationErrors = errs;
      errorMsg.value = 'Validation failed';
      return;
    }

    const safeConfig = sanitizeConfig(parsed);

    campaignConfig.value = safeConfig;
    isDevMode.value = false;
    errorMsg.value = '';
    validationErrors = [];
  } catch (e: any) {
    errorMsg.value = e.message || 'Invalid JSON syntax';

    setTimeout(() => {
      errorMsg.value = '';
    }, 300);
  }
}

let validationErrors: string[] = [];
</script>

<template>
  <div
    ref="modalRoot"
    :class="[
      'flex h-full min-h-[30rem] w-full min-w-[45rem] flex-col gap-3 p-4',
      isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : '',
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="text-[10px] font-bold tracking-wider uppercase"
          :class="isDevMode ? 'text-amber-600' : 'text-purple-600'"
        >
          {{ isDevMode ? 'Editing' : 'JSON Viewer' }}
        </span>
        <span v-if="isDevMode" class="flex size-1.5 animate-pulse rounded-full bg-amber-500"></span>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="!isDevMode"
          @click="handleEditClick"
          class="text-[10px] font-medium text-neutral-400 transition-colors outline-none hover:text-neutral-600 hover:underline focus-visible:text-neutral-900"
        >
          Edit Config
        </button>

        <button
          v-else
          @click="saveAndExit"
          class="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700 transition-colors hover:bg-amber-200 hover:text-amber-800"
        >
          <Icon name="lucide:check" size="12" />
          <span>Save & Lock</span>
        </button>
        <button
          type="button"
          @click="toggleFullscreen"
          class="ml-2 rounded p-1 text-neutral-400 hover:bg-neutral-100"
          title="Toggle fullscreen"
        >
          <Icon :name="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'" size="14" />
        </button>
      </div>
    </div>

    <div
      class="relative flex-1 overflow-hidden rounded-md border transition-colors"
      :class="[
        isDevMode
          ? 'border-amber-300 shadow-sm ring-1 ring-amber-100'
          : 'border-neutral-200 bg-neutral-50',
        errorMsg ? 'border-red-400 ring-red-100' : '',
      ]"
    >
      <div class="absolute top-2 right-2 z-20 flex items-center gap-2">
        <button @click="copyToClipboard" class="text-xs text-neutral-400 hover:text-neutral-600">
          Copy
        </button>
      </div>

      <textarea
        v-model="rawJson"
        :disabled="!isDevMode"
        class="h-full w-full resize-none bg-transparent p-3 font-mono text-[11px] leading-relaxed text-neutral-700 focus:outline-none disabled:cursor-not-allowed disabled:text-neutral-500"
        spellcheck="false"
      ></textarea>

      <div
        v-if="errorMsg"
        class="absolute right-2 bottom-2 left-2 rounded border border-red-200 bg-red-100 px-3 py-2 text-[10px] text-red-600"
      >
        <span class="font-bold">Error:</span> {{ errorMsg }}
      </div>

      <div
        v-if="validationErrors && validationErrors.length"
        class="absolute top-12 left-2 z-20 max-h-56 w-96 overflow-auto rounded bg-white/80 p-2 text-[11px] text-red-600"
      >
        <div class="mb-1 text-xs font-bold text-red-700">Validation Issues</div>
        <ul class="list-disc pl-4">
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
          class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 p-6 text-center backdrop-blur-sm"
        >
          <div
            class="max-w-xs rounded-lg border border-red-100 bg-white p-4 shadow-xl shadow-red-500/10"
          >
            <div class="mb-3 flex justify-center text-red-500">
              <Icon name="lucide:alert-triangle" size="24" />
            </div>

            <h3 class="mb-1 text-sm font-bold text-neutral-900">Enable Raw Editing?</h3>
            <p class="mb-4 text-[10px] leading-relaxed text-amber-700">
              Directly editing the schema can break the project. Only proceed if you are comfortable
              working with raw JSON.
            </p>

            <div class="grid grid-cols-2 gap-2">
              <button
                @click="cancelEditing"
                class="rounded border border-neutral-200 bg-white py-1.5 text-[10px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                @click="enableEditing"
                class="rounded bg-red-600 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-red-700"
              >
                I know what I'm doing
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <p class="text-center text-[10px] text-neutral-400">
      {{ isDevMode ? 'Changes are applied only on Save.' : 'Read-only view' }}
    </p>
  </div>
</template>
