<script setup lang="ts">
import clsx from 'clsx';
import GaLogo from '../shared/GaLogo.vue';

const props = defineProps<{
  isExpanded: boolean;
}>();

const emit = defineEmits(['toggle']);

const route = useRoute();
const adminAppStore = useAdminAppStore();
const { currentCampaignProjects, currentCampaignId, currentCampaignConfig } =
  storeToRefs(adminAppStore);

const isDropdownOpen = ref(false);
const projectDropdownEl = useTemplateRef('projectDropdownEl');
const activeTooltip = ref<string | null>(null);
const tooltipPos = ref({ top: 0, left: 0 });

const currentProject = computed({
  get() {
    const found = currentCampaignProjects.value.find((p) => {
      const resolvedPath = p.to.replace('{{id}}', currentCampaignId.value);
      return route.path.includes(resolvedPath);
    });
    return found ? found.id : currentCampaignProjects.value[0]?.id;
  },
  set(newId) {
    const project = currentCampaignProjects.value.find((p) => p.id === newId);
    if (project) {
      const resolvedPath = project.to.replace('{{id}}', currentCampaignId.value);
      navigateTo(resolvedPath);
    }
  },
});

const projectName = computed(() => {
  const pathSegments = route.path.split('/');
  const geAdminIndex = pathSegments.indexOf('ge-admin');

  if (geAdminIndex !== -1 && geAdminIndex + 1 < pathSegments.length) {
    const segment = pathSegments[geAdminIndex + 1];

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return null;
});

const navigations = computed(() => {
  const project = currentCampaignProjects.value.find((p) => p.id === currentProject.value);

  const nav = project?.navigations || {};

  return Object.entries(nav)
    .map(([group, items]: [string, any]) => {
      return [
        { group },
        ...items.map((item: any) => ({
          ...item,
          to: item.to.replace('{{id}}', currentCampaignId.value),
        })),
      ];
    })
    .flat();
});

function handleProjectSelect(projectId: string) {
  currentProject.value = Number(projectId);
  isDropdownOpen.value = false;
}

function handleButtonClick(event: Event) {
  if (!props.isExpanded) {
    navigateTo({ name: 'ge-admin-home' });
  } else {
    toggleDropdown(event);
  }
}

function toggleDropdown(event: Event) {
  event.stopPropagation();

  if (props.isExpanded) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
}

function showTooltip(event: MouseEvent, label: string | null) {
  if (props.isExpanded || !process.client) return;

  const el = event.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();

  activeTooltip.value = label;
  tooltipPos.value = {
    top: rect.top + rect.height / 2,
    left: rect.right + 8,
  };
}

function hideTooltip() {
  activeTooltip.value = null;
}

watch(
  () => props.isExpanded,
  (expanded) => {
    if (!expanded) {
      isDropdownOpen.value = false;
    }
  }
);

onClickOutside(projectDropdownEl, () => {
  isDropdownOpen.value = false;
});
</script>

<template>
  <aside
    :class="
      clsx(
        'group/sidebar relative z-20 flex h-full shrink-0 flex-col border-r border-neutral-200 bg-white transition-[width,background-color,border-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] dark:border-neutral-800 dark:bg-neutral-950',
        isExpanded ? 'w-60' : 'w-[70px]'
      )
    "
  >
    <div class="relative flex h-20 shrink-0 items-center justify-center px-3">
      <div class="relative" :class="isExpanded ? 'w-full' : 'size-11'">
        <button
          @click="handleButtonClick"
          class="relative flex w-full cursor-pointer items-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] outline-none hover:shadow-md hover:ring-neutral-300 dark:bg-neutral-900 dark:ring-neutral-800 dark:hover:ring-neutral-700"
          :class="[
            isExpanded ? 'px-2.5 py-2.5' : 'h-full justify-center p-0',
            isDropdownOpen
              ? 'shadow-purple-100/50 ring-purple-500 dark:shadow-purple-900/20 dark:ring-purple-500'
              : '',
          ]"
        >
          <div class="flex shrink-0 items-center justify-center">
            <GaLogo
              class="h-5 w-5 text-purple-600 transition-transform duration-300 dark:text-purple-500"
              :class="!isExpanded && 'group-hover/sidebar:scale-110'"
            />
          </div>

          <div
            class="flex flex-1 items-center justify-between overflow-hidden pl-2.5 transition-all duration-300 ease-out"
            :class="
              isExpanded
                ? 'translate-x-0 opacity-100 delay-75'
                : 'pointer-events-none absolute left-10 w-0 -translate-x-4 opacity-0'
            "
          >
            <div class="flex flex-col items-start gap-1">
              <span
                class="font-heading text-[13px] leading-none font-bold tracking-tight text-neutral-900 capitalize transition-colors dark:text-neutral-100"
              >
                {{ projectName || 'Select Project' }}
              </span>
              <span
                class="text-[9px] leading-none font-medium text-neutral-500 uppercase transition-colors dark:text-neutral-400"
              >
                {{ currentCampaignConfig?.name }}
              </span>
            </div>

            <Icon
              name="lucide:chevron-down"
              size="12"
              class="ml-2 shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
              :class="isDropdownOpen ? 'rotate-180' : ''"
            />
          </div>
        </button>

        <transition
          enter-active-class="transition ease-[cubic-bezier(0.2,0,0,1)] duration-150"
          enter-from-class="transform opacity-0 scale-95 -translate-y-1"
          enter-to-class="transform opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="transform opacity-100 scale-100 translate-y-0"
          leave-to-class="transform opacity-0 scale-95 -translate-y-1"
        >
          <div
            ref="projectDropdownEl"
            v-if="isDropdownOpen && isExpanded"
            @click.stop
            class="absolute top-full left-0 z-50 mt-1.5 w-full min-w-[180px] overflow-hidden rounded-lg bg-white py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-neutral-200/60 dark:bg-neutral-900 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:ring-neutral-800"
          >
            <div
              class="px-2.5 pt-1 pb-1.5 text-[9px] font-semibold tracking-wider text-neutral-400 uppercase transition-colors dark:text-neutral-500"
            >
              Switch Project
            </div>

            <div class="flex flex-col gap-0.5 px-1.5">
              <button
                v-for="project in currentCampaignProjects"
                :key="project.id"
                @click="handleProjectSelect(String(project.id))"
                class="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
                :class="
                  currentProject === project.id
                    ? 'bg-purple-50/50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                "
              >
                <span class="truncate">{{ project.name }}</span>

                <Icon
                  v-if="currentProject === project.id"
                  name="lucide:check"
                  size="12"
                  class="ml-2 shrink-0 text-purple-600 dark:text-purple-400"
                />
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <button
      @click="emit('toggle')"
      class="absolute top-6 -right-2 z-50 flex size-6 translate-x-1/2 transform items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-200 transition-all hover:bg-neutral-50 hover:text-neutral-900 hover:shadow hover:ring-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:hover:ring-neutral-700"
    >
      <Icon
        name="lucide:chevrons-left"
        size="14"
        class="transition-transform duration-300"
        :class="isExpanded ? '' : 'rotate-180'"
      />
    </button>

    <nav class="flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto p-3">
      <template v-for="(item, index) in navigations" :key="index">
        <div v-if="item.group" class="mt-4 mb-1 first:mt-0">
          <span
            class="block px-3 text-[10px] font-bold tracking-wider whitespace-nowrap text-neutral-400 uppercase transition-all duration-300 dark:text-neutral-500"
            :class="isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'"
          >
            {{ item.group }}
          </span>
        </div>

        <nuxt-link
          v-else
          :to="item.to"
          @mouseenter="showTooltip($event, item.label!)"
          @mouseleave="hideTooltip"
          class="group flex h-10 w-full items-center rounded-lg text-neutral-600 transition-all duration-200 outline-none hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-purple-500 active:bg-neutral-200/80 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-100 dark:active:bg-neutral-800"
          exact-active-class="bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
        >
          <div class="flex h-10 w-[46px] shrink-0 items-center justify-center">
            <Icon
              :name="`lucide:${item.icon}`"
              size="18"
              class="transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
              exact-active-class="text-purple-600 dark:text-purple-400"
            />
          </div>

          <span
            class="text-[13px] font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
            :class="isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'"
          >
            {{ item.label }}
          </span>
        </nuxt-link>
      </template>
    </nav>

    <client-only>
      <teleport to="body">
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="-translate-x-2 opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="-translate-x-2 opacity-0"
        >
          <div
            v-if="activeTooltip"
            class="pointer-events-none fixed z-[9999] -translate-y-1/2 rounded-md bg-neutral-800 px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white shadow-sm transition-colors dark:bg-neutral-100 dark:text-neutral-900"
            :style="{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
            }"
          >
            {{ activeTooltip }}
          </div>
        </transition>
      </teleport>
    </client-only>
  </aside>
</template>
