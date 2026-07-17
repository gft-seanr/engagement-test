<script setup lang="ts">
const propsModel = defineModel<string>('props');
</script>
<template>
  <div class="relative w-full">
    <input
      v-model="propsModel"
      type="text"
      class="w-full rounded-lg bg-gray-100 p-2 text-xs text-neutral-900 focus:outline focus:outline-purple-500 dark:bg-neutral-800 dark:text-neutral-100"
    />
  </div>
</template>
