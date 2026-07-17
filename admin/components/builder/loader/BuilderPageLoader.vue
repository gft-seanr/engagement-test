<script setup lang="ts">
import LogoLoader from '../../shared/LogoLoader.vue';
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFAFA] transition-colors duration-300 dark:bg-neutral-950"
  >
    <div class="animate-float flex flex-col items-center gap-7">
      <div class="relative flex items-center justify-center">
        <div
          class="absolute inset-0 scale-150 rounded-full bg-[#A263F0] opacity-10 blur-xl filter dark:opacity-20"
        ></div>

        <LogoLoader class="relative z-10 size-14 text-[#A263F0]" />
      </div>

      <div class="flex flex-col items-center gap-3">
        <span
          class="text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-neutral-500"
        >
          Preparing Workspace
        </span>

        <div
          class="h-[3px] w-48 overflow-hidden rounded-full bg-gray-200/70 shadow-inner dark:bg-neutral-800"
        >
          <div
            class="animate-slide h-full w-1/3 rounded-full bg-gradient-to-r from-[#A263F0]/80 via-[#A263F0] to-[#A263F0]/80 shadow-[0_0_8px_rgba(162,99,240,0.4)]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-slide {
  animation: slide 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes slide {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(350%);
  }
}
</style>
