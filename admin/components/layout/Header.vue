<script setup lang="ts">
interface BreadCrumb {
  label: string;
  to?: string;
}

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: BreadCrumb[];
  }
}

const { title } = useBuilderTitle();

const route = useRoute();
const breadcrumbs = computed<BreadCrumb[]>(() => route.meta.breadcrumbs || []);
</script>
<template>
  <header
    class="sticky top-0 h-[var(--header-height)] border-b border-neutral-300 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div class="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center px-6 md:px-8">
      <nav aria-label="Breadcrumb" class="flex justify-start">
        <ol class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2.5">
            <span v-if="index !== 0" class="text-sm text-gray-300 dark:text-gray-700">/</span>

            <NuxtLink
              v-if="crumb.to"
              :to="{ name: crumb.to }"
              class="transition-colors hover:text-purple-600 dark:hover:text-purple-400"
            >
              {{ crumb.label }}
            </NuxtLink>

            <span v-else class="font-semibold text-gray-900 dark:text-gray-100">
              {{ crumb.label }}
            </span>
          </li>
        </ol>
      </nav>

      <div class="flex justify-center">
        <h1 class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h1>
      </div>

      <div id="actions" class="flex justify-end"></div>
    </div>
  </header>
</template>
