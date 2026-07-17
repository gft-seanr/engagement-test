<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  title: string;
  active?: boolean;
}>();

const emit = defineEmits(['close']);

const isHovered = ref(false);

const showFlyout = computed(() => props.active || isHovered.value);
</script>

<template>
  <div class="group relative" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors"
      :class="showFlyout ? 'bg-blue-100 text-blue-600' : 'text-neutral-500 hover:bg-neutral-100'"
    >
      <slot name="icon">
        <div class="h-5 w-5 rounded-full bg-neutral-300" />
      </slot>
    </div>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-x-2"
      enter-to-class="transform scale-100 opacity-100 translate-x-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-x-0"
      leave-to-class="transform scale-95 opacity-0 -translate-x-2"
    >
      <div
        v-if="showFlyout"
        class="absolute top-0 left-full z-50 ml-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-xl"
      >
        <div class="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
          <span class="text-xs font-bold text-neutral-900">{{ title }}</span>
          <span class="text-[10px] text-neutral-400">Esc to close</span>
        </div>

        <div class="max-h-[300px] overflow-y-auto p-2">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>
