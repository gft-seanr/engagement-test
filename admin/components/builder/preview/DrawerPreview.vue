<template>
  <div class="relative flex h-[100px] w-full overflow-hidden">
    <div
      class="absolute top-0 left-1/2 flex w-[75%] -translate-x-1/2 transform flex-col gap-3 rounded-xl border border-neutral-200/60 bg-white p-3 shadow-xl shadow-neutral-300/40 dark:border-neutral-700/60 dark:bg-neutral-900 dark:shadow-neutral-950/40"
    >
      <div class="flex items-center justify-between">
        <div class="h-2.5 w-1/2 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
        <div class="size-4 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800"></div>
      </div>

      <div class="flex flex-1 flex-col gap-2">
        <div class="space-y-1.5">
          <div class="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
          <div class="h-1.5 w-5/6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
          <div class="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
        </div>

        <div
          class="mt-1 h-12 w-full rounded-md border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
        ></div>
      </div>

      <div class="mt-auto">
        <div class="h-6 w-full rounded-[4px] bg-indigo-500/90"></div>
      </div>
    </div>
  </div>
</template>
