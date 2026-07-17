<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = defineProps<{
  title: string;
  description?: string;
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('mb-10', props.class)">
    <h2 class="font-heading text-4xl font-bold dark:text-neutral-100">{{ props.title }}</h2>
    <p
      v-if="props.description"
      class="mt-1 text-sm font-normal text-neutral-600 dark:text-neutral-100"
    >
      {{ props.description }}
    </p>
  </div>
</template>
