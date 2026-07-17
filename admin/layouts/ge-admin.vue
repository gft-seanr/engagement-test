<script setup lang="ts">
import clsx from 'clsx';
import ModalProvider from '~admin/components/shared/ModalProvider.vue';
import Canvas from '~admin/components/builder/Canvas.vue';
import Sidebar from '~admin/components/layout/Sidebar.vue';
import Header from '~admin/components/layout/Header.vue';

const formProviders = useFormProviders();

const builderStore = useBuilderStore();
const { mode } = storeToRefs(builderStore);

const route = useRoute();

const isExpanded = ref(false);
const projectMenuEl = useTemplateRef<HTMLElement>('projectMenuEl');
const isProjectMenuOpen = ref(false);

const showCanvas = computed(() => {
  return mode.value !== 'preview' && route.path.includes('/builder');
});

function handleToggle() {
  isExpanded.value = !isExpanded.value;
}

onClickOutside(projectMenuEl, () => {
  if (isProjectMenuOpen.value) isProjectMenuOpen.value = false;
});
</script>

<template>
  <div
    class="min-h-dvh bg-gray-50 antialiased transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50"
  >
    <NuxtLoadingIndicator color="#9333ea" :height="3" />

    <ModalProvider />
    <div class="flex h-dvh w-full overflow-hidden">
      <Sidebar v-show="mode !== 'preview'" @toggle="handleToggle" :is-expanded="isExpanded" />

      <div class="flex-1 [--header-height:4rem]">
        <Header v-show="mode !== 'preview'" />
        <main
          :class="
            clsx('overflow-hidden', {
              'h-dvh': mode === 'preview',
              'h-[calc(100dvh-var(--header-height))]': mode !== 'preview',
            })
          "
        >
          <slot />
        </main>
        <Canvas v-show="showCanvas" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
