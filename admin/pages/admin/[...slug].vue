<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8"
  >
    <div class="mx-auto flex max-w-lg flex-col items-center text-center">
      <div
        class="mb-6 flex size-20 items-center justify-center rounded-full bg-purple-100 shadow-sm ring-1 ring-purple-200"
      >
        <Icon name="lucide:map-pin-off" size="20" class="text-purple-600" />
      </div>

      <p class="text-base leading-8 font-semibold text-purple-600">404</p>
      <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Page Not Found
      </h1>

      <div class="mt-8 w-full rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 class="font-semibold text-gray-900">Why are you seeing this?</h2>
        <ul class="mt-4 space-y-3 text-sm text-gray-600">
          <li class="flex gap-3">
            <Icon name="lucide:info" class="size-5 shrink-0 text-purple-500" />
            <span
              ><strong>Invalid Campaign ID:</strong> The <code>campaign id</code> entered in the URL
              might be incomplete.</span
            >
          </li>

          <li class="flex gap-3">
            <Icon name="lucide:info" class="size-5 shrink-0 text-purple-500" />
            <span
              ><strong>Typo in URL:</strong> Please double-check the web address for any typing
              errors.</span
            >
          </li>
        </ul>
      </div>

      <div class="mt-10 flex items-center justify-center">
        <button
          @click="goBack"
          class="flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-500 active:scale-95"
        >
          <Icon name="lucide:arrow-left" class="size-4" />
          Return to Previous Page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

function goBack() {
  router.back();
}
</script>
