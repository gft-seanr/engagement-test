<script setup lang="ts">
import clsx from 'clsx';
import { useComponentProperties } from '~/admin/composables/builder/useComponentProperties';

const props = defineProps<{
  section: any;
  isSelected: boolean;
}>();

const { definitions } = useComponentProperties();

const emit = defineEmits(['select']);
</script>

<template>
  <div
    :class="
      clsx('wrapper-item w-full overflow-hidden', {
        'is-selected': isSelected,
      })
    "
    @click.stop="emit('select')"
  >
    <slot />
  </div>
</template>

<style scoped>
.wrapper-item:hover,
.wrapper-item.is-selected {
  outline: 2px solid #a855f7 !important;
  outline-offset: -2px;
}
</style>
