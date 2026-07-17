<!--
 BASIC DISPLAY TEMPLATE

  Purpose: Basic campaign template for static content rendering

  Key Features:
  - Simple section rendering (no state management)
  - Static content display (sections are always visible)
  - Minimal logic - pure presentation component

  Content Flow:
  1. Receives sections array as props
  2. Renders all sections
  3. No state changes

  Layout: Basic flex column layout with transition animations

  Usage: Simple campaign pages
-->
<script setup lang="ts">
interface Props {
  sections: Array<Section>;
  classes?: {
    outer?: string;
  };
}
const { sections } = defineProps<Props>();
</script>
<template>
  <TransitionGroup name="list" tag="div" :class="cn('flex flex-col gap-8', classes?.outer)">
    <SectionRenderer v-for="section in sections" :key="section.id" :section />
  </TransitionGroup>
</template>
