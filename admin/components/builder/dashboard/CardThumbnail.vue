<template>
  <div
    class="flex aspect-[9/16] w-[100px] flex-col overflow-hidden rounded-[10px] bg-white shadow-lg ring-1 shadow-slate-300/50 ring-slate-900/5 transition-all duration-500 ease-out group-hover:scale-110 dark:bg-neutral-900 dark:shadow-none dark:ring-white/5"
  >
    <div
      class="flex h-10 shrink-0 items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20"
    >
      <div class="h-4 w-4 rounded bg-indigo-400/40 dark:bg-indigo-400/60"></div>
    </div>

    <div class="flex h-full flex-col p-2.5">
      <div class="mb-2 h-2 w-3/4 rounded-full bg-slate-300 dark:bg-neutral-700"></div>

      <div class="mb-auto space-y-1.5">
        <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-neutral-800"></div>
        <div class="h-1.5 w-5/6 rounded-full bg-slate-200 dark:bg-neutral-800"></div>
        <div class="h-1.5 w-4/5 rounded-full bg-slate-200 dark:bg-neutral-800"></div>
      </div>

      <div class="mt-2 space-y-1.5">
        <div
          class="h-3.5 w-full rounded-lg border border-slate-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950"
        ></div>
        <div class="h-3.5 w-full rounded-lg bg-indigo-500/80 dark:bg-indigo-600"></div>
      </div>
    </div>
  </div>
</template>
