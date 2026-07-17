<script setup lang="ts">
const propsModel = defineModel<string>('props');

const options = [
  { value: 'left', icon: 'lucide:align-left', label: 'Left' },
  { value: 'center', icon: 'lucide:align-center', label: 'Center' },
  { value: 'right', icon: 'lucide:align-right', label: 'Right' },
  { value: 'justify', icon: 'lucide:align-justify', label: 'Justify' },
];
</script>

<template>
  <div
    class="flex w-full items-center rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-800"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      @click="propsModel = opt.value"
      class="flex flex-1 items-center justify-center rounded-md py-1.5 transition-all duration-200"
      :class="[
        propsModel === opt.value
          ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-black/5 dark:bg-neutral-700 dark:text-neutral-100 dark:ring-white/5'
          : 'text-neutral-400 hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-300',
      ]"
      :title="opt.label"
    >
      <Icon :name="opt.icon" size="16" />
    </button>
  </div>
</template>
