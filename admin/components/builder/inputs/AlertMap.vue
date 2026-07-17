<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import TextInput from './TextInput.vue';
import TextareaInput from './TextareaInput.vue';
import {
  GENERAL_ALERT,
  DEFAULT_LOGIN_ALERT,
  DEFAULT_REDEEM_ALERT,
  DEFAULT_LOGIN_OTP_ALERT,
  DEFAULT_REGISTER_ALERT,
  DEFAULT_REGISTER_OTP_ALERT,
  DEFAULT_REGISTER_RESEND_ALERT,
  DEFAULT_SUBMISSION_ALERTS,
} from '~/constants/alerts';
import { useComponentProperties } from '~/admin/composables/builder/useComponentProperties';
import Tooltip from '~admin/components/admin-ui/Tooltip.vue';
import ContextMenu from '~admin/components/shared/ContextMenu.vue';

const alertModel = defineModel<any>('alert', {
  required: true,
  default: () => ({ component: 'alert-card', map: {} }),
});

const { alertPropertyFiles } = useComponentProperties();

const isAdding = ref(false);
const isMenuOpen = ref<boolean>(false);
const triggerEl = ref<HTMLElement | null>(null);
const activeEditKey = ref<string | null>(null);
const selectedPresetKey = ref('');
const expandedKeys = ref(new Set<string>());
const itemRefs = ref<Record<string, HTMLElement | null>>({});

const ALL_ALERTS = {
  ...GENERAL_ALERT,
  ...DEFAULT_LOGIN_ALERT,
  ...DEFAULT_REDEEM_ALERT,
  ...DEFAULT_LOGIN_OTP_ALERT,
  ...DEFAULT_REGISTER_ALERT,
  ...DEFAULT_REGISTER_OTP_ALERT,
  ...DEFAULT_REGISTER_RESEND_ALERT,
  ...DEFAULT_SUBMISSION_ALERTS,
} as const;

const componentSchemas = Object.keys(alertPropertyFiles).reduce((acc: any, path) => {
  const folderName = path.split('/alert/')[1].split('/')[0];
  const rawName = `alert-${folderName}`;
  // @ts-ignore
  acc[rawName] = alertPropertyFiles[path].properties;
  return acc;
}, {});

const alertComponents = Object.keys(componentSchemas).map((key) => ({
  label: key
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
  value: key,
}));

const alertOptions = computed(() => {
  const currentKeys = new Set(Object.keys(alertModel.value.map || {}));
  return Object.entries(ALL_ALERTS)
    .filter(([key]) => !currentKeys.has(key))
    .map(([key, config]) => ({
      label: formatLabel(key),
      value: key,
      // @ts-ignore
      title: config.title,
      // @ts-ignore
      description: config.description,
    }));
});

function formatLabel(text: string) {
  return text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase());
}

function iconForType(type?: string) {
  switch (type) {
    case 'success':
      return 'lucide:check-circle';
    case 'warning':
      return 'lucide:alert-triangle';
    case 'info':
      return 'lucide:info';
    default:
      return 'lucide:alert-circle';
  }
}

function openContextMenu(key: string, event: MouseEvent) {
  activeEditKey.value = key;
  triggerEl.value = event.currentTarget as HTMLElement;
  isMenuOpen.value = true;
}

function handleCloseMenu() {
  isMenuOpen.value = false;
  activeEditKey.value = null;
  triggerEl.value = null;
}

function confirmAdd() {
  if (!selectedPresetKey.value) return;

  const key = selectedPresetKey.value;
  // @ts-ignore
  const original = ALL_ALERTS[key];

  if (!alertModel.value.map) alertModel.value.map = {};

  alertModel.value.map[key] = {
    title: original.title || '',
    description: original.description || '',
    type: original.type || 'error',
  };

  expandedKeys.value.add(key);
  isAdding.value = false;
  selectedPresetKey.value = '';
}

function removeAlert(key: string) {
  delete alertModel.value.map[key];
  expandedKeys.value.delete(key);
}

function confirmRemove(key: string) {
  removeAlert(key);
  handleCloseMenu();
}

