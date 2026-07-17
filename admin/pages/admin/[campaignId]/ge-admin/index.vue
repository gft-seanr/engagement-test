<script setup lang="ts">
import { useRouter } from 'vue-router';
import GaLogo from '~/admin/components/shared/GaLogo.vue';
import { useAdminCarousel } from '~/admin/composables/builder/useAdminCarousel';

definePageMeta({
  name: 'ge-admin-home',
  middleware: ['admin', 'entry'],
});

const router = useRouter();
const appConfig = useAppConfig();
const campaigns = appConfig.engagementAdmin.campaigns;

const adminAppStore = useAdminAppStore();
const { currentCampaignId } = storeToRefs(adminAppStore);

const authStore = useAuthStore();
const { loginData } = storeToRefs(authStore);

const projects = computed(() => {
  return campaigns
    .filter((campaign) => campaign.name === 'Engagement Admin' && campaign.projects)
    .flatMap((campaign) => {
      return campaign.projects.map((project) => {
        return {
          ...project,
          to: project.to ? project.to.replace('{{id}}', campaign.id) : '',
        };
      });
    });
});

const user = computed(() => {
  return loginData.value?.email?.split('@')[0] || 'User';
});

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

const { activeIndex, handleCardClick, handleNavigate } = useAdminCarousel(projects.value, router);

const viewMode = ref<'carousel' | 'grid'>('carousel');

function handleLogoutSuccess() {
  if (useCookie('loginData').value) {
    deleteCookie('loginData');
    deleteCookie('loginOTPData');
  }
  navigateTo(`/admin/${currentCampaignId.value}/login`);
}

const { handleLogout } = useLogoutMutation(handleLogoutSuccess);
</script>

