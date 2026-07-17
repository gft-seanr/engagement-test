<script setup lang="ts">
import { useModalStore } from '~/admin/stores/modal';
const modal = useModalStore();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modal.isOpen"
        class="fixed inset-0 z-[98] bg-black/50 backdrop-blur-sm"
        @click="modal.close()"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="modal.isOpen"
        class="pointer-events-none fixed inset-0 z-[99] flex items-center justify-center"
      >
        <div class="pointer-events-auto min-w-[400px] rounded-xl bg-white p-6 shadow-2xl">
          <component :is="modal.component" v-bind="modal.props" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
