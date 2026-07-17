<script setup lang="ts">
const attrsModel = defineModel<Record<string, any>>('attrs', { default: () => ({}) });

const createAttrProxy = (key: string) =>
  computed({
    get: () => attrsModel.value?.[key] ?? '',
    set: (val) => {
      const newAttrs = { ...attrsModel.value };

      if (val === '' || val === null || val === undefined) {
        delete newAttrs[key];
      } else {
        newAttrs[key] = val;
      }

      attrsModel.value = newAttrs;
    },
  });

const widthProxy = createAttrProxy('width');
const heightProxy = createAttrProxy('height');
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-3">
    <div class="flex items-center gap-2">
      <label
        for="width-input"
        class="cursor-pointer text-xs font-semibold text-neutral-900 select-none dark:text-neutral-100"
      >
        Width
      </label>

      <div class="relative flex-1">
        <input
          v-model="widthProxy"
          id="width-input"
          type="text"
          placeholder="212"
          class="h-8 w-full rounded-md border border-neutral-200 bg-gray-50 pr-6 pl-2 text-xs font-medium text-neutral-900 shadow-sm transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
        <span
          class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 select-none dark:text-neutral-500"
        >
          px
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <label
        for="height-input"
        class="cursor-pointer text-xs font-semibold text-neutral-900 select-none dark:text-neutral-100"
      >
        Height
      </label>

      <div class="relative flex-1">
        <input
          v-model="heightProxy"
          id="height-input"
          type="text"
          placeholder="400"
          class="h-8 w-full rounded-md border border-neutral-200 bg-gray-50 pr-6 pl-2 text-xs font-medium text-neutral-900 shadow-sm transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
        <span
          class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 select-none dark:text-neutral-500"
        >
          px
        </span>
      </div>
    </div>
  </div>
</template>
