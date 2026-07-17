<script setup lang="ts">
defineProps<{
  label: string;
  for?: string;
  labelWidth?: string;
  alignTop?: boolean;
}>();
</script>

<template>
  <div
    class="flex w-full flex-col gap-2 md:flex-row md:justify-between md:gap-0"
    :class="alignTop ? 'md:items-start md:pt-2' : 'md:items-center'"
  >
    <label
      :for="for"
      class="shrink-0 text-xs font-bold text-[#141414] transition-colors dark:text-neutral-100"
      :class="labelWidth"
    >
      {{ label }}
    </label>

    <div class="w-full md:max-w-xs md:flex-1">
      <slot />
    </div>
  </div>
</template>
