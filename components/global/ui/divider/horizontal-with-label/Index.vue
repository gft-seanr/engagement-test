<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
const { label, classes } = defineProps<{
  label?: string;
  classes?: {
    outer?: HTMLAttributes['class'];
    label?: HTMLAttributes['class'];
  };
}>();
</script>

<template>
  <div
    :class="
      cn(
        `before:content-[' '] after:content-[' '] relative flex items-center justify-center overflow-hidden leading-none *:inline-block before:relative before:-ml-[50%] before:inline-block before:w-1/2 before:border-t before:border-border-neutral before:align-middle after:relative after:left-2 after:-mr-[50%] after:inline-block after:w-1/2 after:border-t after:border-border-neutral after:align-middle`,
        classes?.outer,
        label ? 'before:right-2 after:left-2' : 'before:right-0 after:left-0'
      )
    "
  >
    <Markdown
      v-if="label"
      tag="span"
      :content="label"
      :class="cn('text-sm text-text-secondary', classes?.label)"
    />
  </div>
</template>