<template>
  <div
    class="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white p-6 antialiased dark:bg-neutral-950"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 right-1/4 size-96 -translate-y-1/2 rounded-full bg-purple-400/5 blur-3xl dark:bg-purple-500/10"
      ></div>
      <div
        class="absolute bottom-0 left-1/4 size-96 translate-y-1/2 rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-500/10"
      ></div>
    </div>

    <header class="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-8 py-6">
      <div class="flex items-center gap-3">
        <div class="flex size-10 items-center justify-center rounded-xl">
          <GaLogo class="size-8 shrink-0 text-white" />
        </div>

        <div class="flex flex-col justify-center">
          <span
            class="font-heading text-sm leading-none font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Giftaway Engagement
          </span>
          <span
            class="mt-1 text-[10px] leading-none font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400"
          >
            Admin Portal
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="handleLogout"
          class="group flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white/80 px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-neutral-300 hover:bg-white hover:text-neutral-900 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 active:scale-[0.97] dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white"
        >
          <span>Sign out</span>
          <Icon
            name="lucide:log-out"
            size="14"
            class="text-neutral-400 transition-colors duration-200 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-white"
          />
        </button>
      </div>
    </header>

    <div class="relative z-10 flex w-full max-w-6xl flex-col gap-8">
      <div class="flex flex-col items-center text-center">
        <h1
          class="font-heading text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl dark:text-white"
        >
          {{ timeGreeting }},
          <span
            class="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-500"
          >
            Admin
          </span>
        </h1>

        <p class="mt-4 max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          Welcome to the Engagement Admin Portal. Select a project below to start.
        </p>

        <div
          class="mt-8 flex items-center justify-center gap-1 rounded-xl border border-neutral-200/60 bg-white/60 p-1 shadow-sm backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/60"
        >
          <button
            @click="viewMode = 'carousel'"
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
            :class="
              viewMode === 'carousel'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-sm shadow-purple-500/30'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
            "
          >
            <Icon name="lucide:gallery-horizontal" size="16" />
            <span>Carousel</span>
          </button>
          <button
            @click="viewMode = 'grid'"
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
            :class="
              viewMode === 'grid'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-sm shadow-purple-500/30'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
            "
          >
            <Icon name="lucide:grid-2x2" size="16" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      <Transition
        name="view-fade"
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="viewMode === 'carousel'"
          key="carousel"
          class="relative flex h-[400px] w-full items-center justify-center"
        >
          <div class="relative flex w-full items-center justify-center">
            <div
              v-for="(project, index) in projects"
              :key="project.id"
              class="absolute flex flex-col items-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              :style="{
                transform: `translateX(${(index - activeIndex) * 280}px) scale(${index === activeIndex ? 1 : 0.75})`,
                zIndex: index === activeIndex ? 10 : 1,
                opacity: Math.abs(index - activeIndex) > 1 ? 0 : 1,
              }"
            >
              <div
                @click.stop="handleCardClick(index)"
                class="group relative flex w-[280px] cursor-pointer flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-300 ease-out dark:bg-neutral-900"
                :class="
                  index === activeIndex
                    ? 'border-purple-500 shadow-[0_8px_24px_rgba(147,51,234,0.12)] ring-1 ring-purple-500'
                    : 'border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-neutral-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:hover:border-neutral-700'
                "
              >
                <div
                  class="relative h-40 w-full overflow-hidden border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <img
                    :src="
                      project.thumbnail || 'https://placehold.co/384x160/F3F4F6/9CA3AF?text=Project'
                    "
                    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    alt="project thumbnail"
                  />

                  <div
                    v-if="index === activeIndex"
                    class="absolute inset-0 flex items-center justify-center bg-white/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 dark:bg-neutral-950/30"
                  >
                    <button
                      @click.stop="handleNavigate(project.to)"
                      class="flex items-center gap-1.5 rounded-lg bg-white/95 px-4 py-2 text-[12px] font-semibold text-purple-700 shadow-sm ring-1 ring-neutral-200/50 transition-all hover:scale-105 hover:bg-white hover:shadow-md active:scale-95 dark:bg-neutral-900/95 dark:text-purple-400 dark:ring-neutral-700/50 dark:hover:bg-neutral-900"
                    >
                      Launch
                      <Icon name="lucide:arrow-right" size="14" />
                    </button>
                  </div>
                </div>

                <div class="flex flex-col p-4">
                  <div class="flex items-start justify-between gap-2">
                    <h3
                      class="truncate text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-white"
                    >
                      {{ project.name }}
                    </h3>

                    <Icon
                      name="lucide:arrow-up-right"
                      class="shrink-0 text-neutral-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple-500 dark:text-neutral-600 dark:group-hover:text-purple-400"
                      size="14"
                    />
                  </div>

                  <p
                    v-if="project.description"
                    class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400"
                  >
                    {{ project.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <button
              v-for="(_, index) in projects"
              :key="index"
              @click="handleCardClick(index)"
              class="transition-all duration-300"
              :class="
                index === activeIndex
                  ? 'h-2 w-8 rounded-full bg-purple-600 dark:bg-purple-500'
                  : 'size-2 rounded-full bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600'
              "
            ></button>
          </div>
        </div>

        <div v-else key="grid" class="min-h-[400px] w-full px-4">
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="project in projects"
              :key="project.id"
              @click="handleNavigate(project.to)"
              class="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
            >
              <div
                class="relative h-40 w-full overflow-hidden border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <img
                  :src="
                    project.thumbnail || 'https://placehold.co/384x160/F3F4F6/9CA3AF?text=Project'
                  "
                  class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  alt="project thumbnail"
                />
              </div>

              <div class="flex flex-1 flex-col p-4">
                <div class="flex items-start justify-between gap-3">
                  <h3
                    class="truncate text-[14px] font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-400"
                  >
                    {{ project.name }}
                  </h3>

                  <Icon
                    name="lucide:arrow-right"
                    size="16"
                    class="shrink-0 text-neutral-300 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-purple-600 dark:text-neutral-600 dark:group-hover:text-purple-400"
                  />
                </div>

                <p
                  v-if="project.description"
                  class="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400"
                >
                  {{ project.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.view-fade-enter-active,
.view-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.view-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
