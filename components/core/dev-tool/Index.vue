<script setup lang="ts">
import { ChevronRight, ArrowLeftRight } from 'lucide-vue-next';

const devToolPosition = ref('right');
const showDevTool = ref(false);

const toggleDevlToolPosition = () => {
  devToolPosition.value = devToolPosition.value === 'right' ? 'left' : 'right';
};

const toggleDevTool = () => {
  showDevTool.value = !showDevTool.value;
};
</script>

<template>
  <div class="pointer-events-none fixed top-0 left-0 z-[100] h-screen w-full">
    <div
      :style="
        devToolPosition === 'right'
          ? {
              right: '16px',
              transform: `translate(${showDevTool ? 0 : 'calc(100% + 16px)'}, -50%)`,
            }
          : {
              left: '16px',
              transform: `translate(${showDevTool ? 0 : 'calc(-100% - 16px)'}, -50%)`,
            }
      "
      class="pointer-events-auto absolute top-1/2 flex h-full flex-col rounded-md border border-border bg-white transition-all ease-in-out"
    >
      <div
        @click="toggleDevTool"
        class="fixed top-1/2 cursor-pointer rounded-md border border-border bg-white px-1 py-2 transition-all ease-in-out"
        :style="
          devToolPosition === 'right'
            ? { left: '0', transform: 'translate(-100%, -50%)' }
            : { right: '0', transform: 'translate(100%, -50%)' }
        "
      >
        <ChevronRight
          :size="20"
          class="transition-all ease-in-out"
          :style="
            devToolPosition === 'right'
              ? {
                  transform: `rotate(${showDevTool ? 0 : 180}deg)`,
                }
              : {
                  transform: `rotate(${showDevTool ? 180 : 0}deg)`,
                }
          "
        />
      </div>
      <div
        @click="toggleDevlToolPosition"
        class="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full cursor-pointer rounded-md border border-border bg-white px-2 py-1"
      >
        <ArrowLeftRight :size="20" />
      </div>

      <div class="flex h-full flex-col gap-4 overflow-y-scroll p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
