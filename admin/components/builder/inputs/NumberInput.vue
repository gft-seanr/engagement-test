<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    unit?: string; // e.g. "px", "%", "rem"
  }>(),
  {
    modelValue: 0,
    step: 1,
    min: -Infinity,
    max: Infinity,
    unit: 'px',
  }
);

const isFocused = ref(false);

const inputRef = useTemplateRef<HTMLInputElement | null>('inputRef');

const propsModel = defineModel<string | number>('props', {
  type: [String, Number],
  default: 0,
});

const editingValue = ref<string>(propsModel.value?.toString() ?? '');

function updateValue(val: string | number) {
  let raw = val.toString().trim();

  raw = raw.replace(',', '.');

  let num = parseFloat(raw);

  if (isNaN(num)) return;

  if (num < props.min) num = props.min;
  if (num > props.max) num = props.max;

  const precision = props.step?.toString().split('.')[1]?.length || 0;
  num = parseFloat(num.toFixed(precision));

  propsModel.value = num;

  editingValue.value = String(num);
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;

  editingValue.value = target.value;
}

function handleFocus(e: FocusEvent) {
  isFocused.value = true;
  (e.target as HTMLInputElement).select();

  editingValue.value = propsModel.value?.toString() ?? '';
}

function handleBlur(e: FocusEvent) {
  isFocused.value = false;

  finalizeValue();
}

function finalizeValue() {
  const raw = editingValue.value.trim();
  if (raw === '') {
    editingValue.value = propsModel.value?.toString() ?? '';
    return;
  }
  updateValue(raw);
}

function handleKeyDown(e: KeyboardEvent) {
  if (props.disabled) return;

  const multiplier = e.shiftKey ? 10 : 1; // Shift+Arrow = 10x step

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const base = Number(propsModel.value) || 0;
    updateValue(base + (props.step || 1) * multiplier);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    const base = Number(propsModel.value) || 0;
    updateValue(base - (props.step || 1) * multiplier);
  } else if (e.key === 'Enter') {
    finalizeValue();
  } else if (e.key === 'Escape') {
    editingValue.value = propsModel.value?.toString() ?? '';
  }
}

// keep buffer in sync if external model changes
watch(
  () => propsModel.value,
  (nv) => {
    if (!isFocused.value) editingValue.value = nv?.toString() ?? '';
  }
);
</script>

<template>
  <div class="relative flex w-full items-center rounded transition-all">
    <input
      v-model="propsModel"
      ref="inputRef"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      class="w-full rounded-lg bg-gray-100 p-2 text-xs text-neutral-900 focus:outline focus:outline-purple-500 dark:bg-neutral-800 dark:text-neutral-100"
    />

    <span
      v-if="unit"
      class="pointer-events-none absolute right-2 text-[9px] font-medium text-neutral-400 select-none"
    >
      {{ unit }}
    </span>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
