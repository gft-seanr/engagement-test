<script setup lang="ts">
import { reactive, watch, ref, nextTick } from 'vue';
import { useEventListener } from '@vueuse/core';

interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<Spacing>;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    modelValue: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    min: -9999,
    max: 9999,
    step: 1,
  }
);

const emit = defineEmits(['update-spacing']);

const localValues = reactive<Spacing>({
  top: props.modelValue.top ?? 0,
  right: props.modelValue.right ?? 0,
  bottom: props.modelValue.bottom ?? 0,
  left: props.modelValue.left ?? 0,
});

const isLinked = ref(false);
const isDragging = ref(false);
const activeSide = ref<'top' | 'right' | 'bottom' | 'left' | 'all' | null>(null);

// --- NEW: Edit Mode State ---
const editingSide = ref<'top' | 'right' | 'bottom' | 'left' | null>(null);
const inputRefs = ref<Record<string, HTMLInputElement | null>>({
  top: null,
  right: null,
  bottom: null,
  left: null,
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (isDragging.value) return;
    localValues.top = newVal.top ?? 0;
    localValues.right = newVal.right ?? 0;
    localValues.bottom = newVal.bottom ?? 0;
    localValues.left = newVal.left ?? 0;
  },
  { deep: true }
);

const formatValue = (val: number) => {
  const clamped = Math.max(props.min, Math.min(props.max, val));
  return Math.round(clamped / props.step) * props.step;
};

const flush = () => {
  const formatted = {
    top: formatValue(localValues.top),
    right: formatValue(localValues.right),
    bottom: formatValue(localValues.bottom),
    left: formatValue(localValues.left),
  };
  localValues.top = formatted.top;
  localValues.right = formatted.right;
  localValues.bottom = formatted.bottom;
  localValues.left = formatted.left;
  emit('update-spacing', { ...formatted });
};

let startY = 0;
let startX = 0;
let initialValues: Spacing = { top: 0, right: 0, bottom: 0, left: 0 };
let activePointerTarget: HTMLElement | null = null;
let activePointerId: number | null = null;
let stopMoveListener: (() => void) | null = null;
let stopUpListener: (() => void) | null = null;

const startScrub = (e: PointerEvent, side: 'top' | 'right' | 'bottom' | 'left' | 'all') => {
  if (e.button !== 0 || editingSide.value === side) return;

  activePointerTarget = e.currentTarget as HTMLElement;
  activePointerId = e.pointerId;
  try {
    activePointerTarget?.setPointerCapture?.(e.pointerId);
  } catch (err) {}
  e.preventDefault();

  isDragging.value = true;
  activeSide.value = side;
  startY = e.clientY;
  startX = e.clientX;

  initialValues = { ...localValues };

  stopMoveListener = useEventListener(window, 'pointermove', onScrub, { passive: false });
  stopUpListener = useEventListener(window, 'pointerup', stopScrub);
};

const onKeydown = (e: KeyboardEvent) => {
  const isInput = ['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase());
  if (isInput) return;

  // Each arrow key maps to the side it pushes outward.
  // Ctrl/Cmd reverses the direction (decreases that side).
  const keyMap: Record<string, keyof Spacing> = {
    ArrowUp: 'top',
    ArrowRight: 'right',
    ArrowDown: 'bottom',
    ArrowLeft: 'left',
  };

  const targetSide = keyMap[e.key];
  if (!targetSide) return;

  e.preventDefault();

  const amount = e.shiftKey ? 10 : 1;
  const delta = e.ctrlKey || e.metaKey ? -amount : +amount;

  const applyDelta = (currentVal: number) => formatValue(currentVal + delta);

  if (isLinked.value) {
    localValues.top = applyDelta(localValues.top);
    localValues.right = applyDelta(localValues.right);
    localValues.bottom = applyDelta(localValues.bottom);
    localValues.left = applyDelta(localValues.left);
  } else {
    localValues[targetSide] = applyDelta(localValues[targetSide]);
    if (e.altKey) {
      const mirrorMap: Record<keyof Spacing, keyof Spacing> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      };
      const mirrorSide = mirrorMap[targetSide];
      localValues[mirrorSide] = applyDelta(localValues[mirrorSide]);
    }
  }

  flush();
};

