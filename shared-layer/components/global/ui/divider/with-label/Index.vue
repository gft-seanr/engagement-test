<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
const { label, classes } = defineProps<{
  label: string;
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
        `before:content-[' '] after:content-[' '] relative flex items-center justify-center overflow-hidden leading-none before:relative before:right-[.5rem] before:-ml-[50%] before:inline-block before:w-1/2 before:border-t-[1px] before:border-surface-disable before:align-middle after:relative after:left-[.5rem] after:-mr-[50%] after:inline-block after:w-1/2 after:border-t-[1px] after:border-surface-disable after:align-middle [&>*]:inline-block`,
        classes?.outer
      )
    "
  >
    <Markdown
      tag="span"
      :content="label"
      :class="cn('text-sm text-text-secondary', classes?.label)"
    />
  </div>
</template>
