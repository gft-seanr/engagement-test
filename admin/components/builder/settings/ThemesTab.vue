<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useBuilderStore } from '~/admin/stores/builder';

const builderStore = useBuilderStore();
const { campaignConfig } = storeToRefs(builderStore);

const themeFiles = import.meta.glob('~/assets/formkit-themes/formkit-*.ts');

const availableThemes = Object.keys(themeFiles).map((path) => {
  const filename = path.split('/').pop() || '';
  return filename.replace('formkit-', '').replace('.ts', '');
});

const themeForm = ref({
  colors: {
    primary: '#07579F',
    primarySoft: '#E2F0FE',
    primaryDark: '#5AABF0',
    primaryDarkSoft: '#0F2F4A',
    secondary: '#4B9ECF',
    secondarySoft: '#E7F2F9',
    secondaryDark: '#6CB4E0',
    secondaryDarkSoft: '#1A4255',
  },
  formTheme: '',
});

let isInitializing = false;

function formatThemeName(theme: string) {
  return theme
    .split('-')
    .map((word) =>
      word.length <= 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

onMounted(() => {
  isInitializing = true;

  const storedTheme = campaignConfig.value?.theme?.colors;
  const storedFormTheme = campaignConfig.value?.theme?.form;

  if (storedTheme) {
    themeForm.value.colors = {
      primary: storedTheme['--primary'] || '#07579F',
      primarySoft: storedTheme['--primary-soft'] || '#E2F0FE',
      primaryDark: storedTheme['--primary-dark'] || '#5AABF0',
      primaryDarkSoft: storedTheme['--primary-dark-soft'] || '#0F2F4A',
      secondary: storedTheme['--secondary'] || '#4B9ECF',
      secondarySoft: storedTheme['--secondary-soft'] || '#E7F2F9',
      secondaryDark: storedTheme['--secondary-dark'] || '#6CB4E0',
      secondaryDarkSoft: storedTheme['--secondary-dark-soft'] || '#1A4255',
    };
  }

  if (storedFormTheme && availableThemes.includes(storedFormTheme)) {
    themeForm.value.formTheme = storedFormTheme;
  }

  setTimeout(() => {
    isInitializing = false;
  }, 0);
});

watch(
  themeForm,
  (newVal) => {
    if (isInitializing) return;

    const updatedColors = {
      '--primary': newVal.colors.primary,
      '--primary-soft': newVal.colors.primarySoft,
      '--primary-dark': newVal.colors.primaryDark,
      '--primary-dark-soft': newVal.colors.primaryDarkSoft,
      '--secondary': newVal.colors.secondary,
      '--secondary-soft': newVal.colors.secondarySoft,
      '--secondary-dark': newVal.colors.secondaryDark,
      '--secondary-dark-soft': newVal.colors.secondaryDarkSoft,
    };

    campaignConfig.value = {
      ...campaignConfig.value,
      theme: {
        ...campaignConfig.value?.theme,
        colors: updatedColors,
        form: newVal.formTheme, // Sync the form theme string
      },
    };
  },
  { deep: true }
);

function formatHex(event: Event, key: keyof typeof themeForm.value.colors) {
  const target = event.target as HTMLInputElement;
  let val = target.value;
  if (!val.startsWith('#')) val = '#' + val;
  themeForm.value.colors[key] = val.toUpperCase();
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Campaign Theme</h3>
    <p class="text-[13px] text-neutral-500 dark:text-neutral-400">
      Define the global color palette used throughout your campaign pages.
    </p>
  </div>

  <div
    class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50"
  >
    <div class="mb-5 flex items-center gap-2">
      <div
        class="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <Icon name="lucide:palette" size="12" />
      </div>
      <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Primary Colors</h4>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.primary"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Base</span
          >
          <input
            v-model="themeForm.colors.primary"
            @blur="formatHex($event, 'primary')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.primarySoft"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Soft</span
          >
          <input
            v-model="themeForm.colors.primarySoft"
            @blur="formatHex($event, 'primarySoft')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.primaryDark"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Dark</span
          >
          <input
            v-model="themeForm.colors.primaryDark"
            @blur="formatHex($event, 'primaryDark')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.primaryDarkSoft"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Dark Soft</span
          >
          <input
            v-model="themeForm.colors.primaryDarkSoft"
            @blur="formatHex($event, 'primaryDarkSoft')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50"
  >
    <div class="mb-5 flex items-center gap-2">
      <div
        class="flex size-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
      >
        <Icon name="lucide:paint-bucket" size="12" />
      </div>
      <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Secondary Colors</h4>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.secondary"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Base</span
          >
          <input
            v-model="themeForm.colors.secondary"
            @blur="formatHex($event, 'secondary')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.secondarySoft"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Soft</span
          >
          <input
            v-model="themeForm.colors.secondarySoft"
            @blur="formatHex($event, 'secondarySoft')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.secondaryDark"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Dark</span
          >
          <input
            v-model="themeForm.colors.secondaryDark"
            @blur="formatHex($event, 'secondaryDark')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-shadow focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div
          class="relative size-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <input
            v-model="themeForm.colors.secondaryDarkSoft"
            type="color"
            class="absolute -inset-2 size-14 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
        <div class="flex flex-1 flex-col">
          <span
            class="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
            >Dark Soft</span
          >
          <input
            v-model="themeForm.colors.secondaryDarkSoft"
            @blur="formatHex($event, 'secondaryDarkSoft')"
            type="text"
            class="w-full text-sm font-medium text-neutral-900 uppercase outline-none dark:bg-transparent dark:text-neutral-100"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50"
  >
    <div class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex size-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        >
          <Icon name="lucide:layout-list" size="12" />
        </div>
        <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Form Theme</h4>
      </div>
    </div>

    <div v-if="availableThemes.length > 0" class="grid gap-4 sm:grid-cols-3">
      <button
        v-for="theme in availableThemes"
        :key="theme"
        @click="themeForm.formTheme = theme"
        class="group relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        :class="
          themeForm.formTheme === theme
            ? 'border-purple-500 bg-purple-50/50 shadow-sm ring-1 ring-purple-500 dark:bg-purple-950/50 dark:ring-purple-500/50'
            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/50'
        "
      >
        <div class="flex w-full items-center justify-between">
          <div
            class="flex size-4 items-center justify-center rounded-full border transition-colors"
            :class="
              themeForm.formTheme === theme
                ? 'border-purple-600 bg-purple-600'
                : 'border-neutral-300 bg-white group-hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-900 dark:group-hover:border-neutral-500'
            "
          >
            <div
              class="size-1.5 rounded-full bg-white transition-transform"
              :class="themeForm.formTheme === theme ? 'scale-100' : 'scale-0'"
            ></div>
          </div>

          <Icon
            v-if="themeForm.formTheme === theme"
            name="lucide:check-circle-2"
            class="size-4 text-purple-600 opacity-80 dark:text-purple-400"
          />
        </div>

        <div class="flex flex-col gap-0.5">
          <span class="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
            {{ formatThemeName(theme) }}
          </span>
        </div>
      </button>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white py-8 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Icon
        name="lucide:file-question"
        class="mb-2 size-6 text-neutral-400 dark:text-neutral-500"
      />
      <span class="text-[13px] font-medium text-neutral-600 dark:text-neutral-400"
        >No form themes found</span
      >
      <span class="text-[11px] text-neutral-400 dark:text-neutral-500"
        >Ensure themes exist in /assets/formkit-themes/</span
      >
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e5e5;
  border-radius: 10px;
}
</style>
