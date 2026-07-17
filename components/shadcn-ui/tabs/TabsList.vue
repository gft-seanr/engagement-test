<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsList, type TabsListProps } from 'reka-ui';

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="
      cn(
        'no-scrollbar inline-flex h-10 w-full touch-pan-x snap-x snap-mandatory items-center justify-start gap-2 overflow-auto scroll-smooth rounded-lg p-[3px] text-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
