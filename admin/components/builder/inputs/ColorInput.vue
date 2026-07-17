<script setup lang="ts">
const propsModel = defineModel<string>('props');
</script>

<template>
  <div
    class="flex w-full items-center gap-2 rounded-lg bg-gray-100 p-1.5 focus-within:outline focus-within:outline-purple-500 dark:bg-neutral-800"
  >
    <div
      class="relative size-6 shrink-0 overflow-hidden rounded border border-neutral-200 shadow-sm transition-transform active:scale-95 dark:border-neutral-700"
    >
      <input
        v-model="propsModel"
        type="color"
        class="absolute -inset-2 size-10 cursor-pointer appearance-none border-0 bg-transparent p-0"
      />
    </div>

    <input
      v-model="propsModel"
      type="text"
      class="w-full bg-transparent px-1 py-0.5 text-xs font-medium text-neutral-900 uppercase focus:outline-none dark:text-neutral-100"
      placeholder="#000000"
    />
  </div>
</template>
