<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsContent, type TabsContentProps } from 'reka-ui';

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <TabsContent
    data-slot="tabs-content"
    :class="cn('flex-1 outline-none data-[state=inactive]:hidden', props.class)"
    v-bind="delegatedProps"
    forceMount
  >
    <slot />
  </TabsContent>
</template>
