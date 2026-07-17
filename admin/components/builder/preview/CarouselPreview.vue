<template>
  <div class="justify-cemter flex h-full w-full items-center gap-2 overflow-hidden">
    <div
      v-for="n in 3"
      :key="n"
      class="flex min-w-[65%] flex-col gap-2 rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900"
    >
      <div class="flex items-center gap-1">
        <div class="flex w-full flex-col gap-1">
          <div class="h-2 w-2/4 rounded-2xl bg-purple-200 dark:bg-purple-900/50"></div>
          <div class="h-1.5 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>
  </div>
</template>
