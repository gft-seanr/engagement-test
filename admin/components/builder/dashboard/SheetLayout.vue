<script setup lang="ts">
import { motion } from 'motion-v';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();
</script>

<template>
  <Teleport to="body">
    <client-only>
      <animate-presence>
        <motion.div
          v-if="props.open"
          key="modal-backdrop"
          class="fixed inset-0 z-50"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.25 }"
        >
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="emit('close')" />
        </motion.div>

        <motion.aside
          v-if="props.open"
          key="modal-panel"
          class="fixed inset-y-0 right-0 z-50 flex max-w-full pl-4"
          :initial="{ x: '100%' }"
          :animate="{ x: '0%' }"
          :exit="{ x: '100%' }"
          :transition="{
            duration: 0.32,
            ease: [0.4, 0, 0.2, 1],
          }"
        >
          <div
            class="m-4 w-full max-w-full overflow-hidden rounded-2xl bg-white text-left shadow-2xl md:w-[45vw]"
            @click.stop
          >
            <slot />
          </div>
        </motion.aside>
      </animate-presence>
    </client-only>
  </Teleport>
</template>