const onScrub = (e: PointerEvent) => {
  if (!activeSide.value) return;

  let delta = 0;
  const sensitivity = e.shiftKey ? 10 : 1;

  if (activeSide.value === 'left') {
    delta = (startX - e.clientX) * sensitivity;
  } else if (activeSide.value === 'right') {
    delta = (e.clientX - startX) * sensitivity;
  } else if (activeSide.value === 'top') {
    delta = (startY - e.clientY) * sensitivity;
  } else if (activeSide.value === 'bottom') {
    delta = (e.clientY - startY) * sensitivity;
  } else {
    delta = (startY - e.clientY) * sensitivity;
  }

  const side = activeSide.value;
  const snap = props.step ?? 1;

  const applySnapped = (raw: number) => {
    const snapped = Math.round(raw / snap) * snap;
    return formatValue(snapped);
  };

  if (isLinked.value || side === 'all') {
    const raw = initialValues.top + delta;
    const newVal = applySnapped(raw);
    if (
      newVal !== localValues.top ||
      newVal !== localValues.right ||
      newVal !== localValues.bottom ||
      newVal !== localValues.left
    ) {
      localValues.top = newVal;
      localValues.right = newVal;
      localValues.bottom = newVal;
      localValues.left = newVal;
      flush();
    }
  } else if (e.altKey) {
    const raw = initialValues[side] + delta;
    const newVal = applySnapped(raw);
    const mirrorMap: Record<string, keyof Spacing> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const mirrorSide = mirrorMap[side];
    const rawMirror = initialValues[mirrorSide] + delta;
    const newMirrorVal = applySnapped(rawMirror);

    if (newVal !== localValues[side] || newMirrorVal !== localValues[mirrorSide]) {
      localValues[side] = newVal;
      localValues[mirrorSide] = newMirrorVal;
      flush();
    }
  } else {
    const raw = initialValues[side] + delta;
    const newVal = applySnapped(raw);
    if (newVal !== localValues[side]) {
      localValues[side] = newVal;
      flush();
    }
  }
};

const stopScrub = () => {
  isDragging.value = false;
  activeSide.value = null;

  stopMoveListener?.();
  stopUpListener?.();
  stopMoveListener = null;
  stopUpListener = null;

  try {
    activePointerTarget?.releasePointerCapture?.(activePointerId as number);
  } catch (err) {}
  activePointerTarget = null;
  activePointerId = null;
};

// --- NEW: Double-Click Edit Logic ---
const startEdit = async (side: 'top' | 'right' | 'bottom' | 'left') => {
  editingSide.value = side;
  activeSide.value = side;
  await nextTick();
  const el = inputRefs.value[side];
  if (el) {
    el.focus();
    el.select(); // Highlight the text so typing instantly overrides it
  }
};

const stopEdit = (side: keyof Spacing, e: Event) => {
  if (editingSide.value !== side) return;

  const val = parseFloat((e.target as HTMLInputElement).value);
  if (!isNaN(val)) {
    const formatted = formatValue(val);
    if (isLinked.value) {
      localValues.top = formatted;
      localValues.right = formatted;
      localValues.bottom = formatted;
      localValues.left = formatted;
    } else {
      localValues[side] = formatted;
    }
    flush();
  }

  editingSide.value = null;
  activeSide.value = null;
};

const toggleLink = () => {
  isLinked.value = !isLinked.value;
  if (isLinked.value) {
    const v = localValues.top;
    localValues.right = v;
    localValues.bottom = v;
    localValues.left = v;
    flush();
  }
};

useEventListener(window, 'keydown', onKeydown);
</script>

