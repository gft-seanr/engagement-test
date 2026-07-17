<script setup lang="ts">
import { INPUT_COMPONENTS } from '~/admin/constants/builder/inputs';

const componentProps = defineProps<{
  props?: Record<string, any>;
  children?: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'update:props', value: Record<string, any>): void;
}>();

function handleChildUpdate(childKey: string, val: any) {
  const currentState = componentProps.props || {};

  const newState = {
    ...currentState,
    [childKey]: val,
  };

  emit('update:props', newState);
}

function getChildValue(childKey: string, childConfig: any) {
  const currentValue = componentProps.props?.[childKey];

  if (currentValue !== undefined) return currentValue;

  return undefined;
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-for="(childConfig, childKey) in children" :key="childKey" class="flex flex-col">
      <div class="flex flex-col gap-1.5">
        <span
          v-if="childConfig.type !== 'array'"
          class="text-xs font-semibold whitespace-nowrap capitalize dark:text-neutral-300"
        >
          {{ childConfig?.label }}
        </span>
        <component
          v-if="INPUT_COMPONENTS[childConfig?.type]"
          :is="INPUT_COMPONENTS[childConfig?.type]"
          :props="getChildValue(childKey, childConfig)"
          @update:props="(val: any) => handleChildUpdate(childKey, val)"
          v-bind="childConfig"
          :placeholder="childConfig.default"
        />
      </div>
    </div>
  </div>
</template>
