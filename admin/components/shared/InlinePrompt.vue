<script setup lang="ts">
import { cn } from '~/lib/utils';

const props = defineProps<{
  description: string;
  class?: string;
}>();
</script>

<template>
  <div :class="cn('flex w-full items-center justify-center gap-2 text-sm', props.class)">
    <p class="text-accent-foreground">{{ props.description }}</p>

    <div class="[&>*]:hover:underline">
      <slot></slot>
    </div>
  </div>
</template>
