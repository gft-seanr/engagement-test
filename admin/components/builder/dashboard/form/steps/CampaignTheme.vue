<script setup lang="ts">
import { ref, computed } from 'vue';

const colorInput = ref('A263F0');

const colorPickerProxy = computed({
  get() {
    return isValidHex.value ? `#${colorInput.value}` : '#000000';
  },
  set(val: string) {
    colorInput.value = val.replace('#', '').toUpperCase();
  },
});

const handleTextInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  let clean = target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (clean.length > 6) clean = clean.slice(0, 6);

  colorInput.value = clean;

  target.value = clean;
};

const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  const bigint = parseInt(fullHex, 16);
  if (isNaN(bigint)) return { r: 0, g: 0, b: 0 };
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const mixColor = (
  color: { r: number; g: number; b: number },
  target: 'white' | 'black',
  weight: number
) => {
  const t = target === 'white' ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  const r = Math.round(color.r * (1 - weight) + t.r * weight);
  const g = Math.round(color.g * (1 - weight) + t.g * weight);
  const b = Math.round(color.b * (1 - weight) + t.b * weight);
  return rgbToHex(r, g, b);
};

const palette = computed(() => {
  if (colorInput.value.length < 3) return [];
  const rgb = hexToRgb(colorInput.value);
  return [
    mixColor(rgb, 'white', 0.9),
    mixColor(rgb, 'white', 0.7),
    mixColor(rgb, 'white', 0.5),
    mixColor(rgb, 'white', 0.3),
    mixColor(rgb, 'white', 0.1),
    `#${colorInput.value}`,
    mixColor(rgb, 'black', 0.1),
    mixColor(rgb, 'black', 0.3),
    mixColor(rgb, 'black', 0.5),
    mixColor(rgb, 'black', 0.7),
    mixColor(rgb, 'black', 0.9),
  ];
});

const isValidHex = computed(() => /^[0-9A-Fa-f]{3,6}$/.test(colorInput.value));

const test = useThemes();

console.log(test);

const selectedTheme = ref('theme-1');

const themes = useThemes();
</script>

<template>
  <div class="flex flex-col gap-10 p-6">
    <div class="flex flex-col gap-4">
      <div class="flex w-full justify-between">
        <label
          for="base-color-input"
          class="shrink-0 text-sm font-bold text-[#141414] dark:text-neutral-200"
        >
          Base Color
        </label>

        <div
          class="flex max-w-sm items-center overflow-hidden rounded-md border border-gray-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
        >
          <span
            class="bg-gray-100 p-3 text-sm text-gray-500 dark:bg-neutral-800 dark:text-neutral-400"
            aria-hidden="true"
            >#</span
          >

          <input
            id="base-color-input"
            :value="colorInput"
            @input="handleTextInput"
            type="text"
            maxlength="6"
            placeholder="A263F0"
            class="w-32 bg-transparent px-3 py-2 text-sm text-gray-700 focus:outline-none dark:text-neutral-300"
          />

          <input
            v-model="colorPickerProxy"
            type="color"
            class="mx-2 size-6 rounded text-sm text-gray-700 focus:outline-none dark:text-neutral-300"
            aria-label="Color picker"
          />
        </div>
      </div>

      <ul
        v-if="isValidHex"
        class="mt-4 flex w-full list-none items-center justify-center gap-2 overflow-x-auto p-0"
      >
        <li
          v-for="(shade, index) in palette"
          :key="shade"
          :style="{ backgroundColor: shade }"
          class="h-16 w-full rounded-md"
          :aria-label="`Color shade ${index + 1}`"
        ></li>
      </ul>

      <fieldset class="mt-6 flex flex-col gap-4" aria-labelledby="theme-label">
        <div class="flex w-full items-center justify-between">
          <legend
            id="theme-label"
            class="shrink-0 text-sm font-bold text-[#141414] dark:text-neutral-200"
          >
            Form Theme
          </legend>
          <span class="shrink-0 text-sm font-medium text-[#737373] dark:text-neutral-400">
            {{ themes.find((t) => t.id === selectedTheme)?.name }}
          </span>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          <div v-for="theme in themes" :key="theme.id">
            <label class="group relative block cursor-pointer">
              <input
                v-model="selectedTheme"
                type="radio"
                name="form_theme"
                :value="theme.id"
                class="peer sr-only"
              />

              <div
                class="grid grid-rows-[8rem_auto] overflow-hidden rounded-lg border border-gray-300 bg-white transition-all peer-checked:ring-2 peer-checked:ring-purple-500 peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <div
                  class="w-full border-b border-gray-200 bg-gray-100 transition-colors dark:border-neutral-700 dark:bg-neutral-800"
                ></div>

                <div class="bg-white px-4 py-3 dark:bg-neutral-900">
                  <span class="block text-sm font-medium text-gray-900 dark:text-neutral-100">
                    {{ theme.name }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>