<template>
  <div class="flex flex-col gap-2 text-xs select-none">
    <div
      class="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 p-6 dark:bg-neutral-900/50"
    >
      <div
        class="relative z-10 flex w-3/4 items-center justify-center overflow-hidden rounded-sm bg-white transition-colors dark:bg-neutral-800"
        :class="{ 'rounded-lg border border-purple-400 shadow-sm': isDragging }"
      >
        <button
          @click="toggleLink"
          class="flex h-8 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-sm text-neutral-400 hover:text-neutral-700 focus:outline-none dark:text-neutral-500 dark:hover:text-neutral-300"
          :class="{ '!bg-purple-50 !text-purple-600': isLinked }"
          title="Toggle Uniform Spacing"
        >
          <Icon v-if="isLinked" name="lucide:link" class="h-4 w-4" />
          <Icon v-else name="lucide:unlink" class="h-4 w-4" />
        </button>
      </div>

      <div
        class="absolute top-2 left-1/2 flex h-6 w-12 -translate-x-1/2 items-center justify-center"
      >
        <input
          v-if="editingSide === 'top'"
          :ref="(el) => (inputRefs.top = el as HTMLInputElement)"
          type="text"
          class="input-clean"
          :value="localValues.top"
          @blur="stopEdit('top', $event)"
          @keydown.enter="stopEdit('top', $event)"
          @keydown.esc="editingSide = null"
        />
        <div
          v-else
          class="t4x flex h-full w-full cursor-ns-resize items-center justify-center rounded text-xs font-medium text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
          :class="{
            'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100':
              activeSide === 'top' && isDragging,
          }"
          @pointerdown="startScrub($event, 'top')"
          @dblclick="startEdit('top')"
        >
          {{ `${localValues.top}px` }}
        </div>
      </div>

      <div
        class="absolute bottom-2 left-1/2 flex h-6 w-12 -translate-x-1/2 items-center justify-center"
      >
        <input
          v-if="editingSide === 'bottom'"
          :ref="(el) => (inputRefs.bottom = el as HTMLInputElement)"
          type="text"
          class="input-clean"
          :value="localValues.bottom"
          @blur="stopEdit('bottom', $event)"
          @keydown.enter="stopEdit('bottom', $event)"
          @keydown.esc="editingSide = null"
        />
        <div
          v-else
          class="flex h-full w-full cursor-ns-resize items-center justify-center rounded text-xs font-medium text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
          :class="{
            'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100':
              activeSide === 'bottom' && isDragging,
          }"
          @pointerdown="startScrub($event, 'bottom')"
          @dblclick="startEdit('bottom')"
        >
          {{ `${localValues.bottom}px` }}
        </div>
      </div>

      <div
        class="absolute top-1/2 left-2 flex h-6 w-12 -translate-y-1/2 items-center justify-center"
      >
        <input
          v-if="editingSide === 'left'"
          :ref="(el) => (inputRefs.left = el as HTMLInputElement)"
          type="text"
          class="input-clean"
          :value="localValues.left"
          @blur="stopEdit('left', $event)"
          @keydown.enter="stopEdit('left', $event)"
          @keydown.esc="editingSide = null"
        />
        <div
          v-else
          class="flex h-full w-full cursor-ew-resize items-center justify-center rounded text-xs font-medium text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
          :class="{
            'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100':
              activeSide === 'left' && isDragging,
          }"
          @pointerdown="startScrub($event, 'left')"
          @dblclick="startEdit('left')"
        >
          {{ `${localValues.left}px` }}
        </div>
      </div>

      <div
        class="absolute top-1/2 right-2 flex h-6 w-12 -translate-y-1/2 items-center justify-center"
      >
        <input
          v-if="editingSide === 'right'"
          :ref="(el) => (inputRefs.right = el as HTMLInputElement)"
          type="text"
          class="input-clean"
          :value="localValues.right"
          @blur="stopEdit('right', $event)"
          @keydown.enter="stopEdit('right', $event)"
          @keydown.esc="editingSide = null"
        />
        <div
          v-else
          class="flex h-full w-full cursor-ew-resize items-center justify-center rounded text-xs font-medium text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
          :class="{
            'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100':
              activeSide === 'right' && isDragging,
          }"
          @pointerdown="startScrub($event, 'right')"
          @dblclick="startEdit('right')"
        >
          {{ `${localValues.right}px` }}
        </div>
      </div>

      <div
        v-if="activeSide === 'top' || isLinked"
        class="pointer-events-none absolute top-0 right-0 left-0 h-8 border-b border-purple-500/20 bg-purple-500/5 transition-all"
      />
      <div
        v-if="activeSide === 'bottom' || isLinked"
        class="pointer-events-none absolute right-0 bottom-0 left-0 h-8 border-t border-purple-500/20 bg-purple-500/5 transition-all"
      />
      <div
        v-if="activeSide === 'left' || isLinked"
        class="pointer-events-none absolute top-0 bottom-0 left-0 w-14 border-r border-purple-500/20 bg-purple-500/5 transition-all"
      />
      <div
        v-if="activeSide === 'right' || isLinked"
        class="pointer-events-none absolute top-0 right-0 bottom-0 w-14 border-l border-purple-500/20 bg-purple-500/5 transition-all"
      />
    </div>

    <div class="flex justify-between px-1 text-[10px] text-neutral-400">
      <span>Drag or double-click to edit</span>
      <div class="flex gap-2">
        <span><kbd class="font-sans font-bold">⌃</kbd> Decrease</span>
        <span><kbd class="font-sans font-bold">⌥</kbd> Mirror</span>
        <span><kbd class="font-sans font-bold">⇧</kbd> Fast</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '../../../../assets/styles/main.css';

.input-clean {
  @apply absolute inset-0 z-20 h-full w-full rounded border-transparent bg-white text-center text-sm font-semibold text-neutral-900 shadow ring-1 ring-purple-400 focus:outline-none;
}
</style>
