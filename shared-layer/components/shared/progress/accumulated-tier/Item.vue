<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

const props = defineProps<{
  index: number;
  class?: HTMLAttributes['class'];
}>();

provide('item-index', props.index);
</script>

<template>
  <div :class="cn('col-span-12 grid grid-cols-subgrid', props.class)">
    <slot />
  </div>
</template>
