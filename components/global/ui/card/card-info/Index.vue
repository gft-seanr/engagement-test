<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineProps<{
  title?: string;
  iconUrl?: string;
  description?: string;
  classes?: {
    outer?: HTMLAttributes['class'];
    wrapper?: HTMLAttributes['class'];
    title?: HTMLAttributes['class'];
    description?: HTMLAttributes['class'];
  };
}>();
</script>

<template>
  <div
    :class="
      cn(
        'overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-gray-800',
        classes?.outer
      )
    "
  >
    <div :class="cn('flex flex-row items-center gap-4 p-5', classes?.wrapper)">
      <div class="[border-radius:calc(0.75rem-1px)] p-1">
        <NuxtImg :src="iconUrl" class="size-10 flex-shrink-0 sm:size-12" alt="icon" />
      </div>

      <div class="space-y-2 text-left">
        <h2
          :class="
            cn(
              'text-base leading-tight font-bold text-black sm:text-lg dark:text-white',
              classes?.title
            )
          "
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          :class="cn('text-xs text-gray-600 sm:text-sm dark:text-gray-300', classes?.description)"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
