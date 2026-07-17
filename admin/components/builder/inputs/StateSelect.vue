<script setup lang="ts">
import { watchEffect } from 'vue';

// (Patchfix?) A separate component for selecting a state since it is used outside props
const stateModel = defineModel<string>('state');

const props = defineProps<{
  options: string[];
  type?: string;
  label?: string;
  default?: string;
}>();

watchEffect(() => {
  if (props.options?.length) {
    if (
      stateModel.value !== '' &&
      (!stateModel.value || !props.options.includes(stateModel.value))
    ) {
      stateModel.value = props.default || '';
    }
  }
});
</script>

<template>
  <div class="relative w-full">
    <select
      v-model="stateModel"
      :class="[
        'w-full appearance-none rounded-md border border-neutral-200 bg-white py-2 pr-12 pl-3 text-xs transition-all hover:border-neutral-400 focus:border-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600',
        !stateModel || stateModel === ''
          ? 'text-neutral-400 dark:text-neutral-500'
          : 'text-neutral-700 dark:text-neutral-300',
      ]"
    >
      <option value="" class="text-neutral-400 dark:text-neutral-500">Select a state...</option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        class="text-neutral-700 dark:text-neutral-300"
      >
        {{ formatCapitalize(option) }}
      </option>
    </select>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center gap-1 pr-3"
    >
      <button
        v-if="stateModel"
        type="button"
        class="pointer-events-auto flex h-full items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        @click.stop="stateModel = ''"
      >
        <Icon name="lucide:x" :size="14" />
      </button>

      <span class="flex h-full items-center justify-center text-neutral-500 dark:text-neutral-400">
        <Icon name="lucide:chevron-down" :size="14" />
      </span>
    </div>
  </div>
</template>
