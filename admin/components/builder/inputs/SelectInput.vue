<script setup lang="ts">
import { watchEffect } from 'vue';

const propsModel = defineModel<string>('props');

const props = defineProps<{
  options: string[];
  type?: string;
  label?: string;
  default?: string;
}>();

watchEffect(() => {
  if (props.options?.length) {
    if (
      propsModel.value !== '' &&
      (!propsModel.value || !props.options.includes(propsModel.value))
    ) {
      propsModel.value = props.default || '';
    }
  }
});
</script>

<template>
  <select
    v-model="propsModel"
    :class="[
      'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs focus:outline-none dark:border-neutral-700 dark:bg-neutral-900',
      !propsModel || propsModel === ''
        ? 'text-neutral-400 dark:text-neutral-500'
        : 'text-neutral-700 dark:text-neutral-300',
    ]"
  >
    <option value="" class="text-neutral-400 dark:text-neutral-500">
      {{ props.label || 'None' }}
    </option>

    <option
      v-for="option in options"
      :key="option"
      :value="option"
      class="text-neutral-700 dark:text-neutral-300"
    >
      {{ option.charAt(0).toUpperCase() + option.slice(1) }}
    </option>
  </select>
</template>
