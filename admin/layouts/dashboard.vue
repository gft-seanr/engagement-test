<script setup lang="ts">
import ModalProvider from '~admin/components/shared/ModalProvider.vue';
import { Button } from '@/components/shadcn-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useBuilderTitle } from '../composables/builder/useBuilderTitle';

interface BreadCrumb {
  label: string;
  to?: string;
}

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: BreadCrumb[];
  }
}

const breadcrumbs = computed<BreadCrumb[]>(() => {
  return route.meta.breadcrumbs || [];
});
const route = useRoute();
const { title } = useBuilderTitle();
const campaign = useCampaignState();

const handleLogoutSuccess = () => {
  if (useCookie('loginData').value) {
    deleteCookie('loginData');
    deleteCookie('loginOTPData');
  }
  navigateTo(`/admin/${campaign.value.id}/login`);
};

const { handleLogout } = useLogoutMutation(handleLogoutSuccess);
</script>

<template>
  <div class="min-h-dvh bg-gray-50 antialiased">
    <ModalProvider />

    <!-- Simple Navbar -->
    <header class="sticky top-0 z-50 border-b border-gray-300 bg-white">
      <div class="flex h-16 items-center justify-between px-6 md:px-8">
        <!-- Logo -->
        <nuxt-link
          to="/admin"
          class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          aria-label="Go to Dashboard"
        >
          <svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-6">
            <rect
              x="1.25714"
              y="9.4856"
              width="24.9143"
              height="8.22857"
              fill="currentColor"
              class="text-white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.149477 0.748813C0 1.04218 0 1.42621 0 2.19429L3.94515e-05 30.7119C4.12115e-05 31.8927 0.911681 32.4614 2.74155 31.5483C4.57143 30.6353 12.6857 26.7146 13.0286 26.5529C13.3714 26.3912 13.4857 26.3723 13.7143 26.3723C13.9429 26.3723 14.0571 26.3912 14.4 26.5529C14.7429 26.7146 22.8571 30.6353 24.687 31.5483C26.5169 32.4614 27.4285 31.8927 27.4285 30.7119L27.4286 2.19429C27.4286 1.42621 27.4286 1.04218 27.2791 0.748813C27.1476 0.490762 26.9378 0.28096 26.6798 0.149477C26.3864 0 26.0024 0 25.2343 0H13.7143H2.19429C1.42621 0 1.04218 0 0.748813 0.149477C0.490762 0.28096 0.28096 0.490762 0.149477 0.748813ZM21.193 10.8571C17.2522 14.6628 10.1889 14.6628 6.24809 10.8571L4.20572 12.9721C9.28588 17.8779 18.1553 17.8779 23.2354 12.9721L21.193 10.8571Z"
              fill="#A263F0"
            />
          </svg>
        </nuxt-link>

        <!-- Breadcrumbs and Title -->
        <div class="flex flex-1 items-center justify-center gap-8">
          <nav aria-label="Breadcrumb" class="flex">
            <ol class="flex items-center gap-2 text-sm text-gray-500">
              <li
                v-for="(crumb, index) in breadcrumbs"
                :key="index"
                class="flex items-center gap-2.5"
              >
                <span v-if="index !== 0" class="text-sm text-gray-300">/</span>

                <NuxtLink
                  v-if="crumb.to"
                  :to="crumb.to"
                  class="transition-colors hover:text-purple-600"
                >
                  {{ crumb.label }}
                </NuxtLink>

                <span v-else class="font-semibold text-gray-900">
                  {{ crumb.label }}
                </span>
              </li>
            </ol>
          </nav>

          <h1 v-if="title" class="text-sm font-bold text-gray-900">
            {{ title }}
          </h1>
        </div>

        <!-- User Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              class="gap-2 !text-black hover:!bg-neutral-100"
              aria-label="User menu"
            >
              <div class="flex size-8 items-center justify-center rounded-full bg-purple-100">
                <Icon name="lucide:user" :size="16" class="text-purple-600" />
              </div>
              <Icon
                name="lucide:chevron-down"
                :size="16"
                class="transition-transform duration-200"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" class="w-48 border-neutral-200 bg-neutral-50">
            <DropdownMenuItem
              class="cursor-pointer !text-black hover:!bg-neutral-200"
              @click="handleLogout"
            >
              <Icon name="lucide:log-out" :size="16" class="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100dvh-4rem)] overflow-auto">
      <slot />
    </main>
    <VueQueryDevtools />
  </div>
</template>
