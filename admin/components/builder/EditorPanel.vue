<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import clsx from 'clsx';

import { INPUT_COMPONENTS } from '~/admin/constants/builder/inputs';
import Collapsible from '../admin-ui/Collapsible.vue';
import SpacingConfiguration from './inputs/SpacingConfiguration.vue';
import { useComponentProperties } from '~/admin/composables/builder/useComponentProperties';

const builderStore = useBuilderStore();
const { selectedSection, activePageConfig, activePageId } = storeToRefs(builderStore);
const { definitions } = useComponentProperties();

const spacingValues = ref({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const componentSchema = computed(() => {
  if (!selectedSection.value) return null;
  const def = definitions[selectedSection.value.component];
  return def?.properties || {};
});

const groupedProperties = computed(() => {
  if (!componentSchema.value) return [];

  const groups = Object.entries(componentSchema.value).reduce(
    (acc, [key, config]) => {
      if (
        key === 'state' &&
        (!activePageConfig.value.states || activePageConfig.value.states.length === 0)
      ) {
        return acc;
      }

      const groupName = config.editor?.group || 'General';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({ key, config });
      return acc;
    },
    {} as Record<string, { key: string; config: any }[]>
  );

  const groupEntries = Object.entries(groups).map(([name, items]) => ({
    name,
    items,
  }));

  return groupEntries.sort((a, b) => {
    if (a.name === 'General') return -1;
    if (b.name === 'General') return 1;
    return 0;
  });
});

function hasSeparateLayout(config: any) {
  if (!config) return false;
  const typesWithOwnLayout = [
    'form-schema',
    'alert-map',
    'spacing',
    'image-uploader',
    'object',
    'array',
  ];

  return typesWithOwnLayout.includes(config.editor.type);
}

function parseSpacingFromClasses(className: string) {
  const defaults = { top: 0, right: 0, bottom: 0, left: 0 };
  if (!className) return defaults;

  const extract = (prefix: string) => {
    const regex = new RegExp(`(-?)${prefix}-\\[(-?\\d+)px\\]`);
    const match = className.match(regex);
    if (match) {
      return parseInt(match[2]);
    }
    return 0;
  };

  return {
    top: extract('mt'),
    right: extract('mr'),
    bottom: extract('mb'),
    left: extract('ml'),
  };
}

function handleUpdateSpacing(newValues: any) {
  spacingValues.value = newValues;

  if (!selectedSection.value) return;

  const newMargins = [
    `mt-[${newValues.top}px]`,
    `mr-[${newValues.right}px]`,
    `mb-[${newValues.bottom}px]`,
    `ml-[${newValues.left}px]`,
  ].join(' ');

  const currentOuter = selectedSection.value.classes.outer || '';

  selectedSection.value.classes.outer = cn(currentOuter, newMargins);
}

function getOptions(key: string, options: string[]) {
  if (key === 'state') {
    return activePageConfig.value.states || [];
  }
  return options;
}

function safeUpdateProp(key: string, value: any) {
  if (!selectedSection.value) return;

  if (!selectedSection.value.props) selectedSection.value.props = {};
  selectedSection.value.props = {
    ...selectedSection.value.props,
    [key]: value,
  };

  const sectionId = selectedSection.value.id;
  if (activePageConfig.value?.sections) {
    const index = activePageConfig.value.sections.findIndex((s: any) => s.id === sectionId);
    if (index !== -1) {
      activePageConfig.value.sections[index] = { ...selectedSection.value };
    }
  }
}

watch(
  () => selectedSection.value?.classes?.outer,
  (newClasses) => {
    spacingValues.value = parseSpacingFromClasses(newClasses || '');
  },
  { immediate: true }
);

watch(
  () => [
    selectedSection.value?.props?.alignment,
    selectedSection.value?.props?.titleColor,
    selectedSection.value?.props?.descriptionColor,
    selectedSection.value?.props?.linkColor,
  ],
  ([newAlignment, titleColor, descColor, linkColor]) => {
    if (!selectedSection.value) return;

    if (!selectedSection.value.classes) selectedSection.value.classes = {};
    const cls = selectedSection.value.classes;

    const getColorClass = (val: any) =>
      val ? (String(val).startsWith('#') ? `text-[${val}]` : String(val)) : '';

    cls.outer = cn(cls.outer || '', newAlignment ? `text-${newAlignment}` : '');
    cls.title = cn(cls.title || '', getColorClass(titleColor));
    cls.description = cn(cls.description || '', getColorClass(descColor));

    if (!cls.link) cls.link = {};
    cls.link.destination = cn(cls.link.destination || '', getColorClass(linkColor));
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="selectedSection && groupedProperties.length" class="relative flex flex-col gap-4">
    <div
      v-for="group in groupedProperties"
      :key="group.name"
      class="border-b border-neutral-300 pb-4 dark:border-neutral-800"
    >
      <Collapsible :title="group.name" :default-open="group.name === 'General'">
        <div class="flex flex-col gap-2.5">
          <div
            v-for="{ config, key } in group.items"
            :key="key"
            class="flex w-full flex-col gap-1.5 px-1.5"
          >
            <div
              v-if="config.editor"
              :class="
                clsx('grid grid-cols-5 items-center gap-4', {
                  'items-start': config.editor.label === 'Image',
                })
              "
            >
              <template v-if="hasSeparateLayout(config)">
                <div class="col-span-5">
                  <component
                    v-if="INPUT_COMPONENTS[config.editor.type]"
                    :is="INPUT_COMPONENTS[config.editor.type]"
                    :props="selectedSection.props?.[key]"
                    @update:props="(value: any) => safeUpdateProp(key, value)"
                    v-model:schema="selectedSection.schema"
                    v-model:alert="selectedSection.alert"
                    v-model:attrs="selectedSection.attrs"
                    v-bind="config.editor"
                  />
                </div>
              </template>

              <template v-else>
                <span
                  class="col-span-2 text-xs font-semibold whitespace-nowrap text-neutral-900 dark:text-neutral-100"
                >
                  {{ config.editor?.label }}
                </span>

                <div class="col-span-3">
                  <component
                    v-if="INPUT_COMPONENTS[config.editor.type]"
                    :is="INPUT_COMPONENTS[config.editor.type]"
                    :props="selectedSection.props?.[key]"
                    @update:props="(value: any) => safeUpdateProp(key, value)"
                    v-model:state="selectedSection.state"
                    v-model:attrs="selectedSection.attrs"
                    v-bind="config.editor"
                    :options="getOptions(key, config.editor.options)"
                  />
                  <div
                    v-else
                    class="rounded bg-red-50 p-2 text-xs text-red-500 dark:bg-red-950/30 dark:text-red-400"
                  >
                    Unknown: {{ config.editor.type }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>

    <Collapsible key="Spacing" title="Spacing">
      <div class="flex flex-col gap-2.5">
        <SpacingConfiguration :model-value="spacingValues" @update-spacing="handleUpdateSpacing" />
      </div>
    </Collapsible>
  </div>
</template>
