<script setup lang="ts">
import type { PinInputInputProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PinInputInput, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<PinInputInputProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <PinInputInput
    v-bind="forwardedProps"
    :class="
      cn(
        'headline-3 flex h-16 w-full items-center justify-center rounded-lg border border-border text-center font-bold focus:relative focus:z-10 focus:ring-2 focus:ring-primary focus:outline-none',
        props.class
      )
    "
  />
</template>
