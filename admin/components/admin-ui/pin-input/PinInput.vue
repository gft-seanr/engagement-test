<script setup lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: () => [],
});
const emits = defineEmits<PinInputRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PinInputRoot
    v-bind="forwarded"
    :class="cn('flex items-center gap-2 dark:text-neutral-100', props.class)"
  >
    <slot />
  </PinInputRoot>
</template>
