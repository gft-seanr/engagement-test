<template>
  <div class="flex w-[65%] flex-col gap-2 rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900">
    <div class="flex w-full items-center justify-center gap-1">
      <div
        v-for="n in 6"
        :key="n"
        class="size-4 rounded-sm bg-neutral-200 dark:bg-neutral-700"
      ></div>
    </div>

    <div class="mt-2 h-5 w-full rounded-2xl bg-purple-200 dark:bg-purple-900/50"></div>
  </div>
</template>
