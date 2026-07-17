<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  coverUrl: string;
  classes?: {
    outer?: HTMLAttributes['class'];
    content?: HTMLAttributes['class'];
  };
}>();
</script>

<template>
  <div :class="classes?.outer">
    <NuxtPicture
      :src="coverUrl"
      :imgAttrs="{
        class: cn('w-full', classes?.content),
        height: '220', // default height
        width: '414', // default width
        ...$attrs, // override with any additional attributes passed
      }"
    ></NuxtPicture>
  </div>
</template>
