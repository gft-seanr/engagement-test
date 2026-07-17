<template>
  <div class="gap- flex w-[60%] flex-col rounded-lg bg-white p-2.5 shadow-sm dark:bg-neutral-900">
    <div class="flex w-full justify-between gap-0.5">
      <div
        v-for="n in 5"
        :key="n"
        class="size-3 rounded border border-slate-200 bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800"
      ></div>
    </div>

    <div class="mt-2 h-4 w-full rounded-[4px] bg-purple-500/90 shadow-sm"></div>
  </div>
</template>
