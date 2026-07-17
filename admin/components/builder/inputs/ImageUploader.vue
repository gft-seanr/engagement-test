<script setup lang="ts">
import { debouncedRef } from '@vueuse/core';
import clsx from 'clsx';

import ContextMenu from '~admin/components/shared/ContextMenu.vue';
const propsModel = defineModel<string>('props');
const attrsModel = defineModel<Record<string, any>>('attrs', { default: () => ({}) });

async function handleChangeImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  simulateUpload(file);
}

const createAttrProxy = (key: string) =>
  computed({
    get: () => attrsModel.value?.[key] ?? '',
    set: (val) => {
      const newAttrs = { ...attrsModel.value };

      if (val === '' || val === null || val === undefined) {
        delete newAttrs[key];
      } else {
        newAttrs[key] = val;
      }

      attrsModel.value = newAttrs;
    },
  });

const widthProxy = createAttrProxy('width');
const heightProxy = createAttrProxy('height');

function checkImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(false);
    img.src = url;
  });
}

const imageSrc = ref<string>(propsModel.value || '');
const debouncedImageSrc = debouncedRef(imageSrc, 500);

const isImageValid = ref(true);
const isChecking = ref(false);

const isMenuOpen = ref(false);
const triggerEl = useTemplateRef<HTMLButtonElement | null>('triggerEl');

const isDragging = ref<boolean>(false);
const isUploading = ref(false);

const progress = ref(0);

const simulateUpload = (file: File) => {
  const reader = new FileReader();

  isUploading.value = true;
  progress.value = 0;

  const interval = setInterval(() => {
    progress.value += Math.random() * 30;

    if (progress.value >= 100) {
      clearInterval(interval);
      progress.value = 100;

      setTimeout(() => {
        // const objectUrl = URL.createObjectURL(file);

        reader.onload = (e) => {
          propsModel.value = e.target?.result as string;
          isUploading.value = false;
        };

        reader.readAsDataURL(file);

        isUploading.value = false;
        progress.value = 0;
      }, 200);
    }
  }, 100);
};

function handleDrop(e: any) {
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];

  // const objectUrl = URL.createObjectURL(file);

  simulateUpload(file);
}

watch(debouncedImageSrc, async (newValue) => {
  if (newValue) {
    isChecking.value = true;
    try {
      await checkImage(debouncedImageSrc.value);
      isImageValid.value = true;

      propsModel.value = debouncedImageSrc.value;
    } catch (e) {
      isImageValid.value = false;
      throw e;
    } finally {
      isChecking.value = false;
    }
  }
});

