<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'reka-ui';

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        `inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent bg-surface-lower-2 px-4 py-4 text-sm whitespace-nowrap text-text-secondary transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-white dark:data-[state=active]:bg-primary-dark-soft dark:data-[state=active]:text-text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
