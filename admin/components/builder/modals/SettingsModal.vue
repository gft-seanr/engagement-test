<script setup lang="ts">
import { ref } from 'vue';
import PublishTab from '../settings/PublishTab.vue';
import JsonTab from '../settings/JsonTab.vue';
import SchedulesTab from '../settings/SchedulesTab.vue';
import ThemesTab from '../settings/ThemesTab.vue';
import GeneralTab from '../settings/GeneralTab.vue';

const activeTab = ref<'general' | 'publish' | 'json' | 'schedule' | 'theme'>('general');
const modalRoot = ref<HTMLElement | null>(null);

const isFullscreen = ref(false);

function toggleFullscreen() {
  const el = modalRoot.value;
  if (!el) return;

  if (!isFullscreen.value && el.requestFullscreen) {
    el.requestFullscreen().catch(() => {
      isFullscreen.value = true;
    });
    return;
  }

  if (isFullscreen.value && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {
      isFullscreen.value = false;
    });
    return;
  }

  isFullscreen.value = !isFullscreen.value;
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

document.addEventListener('fullscreenchange', onFullscreenChange);

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
  import.meta.hot.dispose(() =>
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  );
}
</script>

<template>
  <div
    ref="modalRoot"
    :class="[
      'flex w-full overflow-hidden bg-white transition-colors duration-300 dark:bg-neutral-950',
      isFullscreen
        ? 'fixed inset-0 z-50 h-screen max-w-none'
        : 'h-[40rem] max-w-[55rem] min-w-[55rem] rounded-xl shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800',
    ]"
  >
    <aside
      class="flex w-52 shrink-0 flex-col gap-6 border-r border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <div class="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
        <Icon name="lucide:settings" size="18" />
        <h2 class="font-heading text-sm font-bold">Settings</h2>
      </div>

      <nav class="flex flex-col gap-1">
        <button
          @click="activeTab = 'general'"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          :class="
            activeTab === 'general'
              ? 'bg-purple-100/50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
          "
        >
          <Icon name="lucide:layout-dashboard" size="16" />
          <span>General</span>
        </button>

        <button
          @click="activeTab = 'publish'"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          :class="
            activeTab === 'publish'
              ? 'bg-purple-100/50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
          "
        >
          <Icon name="lucide:rocket" size="16" />
          <span>Publish</span>
        </button>

        <button
          @click="activeTab = 'schedule'"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          :class="
            activeTab === 'schedule'
              ? 'bg-purple-100/50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
          "
        >
          <Icon name="lucide:calendar-clock" size="16" />
          <span>Schedule</span>
        </button>

        <button
          @click="activeTab = 'theme'"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          :class="
            activeTab === 'theme'
              ? 'bg-purple-100/50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
          "
        >
          <Icon name="lucide:palette" size="16" />
          <span>Theme</span>
        </button>

        <button
          @click="activeTab = 'json'"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          :class="
            activeTab === 'json'
              ? 'bg-purple-100/50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
          "
        >
          <Icon name="lucide:code-2" size="16" />
          <span>JSON Config</span>
        </button>
      </nav>
    </aside>

    <main class="flex flex-1 flex-col overflow-hidden bg-white p-6 dark:bg-neutral-950">
      <div
        v-if="activeTab === 'general'"
        class="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto pr-2"
      >
        <GeneralTab />
      </div>

      <div
        v-else-if="activeTab === 'publish'"
        class="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto pr-2"
      >
        <PublishTab />
      </div>

      <div
        v-else-if="activeTab === 'schedule'"
        class="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto pr-2"
      >
        <SchedulesTab />
      </div>

      <div
        v-else-if="activeTab === 'theme'"
        class="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto pr-2"
      >
        <ThemesTab />
      </div>

      <div
        v-else-if="activeTab === 'json'"
        class="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto pr-2"
      >
        <JsonTab :is-fullscreen="isFullscreen" @toggle="toggleFullscreen" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e5e5;
  border-radius: 10px;
}
</style>
