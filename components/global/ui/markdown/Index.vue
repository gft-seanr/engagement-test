<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import type { H } from 'vue-router/dist/router-CWoNjPRp.mjs';

const { content = '', tag = 'div' } = defineProps<{
  content: string;
  tag?: string;
  unwrap?: string;
  classes?: {
    outer?: HTMLAttributes['class'];
  };
}>();

const isMarkdown = computed(() => content.startsWith('$$'));
</script>

<template>
  <MDC
    v-if="isMarkdown"
    :value="content.slice(2)"
    :unwrap="'div'"
    :class="classes?.outer"
    class="[&_a]:text-primary"
  />
  <component :is="tag" v-else :class="classes?.outer">{{ content }}</component>
</template>