watch(
  expandedKeys,
  async () => {
    await nextTick();
    const keys = Array.from(expandedKeys.value);

    if (!keys.length) return;

    const lastKey = keys[keys.length - 1];
    const el = itemRefs.value[lastKey];

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-col text-xs text-neutral-900 dark:text-neutral-100">
    <!--  Component-->
    <div class="mb-4">
      <div class="flex w-full items-center justify-between gap-3">
        <div class="flex items-center gap-1">
          <span class="text-xs font-semibold whitespace-nowrap">Component</span>
          <Tooltip
            text="Overrides allow you to customize error messages for specific error codes. For example, you can set a custom title and description for a 'UserNotFound' error."
          >
            <template #trigger>
              <Icon name="lucide:info" class="size-3 text-neutral-400" />
            </template>
          </Tooltip>
        </div>
        <div class="relative w-full max-w-[180px]">
          <select
            v-model="alertModel.component"
            class="w-full appearance-none rounded border border-neutral-200 bg-white py-1.5 pr-8 pl-2.5 font-medium text-neutral-800 transition-colors hover:border-neutral-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option v-for="comp in alertComponents" :key="comp.value" :value="comp.value">
              {{ comp.label }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400"
          >
            <Icon name="lucide:chevron-down" class="size-3.5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Overrides -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
        <div class="flex flex-col gap-1">
          <template v-if="Object.keys(alertModel.map || {}).length > 0">
            <div
              v-for="(config, key) in alertModel.map"
              :key="key"
              class="group relative flex flex-col overflow-hidden rounded-md border border-neutral-300 bg-white transition-all hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <div
                class="flex cursor-pointer items-center justify-between px-3 py-2.5 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                @click="openContextMenu(String(key), $event)"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <div class="flex size-5 shrink-0 items-center justify-center text-neutral-400">
                    <Icon :name="iconForType(config.type)" class="size-3.5" />
                  </div>

                  <div class="flex items-center gap-2 overflow-hidden">
                    <span
                      class="truncate text-xs font-semibold text-neutral-900 select-none dark:text-neutral-100"
                    >
                      {{ formatLabel(String(key)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <button
            v-if="!isAdding"
            type="button"
            @click="isAdding = true"
            class="group flex w-full items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white/50 px-3 py-2 text-neutral-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400"
          >
            <div
              class="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors group-hover:border-purple-400 group-hover:text-purple-600"
            >
              <Icon name="lucide:plus" class="size-3" />
            </div>
            <span class="text-xs font-medium">Add Override</span>
          </button>

          <div
            v-else
            class="flex items-center rounded-md border border-neutral-200 bg-white p-1 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div class="relative flex-1">
              <select
                v-model="selectedPresetKey"
                class="w-full appearance-none border-none bg-transparent py-1 pr-6 pl-2 text-[11px] font-medium text-neutral-700 outline-none focus:ring-0 dark:text-neutral-300"
              >
                <option value="" disabled>Select Error...</option>
                <option v-for="opt in alertOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>

              <div
                class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400"
              >
                <Icon name="lucide:chevrons-up-down" class="size-3" />
              </div>
            </div>

            <div class="mx-1 h-3.5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700"></div>

            <div class="flex shrink-0 items-center gap-0.5 pr-0.5">
              <button
                @click="isAdding = false"
                class="flex size-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                title="Cancel"
              >
                <Icon name="lucide:x" class="size-[13px]" />
              </button>

              <button
                @click="confirmAdd"
                :disabled="!selectedPresetKey"
                class="flex size-6 items-center justify-center rounded transition-all disabled:cursor-not-allowed disabled:opacity-50"
                :class="
                  selectedPresetKey
                    ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700'
                    : 'bg-neutral-100 text-neutral-400'
                "
                title="Add Error"
              >
                <Icon name="lucide:plus" stroke-width="2.5" class="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ContextMenu
      :open="isMenuOpen"
      :trigger="triggerEl"
      :menu-width="350"
      :gap="26"
      @close="handleCloseMenu"
    >
      <div v-if="activeEditKey && alertModel.map[activeEditKey]" class="flex flex-col">
        <header class="border-b border-neutral-100 px-4 py-3 dark:border-neutral-700">
          <h3 class="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Edit {{ formatLabel(activeEditKey) }}
          </h3>
          <p class="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
            Override default messaging for this error.
          </p>
        </header>

        <div class="flex flex-col gap-4 p-4">
          <div class="space-y-1.5">
            <label
              class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
            >
              Title
            </label>
            <TextInput
              v-model:props="alertModel.map[activeEditKey].title"
              placeholder="Enter override title..."
            />
          </div>

          <div class="space-y-1.5">
            <label
              class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
            >
              Description
            </label>
            <TextareaInput v-model:props="alertModel.map[activeEditKey].description" rows="3" />
          </div>
        </div>
        <div
          class="sticky bottom-0 flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
            @click="confirmRemove(activeEditKey)"
          >
            <Icon name="lucide:trash-2" class="size-3.5" />
            Remove
          </button>
        </div>
      </div>
    </ContextMenu>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
