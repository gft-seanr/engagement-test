<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineProps<{
  logoUrl: string;
  classes?: {
    outer?: HTMLAttributes['class'];
    content?: HTMLAttributes['class'];
  };
}>();
</script>

<template>
  <div :class="classes?.outer" class="bg-white px-4 py-6">
    <NuxtPicture
      :src="logoUrl"
      :imgAttrs="{
        ...$attrs,
        class: cn('mx-auto max-h-14 max-w-[200px]', classes?.content),
      }"
    />
  </div>
</template>