watch(
  propsModel,
  (newValue) => {
    if (newValue !== imageSrc.value) {
      imageSrc.value = newValue as string;
      isImageValid.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div ref="triggerEl" class="relative flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold whitespace-nowrap dark:text-neutral-300"> Image </span>
        <div class="flex justify-end">
          <button
            @click="isMenuOpen = true"
            class="relative aspect-video size-18 cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 hover:opacity-80 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <nuxt-img
              v-if="propsModel"
              :src="propsModel"
              class="h-full w-full object-contain transition-opacity duration-300"
              :class="{ 'opacity-50': isUploading }"
              alt="Preview"
            />

            <div
              v-if="isUploading"
              class="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/40"
            >
              <Icon
                name="lucide:loader-2"
                class="animate-spin text-neutral-600 dark:text-neutral-400"
              />
            </div>
          </button>
        </div>
      </div>

      <div class="grid w-full grid-cols-2 gap-3">
        <div class="flex items-center gap-2">
          <label
            for="width-input"
            class="cursor-pointer text-xs font-semibold text-neutral-900 select-none dark:text-neutral-100"
          >
            Width
          </label>

          <div class="relative flex-1">
            <input
              v-model="widthProxy"
              id="width-input"
              type="text"
              placeholder="212"
              class="h-8 w-full rounded-md border border-neutral-200 bg-gray-50 pr-6 pl-2 text-xs font-medium text-neutral-900 transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-700 dark:focus:border-purple-500/50"
            />
            <span
              class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 select-none dark:text-neutral-600"
            >
              px
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label
            for="height-input"
            class="cursor-pointer text-xs font-semibold text-neutral-900 select-none dark:text-neutral-100"
          >
            Height
          </label>

          <div class="relative flex-1">
            <input
              v-model="heightProxy"
              id="height-input"
              type="text"
              placeholder="400"
              class="h-8 w-full rounded-md border border-neutral-200 bg-gray-50 pr-6 pl-2 text-xs font-medium text-neutral-900 transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-700 dark:focus:border-purple-500/50"
            />
            <span
              class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 select-none dark:text-neutral-600"
            >
              px
            </span>
          </div>
        </div>
      </div>

      <ContextMenu
        :open="isMenuOpen"
        :trigger="triggerEl"
        :menu-width="260"
        :gap="20"
        @close="isMenuOpen = false"
      >
        <div class="flex flex-col gap-4 p-2">
          <div
            class="group relative h-32 w-full overflow-hidden rounded border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <nuxt-img
              class="h-full w-full object-contain p-2 opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
              :src="propsModel"
              alt="preview"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="image_source"
              class="text-[11px] font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
            >
              Image URL
            </label>
            <div class="relative flex flex-col items-center gap-4">
              <input
                v-model="imageSrc"
                name="image_source"
                id="image_source"
                type="text"
                placeholder="https://..."
                :class="
                  clsx(
                    'ring-none h-8 w-full rounded border border-neutral-200 bg-white px-2.5 text-xs text-neutral-700 transition-all outline-none placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500',
                    {
                      'border-red-500 dark:border-red-400': !isImageValid,
                    }
                  )
                "
              />

              <span
                v-if="isChecking"
                class="animate-pulse text-[10px] text-blue-500 dark:text-blue-400"
                >Checking...</span
              >
              <span
                v-else-if="!isImageValid"
                class="text-[10px] font-medium text-red-500 dark:text-red-400"
                >Invalid image URL</span
              >
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
            <span class="flex-shrink-0 text-xs font-medium text-neutral-400 dark:text-neutral-500"
              >OR</span
            >
            <div class="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>

          <div
            class="flex items-start gap-1.5 rounded border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400"
          >
            <Icon name="lucide:triangle-alert" class="mt-px size-3 shrink-0" />
            <span>S3 upload endpoint is not yet available. Use an image URL above for now.</span>
          </div>

          <div
            class="group relative flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed transition-all"
            :class="[
              isDragging
                ? 'border-purple-500 bg-purple-50/50 dark:border-purple-400 dark:bg-purple-900/20'
                : 'border-neutral-300 bg-neutral-50/50 hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800',
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <template v-if="!isUploading">
              <div
                class="flex size-8 items-center justify-center rounded border shadow-sm transition-colors"
                :class="
                  isDragging
                    ? 'border-purple-200 bg-purple-100 text-purple-600 dark:border-purple-800/50 dark:bg-purple-900/50 dark:text-purple-400'
                    : 'border-neutral-200 bg-white text-neutral-500 group-hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                "
              >
                <Icon name="lucide:upload" class="size-4" />
              </div>

              <div class="flex flex-col items-center text-center">
                <p
                  class="text-[11px] font-medium"
                  :class="
                    isDragging
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-neutral-600 dark:text-neutral-300'
                  "
                >
                  <span
                    :class="
                      isDragging
                        ? ''
                        : 'text-neutral-900 group-hover:underline dark:text-neutral-100'
                    "
                  >
                    {{ isDragging ? 'Drop to upload' : 'Click to upload' }}
                  </span>
                  <span v-if="!isDragging"> or drag</span>
                </p>
                <span
                  class="text-[10px]"
                  :class="
                    isDragging
                      ? 'text-purple-400 dark:text-purple-500'
                      : 'text-neutral-400 dark:text-neutral-500'
                  "
                >
                  SVG, PNG, JPG (max 2MB)
                </span>
              </div>
              <input
                @change="handleChangeImage"
                ref="imageInput"
                type="file"
                accept="image/*"
                class="absolute inset-0 cursor-pointer opacity-0"
              />
            </template>

            <div v-else class="flex w-full flex-col items-center gap-2 px-8">
              <div
                class="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300"
              >
                <Icon name="lucide:loader-2" class="size-3 animate-spin" />
                <span>Uploading...</span>
              </div>

              <div
                class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
              >
                <div
                  class="h-full bg-blue-500 transition-all duration-200 ease-out dark:bg-blue-400"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </ContextMenu>
    </div>
  </div>
</template>
