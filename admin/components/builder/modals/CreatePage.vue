<script setup lang="ts">
import { useModalStore } from '~admin/stores/modal';
import { usePageFactory } from '~/admin/composables/builder/usePageFactory.js';
import { useCampaignTemplates } from '~/admin/composables/builder/useCampaignTemplates';

const modalStore = useModalStore();

const { addPage } = usePageFactory();

const templateGroups = useCampaignTemplates();

const selectedTemplate = ref('');
const selectedPageType = ref('');

const templates = computed(() => {
  if (!selectedPageType.value) return [];

  const group = templateGroups.find((group) => group.type === selectedPageType.value);
  return group ? group.templates : [];
});

const isValid = computed(() => {
  return selectedTemplate.value.length > 0;
});

watch(selectedPageType, () => {
  selectedTemplate.value = '';
});

function create() {
  if (!isValid.value) return;

  try {
    addPage(selectedPageType.value, selectedTemplate.value);

    modalStore.close();
  } catch (e: any) {
    // TODO
    console.error(e.message);
  }
}

function formatText(text: string) {
  return text.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>

<template>
  <div
    class="flex max-h-[85vh] min-h-[520px] w-[560px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04] transition-colors duration-300 dark:bg-[#0c0c0c] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] dark:ring-white/10"
  >
    <header
      class="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800/60"
    >
      <div class="flex flex-col">
        <h2 class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Create Page
        </h2>
      </div>
      <button
        @click="modalStore.close()"
        class="group flex size-8 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <Icon
          name="lucide:x"
          size="16"
          class="transition-transform group-hover:rotate-90"
          stroke-width="2"
        />
      </button>
    </header>

    <div class="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-5 pb-2">
      <div
        class="mb-6 flex w-full shrink-0 items-center rounded-xl bg-neutral-100/70 p-1.5 dark:bg-neutral-900/50"
      >
        <button
          v-for="group in templateGroups"
          :key="group.type"
          @click="
            selectedPageType = group.type;
            selectedTemplate = '';
          "
          class="relative flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all duration-200 outline-none"
          :class="
            selectedPageType === group.type
              ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-black/[0.04] dark:bg-neutral-800 dark:text-white dark:ring-white/10'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
          "
        >
          {{ formatText(group.type) }}
        </button>
      </div>

      <div class="flex flex-1 flex-col">
        <div
          v-if="!selectedPageType"
          class="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center dark:border-neutral-800 dark:bg-neutral-900/20"
        >
          <div
            class="mb-4 flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <Icon
              name="lucide:layout-template"
              class="text-neutral-400 dark:text-neutral-500"
              size="20"
              stroke-width="1.5"
            />
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Select a category
          </h3>
          <p
            class="mt-1.5 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            Choose an option from the tabs above to explore available templates.
          </p>
        </div>

        <div v-else class="grid grid-cols-2 gap-4 pb-4">
          <button
            v-for="(template, i) in templates"
            :key="i"
            @click="selectedTemplate = template.name"
            class="group relative flex flex-col rounded-xl border p-2 text-left transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
            :class="
              selectedTemplate === template.name
                ? 'border-purple-500 bg-purple-50/30 shadow-[0_2px_10px_rgba(147,51,234,0.1)] dark:border-purple-500/80 dark:bg-purple-500/10'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900'
            "
          >
            <div
              class="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-black/[0.03] bg-neutral-100 transition-colors duration-300 group-hover:bg-neutral-200/50 dark:border-white/[0.02] dark:bg-black/50 dark:group-hover:bg-black/80"
            >
              <component
                :is="resolveTemplateImage(selectedPageType, template.name)"
                class="transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div
                class="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-purple-600 text-white shadow-md transition-all duration-300 ease-out"
                :class="
                  selectedTemplate === template.name
                    ? 'scale-100 opacity-100'
                    : 'scale-75 opacity-0'
                "
              >
                <Icon name="lucide:check" size="14" stroke-width="2.5" />
              </div>
            </div>

            <div class="flex items-center px-1 pt-3 pb-1">
              <span
                class="truncate text-[13px] font-semibold tracking-tight transition-colors duration-200"
                :class="
                  selectedTemplate === template.name
                    ? 'text-purple-700 dark:text-purple-400'
                    : 'text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white'
                "
              >
                {{ formatText(template.name) }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <footer
      class="flex shrink-0 items-center justify-end gap-3 border-t border-neutral-100 bg-neutral-50/80 px-6 py-4 dark:border-neutral-800/60 dark:bg-neutral-900/30"
    >
      <button
        @click="modalStore.close()"
        class="rounded-lg px-4 py-2 text-[13px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-200/50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      >
        Cancel
      </button>
      <button
        @click="create"
        :disabled="!selectedTemplate"
        class="rounded-lg bg-purple-600 px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
      >
        Create Page
      </button>
    </footer>
  </div>
</template>
