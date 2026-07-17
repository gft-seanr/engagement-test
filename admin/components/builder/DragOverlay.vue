<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useMouse } from '@vueuse/core';

const props = defineProps<{
  element?: any;
}>();

const overlayRef = ref<HTMLElement | null>(null);

const { x, y } = useMouse({ type: 'client' });

const previewProps = computed(() => {
  if (!props.element?.properties) return {};

  return extractDefaults(props.element.properties);
});

const isFormElement = computed(() => {
  return props.element?.id?.split('-').includes('form') ?? false;
});

watchEffect(() => {
  if (overlayRef.value) {
    overlayRef.value.style.transform = `translate3d(${x.value}px, ${y.value}px, 0) scale(0.8) translate(-10%, -10%)`;
    overlayRef.value.style.opacity = x.value === 0 && y.value === 0 ? '0' : '1';
  }
});
</script>

<template>
  <teleport to="body">
    <div
      v-if="element"
      ref="overlayRef"
      class="pointer-events-none fixed top-0 left-0 z-[9999] w-[300px] origin-top-left transition-opacity duration-75 will-change-transform"
    >
      <div
        class="relative overflow-hidden rounded-xl border border-white/40 bg-white/85 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200/50 backdrop-blur-md transition-all dark:border-neutral-700/50 dark:bg-neutral-900/90 dark:ring-neutral-800"
      >
        <div
          class="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
          style="
            background-image: radial-gradient(#000 1px, transparent 1px);
            background-size: 8px 8px;
          "
        ></div>

        <div v-if="!isFormElement">
          <ClientOnly>
            <component :is="element.id" v-bind="previewProps" />
          </ClientOnly>
        </div>

        <div v-else>
          <FormKitSchema v-if="previewProps.schema" :schema="previewProps.schema" />
        </div>
      </div>

      <div
        class="absolute -top-2.5 -right-2.5 flex h-6 items-center justify-center rounded-full bg-purple-600 px-2.5 text-[10px] font-bold tracking-wider text-white shadow-lg ring-2 ring-white dark:ring-neutral-950"
      >
        ADD
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
