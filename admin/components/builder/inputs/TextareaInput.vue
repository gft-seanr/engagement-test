<script setup lang="ts">
const propsModel = defineModel<string>('props');
</script>
<template>
  <div class="relative w-full">
    <textarea
      v-model="propsModel"
      rows="4"
      cols="20"
      class="w-full rounded-lg bg-gray-100 p-1.5 text-xs text-neutral-900 focus:outline focus:outline-purple-500 dark:bg-neutral-800 dark:text-neutral-100"
    />
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}
</style>
