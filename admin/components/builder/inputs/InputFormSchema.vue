<script setup lang="ts">
import { ref, computed, nextTick, type Ref } from 'vue';
import type { FormKitSchemaNode } from '@formkit/core';
import draggable from 'vuedraggable';
import { storeToRefs } from 'pinia';

import { useToggle, useStyleTag, onClickOutside } from '@vueuse/core';

import { getAllPresets } from '~/admin/constants/builder/presets';
import ContextMenu from '~admin/components/shared/ContextMenu.vue';
import ValidationEditor from './ValidationEditor.vue';
import Tooltip from '~admin/components/admin-ui/Tooltip.vue';

type SchemaNode = FormKitSchemaNode | Record<string, any>;

const schema = defineModel<SchemaNode[]>('schema', { default: () => [] });

const builderStore = useBuilderStore();
const { activeCanvasTool } = storeToRefs(builderStore);

const selectedFieldIndex = ref<number | null>(null);
const selectedFieldType = ref<string>('');
const selectedNode = ref<Record<string, any>>({});
const expandedKeys = ref<Set<string>>(new Set());
const propertyRefs = ref<Record<string, HTMLElement | null>>({});

const [isAdding, toggleAdding] = useToggle(false);
const [isMenuOpen, toggleMenuOpen] = useToggle(false);

const menuRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
onClickOutside(
  menuRef,
  () => {
    if (isMenuOpen.value) handleCloseMenu();
  },
  { ignore: [triggerEl] }
);

const injectedCssBlocks = ref<Record<string, string>>({});
const combinedCssString = computed(() => Object.values(injectedCssBlocks.value).join('\n'));
useStyleTag(combinedCssString, { id: 'form-schema-dynamic-styles' });

const fieldOptions = [
  { label: 'Text', value: 'text', group: 'Inputs' },
  { label: 'Tel', value: 'tel', group: 'Inputs' },
  { label: 'Number', value: 'number', group: 'Inputs' },
  { label: 'Email', value: 'email', group: 'Inputs' },
  { label: 'Password', value: 'password', group: 'Inputs' },
  { label: 'Checkbox', value: 'checkbox', group: 'Inputs' },
  { label: 'Select Dropdown', value: 'select', group: 'Inputs' },
  { label: 'Text Area', value: 'textarea', group: 'Inputs' },
  { label: 'Header', value: 'h2', group: 'Static' },
  { label: 'Paragraph', value: 'p', group: 'Static' },
  { label: 'Giftaway Consent Checkbox', value: 'preset_giftawayConsent', group: 'Presets' },
  { label: 'Primary Submit Button', value: 'preset_primarySubmit', group: 'Presets' },
];

function getNodeTitle(node: SchemaNode | undefined, index: number) {
  if (!node) return `Element #${index + 1}`;
  const n = node as any;

  if (n.$formkit === 'checkbox')
    return n.label?.length > 24 ? `${n.label.slice(0, 24)}...` : n.label || 'Checkbox';
  if (n.label) return n.label;
  if (n.name) return n.name.length > 24 ? `Field #${index + 1}` : n.name;
  if (n.$el === 'h1') return n.children || 'Main Heading';
  if (n.$el === 'h2') return 'Section Header';
  if (n.$el === 'p') return 'Text Block';

  return `Element #${index + 1}`;
}

function getNodeElementType(node: SchemaNode | undefined) {
  if (!node) return 'unknown';
  if ((node as any).$formkit) return 'input';
  if ((node as any).$el) return 'element';
  return 'unknown';
}

function confirmAddField() {
  if (!selectedFieldType.value) return;

  const type = selectedFieldType.value;
  const id = globalThis.crypto?.randomUUID?.() || `field_${Math.random().toString(36).slice(2, 7)}`;
  let newField: Record<string, any> = {};

  if (type.startsWith('preset_')) {
    const presets = getAllPresets();
    const presetKey = type.replace('preset_', '') as keyof typeof presets;

    if (presets[presetKey]) {
      const selectedPreset = JSON.parse(JSON.stringify(presets[presetKey]));
      newField = {
        ...selectedPreset,
        id,
        name: selectedPreset.name ? `${selectedPreset.name}_${id.split('-')[0]}` : id,
      };
    }
  } else if (type === 'h2') {
    newField = {
      id,
      $el: 'h2',
      children: 'New Section',
      attrs: { class: 'text-xl font-bold mb-2' },
    };
  } else if (type === 'p') {
    newField = {
      id,
      $el: 'p',
      children: 'Enter your text content here.',
      attrs: { class: 'text-sm text-gray-600 mb-4' },
    };
  } else {
    const shortHash = id.split('-')[0].substring(0, 5);
    newField = {
      id,
      $formkit: type,
      name: `${type}_${shortHash}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    };

    if (type !== 'checkbox' && type !== 'select') newField.placeholder = 'Enter value...';

    if (type === 'checkbox') {
      newField.sectionsSchema = {
        label: {
          $cmp: 'MarkdownLabel',
          props: { content: '$label', tag: 'label', class: '$classes.label' },
        },
      };
    }

    if (type === 'select') {
      newField.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ];
      newField.placeholder = 'Select an option...';
    }
  }

  schema.value.push(newField);
  toggleAdding(false);
  selectedFieldType.value = '';
}

function removeField() {
  if (selectedFieldIndex.value === null) return;
  const indexToDelete = selectedFieldIndex.value;
  selectedFieldIndex.value = null;
  toggleMenuOpen(false);
  schema.value.splice(indexToDelete, 1);
}

function handleOpenMenu(node: Record<string, any>, index: number, event: MouseEvent) {
  selectedNode.value = node;
  selectedFieldIndex.value = index;
  triggerEl.value = event.currentTarget as HTMLElement;
  toggleMenuOpen(true);
}

function handleCloseMenu() {
  selectedNode.value = {};
  selectedFieldIndex.value = null;
  toggleMenuOpen(false);
}

async function toggleExpand(key: string) {
  if (!expandedKeys.value.has(key)) {
    expandedKeys.value.add(key);
    await nextTick();
    propertyRefs.value[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    expandedKeys.value.delete(key);
  }
}

function handleLabelChange(event: Event) {
  const newText = (event.target as HTMLInputElement).value;
  selectedNode.value.label = newText;

  if (selectedNode.value.type === 'submit' && selectedNode.value.children?.else) {
    selectedNode.value.children.else = newText;
  }
}

function onDrag() {
  selectedFieldIndex.value = null;

  toggleMenuOpen(false);
}

function addOption() {
  const options = selectedNode.value.options || [];
  const existingNumbers = options.map((opt: any) => {
    const match = opt.value?.match(/^option(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  selectedNode.value.options = [
    ...options,
    { label: `Option ${nextNumber}`, value: `option${nextNumber}` },
  ];
}

function removeOption(index: number) {
  if (!selectedNode.value.options) return;
  const newOptions = [...selectedNode.value.options];
  newOptions.splice(index, 1);
  selectedNode.value.options = newOptions;
}

function updateOptionLabel(index: number, newLabel: string) {
  if (!selectedNode.value.options) return;
  const newOptions = [...selectedNode.value.options];
  newOptions[index] = { ...newOptions[index], label: newLabel };
  selectedNode.value.options = newOptions;
}

function updateOptionValue(index: number, newValue: string) {
  if (!selectedNode.value.options) return;
  const newOptions = [...selectedNode.value.options];
  newOptions[index] = { ...newOptions[index], value: newValue };
  selectedNode.value.options = newOptions;
}

function useInjectedStyle(
  nodeRef: Ref<Record<string, any>>,
  target: 'label' | 'input' | 'element',
  cssProp: string,
  defaultValue: string
) {
  return computed({
    get: () => nodeRef.value?._styles?.[target]?.[cssProp] || defaultValue,
    set: (newValue: string) => {
      if (!nodeRef.value) return;

      const isFormKit = !!nodeRef.value.$formkit;
      const nodeId = nodeRef.value.id || `node-${Math.random().toString(36).substr(2, 9)}`;
      nodeRef.value.id = nodeId;

      if (isFormKit) {
        nodeRef.value.classes ??= {};
        nodeRef.value.classes.outer = `fk-node-${nodeId}`;
      } else {
        nodeRef.value.attrs ??= {};
        const currentClass = nodeRef.value.attrs.class || '';
        if (!currentClass.includes(`fk-node-${nodeId}`)) {
          nodeRef.value.attrs.class = `${currentClass} fk-node-${nodeId}`.trim();
        }
      }

      nodeRef.value._styles ??= { label: {}, input: {}, element: {} };
      nodeRef.value._styles[target] ??= {};
      nodeRef.value._styles[target][cssProp] = newValue;

      const toCSS = (obj: Record<string, any>) =>
        Object.entries(obj || {})
          .filter(([_, v]) => v !== '' && v != null)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v} !important;`)
          .join(' ');

      const cls = `fk-node-${nodeId}`;
      let cssBlock = '';

      if (isFormKit) {
        const labelCss = toCSS(nodeRef.value._styles.label);
        const inputCss = toCSS(nodeRef.value._styles.input);
        if (labelCss) cssBlock += `.${cls} .formkit-label { ${labelCss} }\n`;
        if (inputCss)
          cssBlock += `.${cls} .formkit-inner, .${cls} .formkit-input { ${inputCss} }\n`;
      } else {
        const elCss = toCSS(nodeRef.value._styles.element);
        if (elCss) cssBlock += `.${cls} { ${elCss} }\n`;
      }

      injectedCssBlocks.value[nodeId] = cssBlock;

      const prodStyles = Object.entries(nodeRef.value._styles[target])
        .filter(([_, v]) => v !== '' && v != null)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
        .join(' ');

      if (isFormKit) {
        nodeRef.value.sectionsSchema ??= {};
        nodeRef.value.sectionsSchema[target] ??= { attrs: {} };
        nodeRef.value.sectionsSchema[target].attrs ??= {};
        nodeRef.value.sectionsSchema[target].attrs.style = prodStyles;
      } else {
        nodeRef.value.attrs.style = prodStyles;
      }
    },
  });
}

function getSafeKey(element: any) {
  return element.id || `${element.$el}-${element.children}`;
}

const labelFontWeight = useInjectedStyle(selectedNode, 'label', 'fontWeight', 'normal');
const labelTextColor = useInjectedStyle(selectedNode, 'label', 'color', '#000000');
const labelFontSize = useInjectedStyle(selectedNode, 'label', 'fontSize', '14px');

const elementFontWeight = useInjectedStyle(selectedNode, 'element', 'fontWeight', 'normal');
const elementTextColor = useInjectedStyle(selectedNode, 'element', 'color', '#000000');

const buttonBgColor = useInjectedStyle(selectedNode, 'input', 'backgroundColor', '#a855f7');
const buttonTextColor = useInjectedStyle(selectedNode, 'input', 'color', '#ffffff');
const buttonRadius = useInjectedStyle(selectedNode, 'input', 'borderRadius', '6px');
const buttonFontWeight = useInjectedStyle(selectedNode, 'input', 'fontWeight', '600');
</script>

<template>
  <div>
    <div class="flex flex-col text-xs text-neutral-900 dark:text-neutral-100">
      <div class="flex flex-col gap-3 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
        <div class="flex flex-col gap-2">
          <draggable
            v-model="schema"
            :item-key="getSafeKey"
            handle=".drag-handle"
            ghost-class="ghost-card"
            class="flex flex-col gap-1"
            @dragstart="onDrag"
            @dragend="onDrag"
            :animation="200"
            :force-fallback="true"
            :revert-on-spill="true"
          >
            <template #item="{ element: node, index }">
              <div
                @click.stop="toggleExpand(index)"
                role="button"
                tabindex="0"
                class="group relative flex flex-col overflow-hidden rounded-md border border-neutral-300 bg-white py-1 transition-all hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                <div
                  class="flex cursor-pointer items-center justify-between px-3 py-2 transition-colors duration-300 ease-in-out hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                  @click="handleOpenMenu(node, index, $event)"
                >
                  <div class="flex items-center gap-2 overflow-hidden">
                    <div
                      @click.stop
                      class="drag-handle flex cursor-grab items-center p-0.5 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                    >
                      <Icon name="lucide:grip-vertical" class="size-3" />
                    </div>
                    <span
                      class="text-xs font-semibold text-neutral-900 capitalize select-none dark:text-neutral-100"
                    >
                      {{ getNodeTitle(node, index) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </draggable>

          <div
            v-if="schema.length === 0 && !isAdding"
            class="rounded-md border border-dashed border-neutral-300 py-6 text-center dark:border-neutral-700"
          >
            <span class="text-[10px] text-neutral-400 italic dark:text-neutral-500"
              >No fields configured</span
            >
          </div>

          <button
            v-if="!isAdding"
            type="button"
            @click="isAdding = true"
            class="group flex w-full items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white/50 px-3 py-2 text-neutral-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
          >
            <div
              class="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white group-hover:border-purple-400 group-hover:text-purple-600 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:border-purple-500/50 dark:group-hover:text-purple-400"
            >
              <Icon name="lucide:plus" class="size-3" />
            </div>
            <span class="text-xs font-medium">Add Field</span>
          </button>

          <div
            v-else
            class="flex items-center rounded-md border border-neutral-200 bg-white p-1 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:border-purple-500 dark:focus-within:ring-purple-500/30"
          >
            <div class="relative flex-1">
              <select
                v-model="selectedFieldType"
                class="w-full appearance-none border-none bg-transparent py-1 pr-6 pl-2 text-[11px] font-medium text-neutral-700 outline-none focus:ring-0 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <option value="" disabled>Select field type...</option>

                <optgroup label="Inputs">
                  <option
                    v-for="opt in fieldOptions.filter((o) => o.group === 'Inputs')"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </optgroup>

                <optgroup label="Static Elements">
                  <option
                    v-for="opt in fieldOptions.filter((o) => o.group === 'Static')"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </optgroup>

                <optgroup label="Presets">
                  <option
                    v-for="opt in fieldOptions.filter((o) => o.group === 'Presets')"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </optgroup>
              </select>

              <div
                class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
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
                @click="confirmAddField"
                :disabled="!selectedFieldType"
                class="flex size-6 items-center justify-center rounded transition-all disabled:cursor-not-allowed disabled:opacity-50"
                :class="
                  selectedFieldType
                    ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700 dark:hover:bg-purple-500'
                    : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500'
                "
                title="Confirm"
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
      <div class="flex h-full max-h-96 flex-col overflow-hidden">
        <header
          class="sticky top-0 z-10 rounded-t-lg border-b border-neutral-300 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 class="text-sm font-semibold text-neutral-900 capitalize dark:text-neutral-100">
            {{ getNodeTitle(selectedNode, 0) }}
          </h2>
          <p class="mt-1 text-[10px] text-neutral-500 uppercase dark:text-neutral-400">
            {{ getNodeElementType(selectedNode) }}
          </p>
        </header>
        <div class="no-scrollbar flex-1 overflow-auto">
          <div class="flex flex-col gap-2.5 p-4">
            <h3 class="text-xs font-semibold dark:text-neutral-100">Properties</h3>
            <div class="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
              <template v-if="getNodeElementType(selectedNode) === 'input'">
                <div
                  class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                >
                  <button
                    @click="toggleExpand('label')"
                    type="button"
                    class="flex w-full items-center justify-between p-3 text-left outline-none"
                  >
                    <div class="flex items-center gap-2 overflow-hidden">
                      <span
                        class="text-xs font-medium text-neutral-700 capitalize dark:text-neutral-300"
                        >Label</span
                      >

                      <span
                        v-if="!expandedKeys.has('label') && selectedNode.label"
                        class="max-w-[120px] truncate text-[10px] text-neutral-400 dark:text-neutral-500"
                      >
                        {{ selectedNode.label }}
                      </span>
                    </div>

                    <Icon
                      name="lucide:chevron-down"
                      size="12"
                      class="shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
                      :class="{ 'rotate-180': expandedKeys.has('label') }"
                    />
                  </button>

                  <Transition name="fade">
                    <div
                      v-show="expandedKeys.has('label')"
                      :ref="(el) => (propertyRefs['label'] = el as HTMLElement)"
                      class="border-t border-neutral-100 bg-neutral-50 px-3 pt-2 pb-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                    >
                      <div class="flex flex-col gap-4">
                        <div class="space-y-2">
                          <label
                            class="mb-1.5 block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                          >
                            Field Label
                          </label>
                          <input
                            :value="selectedNode.label"
                            @input="handleLabelChange"
                            class="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
                            placeholder="Enter label..."
                          />
                        </div>

                        <div
                          v-if="
                            selectedNode.$formkit !== 'checkbox' &&
                            selectedNode.$formkit !== 'submit' &&
                            selectedNode.$formkit !== 'select' &&
                            selectedNode.type !== 'submit'
                          "
                          class="space-y-2"
                        >
                          <label
                            class="mb-1.5 block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                          >
                            Field Placeholder
                          </label>
                          <input
                            v-model="selectedNode.placeholder"
                            class="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
                            placeholder="Enter placeholder..."
                          />
                        </div>

                        <div
                          v-if="
                            selectedNode.$formkit !== 'submit' && selectedNode.type !== 'submit'
                          "
                          class="flex flex-1 flex-col"
                        >
                          <span class="text-xs font-semibold dark:text-neutral-100"
                            >Customize Label</span
                          >
                          <div
                            class="mt-3 flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-2.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                          >
                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Weight</label
                              >
                              <div class="relative">
                                <select
                                  v-model="labelFontWeight"
                                  class="w-24 appearance-none rounded border border-transparent bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-700 transition-all outline-none hover:bg-neutral-200 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-800 dark:focus:ring-purple-500/30"
                                >
                                  <option value="normal">Regular</option>
                                  <option value="500">Medium</option>
                                  <option value="600">Semibold</option>
                                  <option value="bold">Bold</option>
                                </select>
                                <Icon
                                  name="lucide:chevron-down"
                                  size="10"
                                  class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Size</label
                              >

                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2 py-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <input
                                  type="text"
                                  v-model="labelFontSize"
                                  class="w-16 border-none bg-transparent p-0 text-right font-mono text-[10px] text-neutral-700 outline-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
                                  placeholder="14px"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Fill</label
                              >

                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white p-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <div
                                  class="relative h-4 w-4 overflow-hidden rounded-[3px] border border-neutral-200 shadow-sm dark:border-neutral-600"
                                >
                                  <input
                                    type="color"
                                    v-model="labelTextColor"
                                    class="absolute -inset-2 h-8 w-8 cursor-pointer appearance-none border-0 bg-transparent p-0"
                                  />
                                </div>

                                <input
                                  type="text"
                                  v-model="labelTextColor"
                                  class="w-14 border-none bg-transparent p-0 font-mono text-[10px] text-neutral-700 uppercase outline-none dark:text-neutral-300"
                                  maxlength="7"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="selectedNode.$formkit === 'submit'"
                          class="mt-4 flex flex-1 flex-col"
                        >
                          <span class="text-xs font-semibold dark:text-neutral-100"
                            >Customize Button</span
                          >

                          <div
                            class="mt-3 flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-2.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                          >
                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Weight</label
                              >
                              <div class="relative">
                                <select
                                  v-model="buttonFontWeight"
                                  class="w-24 appearance-none rounded border border-transparent bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-700 transition-all outline-none hover:bg-neutral-200 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-800 dark:focus:ring-purple-500/30"
                                >
                                  <option value="normal">Regular</option>
                                  <option value="500">Medium</option>
                                  <option value="600">Semibold</option>
                                  <option value="bold">Bold</option>
                                </select>
                                <Icon
                                  name="lucide:chevron-down"
                                  size="10"
                                  class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Background</label
                              >
                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white p-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <div
                                  class="relative h-4 w-4 overflow-hidden rounded-[3px] border border-neutral-200 shadow-sm dark:border-neutral-600"
                                >
                                  <input
                                    type="color"
                                    v-model="buttonBgColor"
                                    class="absolute -inset-2 h-8 w-8 cursor-pointer appearance-none border-0 bg-transparent p-0"
                                  />
                                </div>
                                <input
                                  type="text"
                                  v-model="buttonBgColor"
                                  class="w-14 border-none bg-transparent p-0 font-mono text-[10px] text-neutral-700 uppercase outline-none dark:text-neutral-300"
                                  maxlength="7"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Text Color</label
                              >
                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white p-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <div
                                  class="relative h-4 w-4 overflow-hidden rounded-[3px] border border-neutral-200 shadow-sm dark:border-neutral-600"
                                >
                                  <input
                                    type="color"
                                    v-model="buttonTextColor"
                                    class="absolute -inset-2 h-8 w-8 cursor-pointer appearance-none border-0 bg-transparent p-0"
                                  />
                                </div>
                                <input
                                  type="text"
                                  v-model="buttonTextColor"
                                  class="w-14 border-none bg-transparent p-0 font-mono text-[10px] text-neutral-700 uppercase outline-none dark:text-neutral-300"
                                  maxlength="7"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Radius</label
                              >
                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2 py-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <input
                                  type="text"
                                  v-model="buttonRadius"
                                  class="w-16 border-none bg-transparent p-0 text-right font-mono text-[10px] text-neutral-700 outline-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
                                  placeholder="6px"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <div
                  class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                >
                  <button
                    @click="toggleExpand('key')"
                    type="button"
                    class="flex w-full items-center justify-between p-3 text-left outline-none"
                  >
                    <div class="flex items-center gap-2 overflow-hidden">
                      <div class="flex items-center gap-1">
                        <span
                          class="text-xs font-medium text-neutral-700 capitalize dark:text-neutral-300"
                          >Key</span
                        >
                        <Tooltip
                          text="Key is required and should be unique as it will be used as means to send data to the backend"
                        >
                          <template #trigger>
                            <Icon
                              name="lucide:info"
                              size="12"
                              class="text-neutral-400 dark:text-neutral-500"
                            />
                          </template>
                        </Tooltip>
                      </div>
                      <span
                        v-if="!expandedKeys.has('key') && selectedNode.name"
                        class="max-w-[120px] truncate font-mono text-[10px] text-neutral-400 dark:text-neutral-500"
                      >
                        {{ selectedNode.name }}
                      </span>
                    </div>
                    <Icon
                      name="lucide:chevron-down"
                      size="12"
                      class="shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
                      :class="{ 'rotate-180': expandedKeys.has('key') }"
                    />
                  </button>

                  <Transition name="fade">
                    <div
                      v-show="expandedKeys.has('key')"
                      :ref="(el) => (propertyRefs['key'] = el as HTMLElement)"
                      class="border-t border-neutral-100 bg-neutral-50 px-3 pt-2 pb-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                    >
                      <label
                        class="mb-1.5 block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                      >
                        Unique ID
                      </label>
                      <input
                        v-model="selectedNode.name"
                        class="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 font-mono text-xs text-neutral-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
                        placeholder="unique_key"
                      />
                    </div>
                  </Transition>
                </div>
              </template>

              <div
                v-if="selectedNode.$formkit === 'select'"
                class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                <button
                  @click="toggleExpand('options')"
                  type="button"
                  class="flex w-full items-center justify-between bg-white p-2.5 text-left transition-colors outline-none hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50"
                >
                  <div class="flex items-center gap-2 overflow-hidden">
                    <span
                      class="text-xs font-medium text-neutral-700 capitalize dark:text-neutral-300"
                      >Select Options</span
                    >
                    <span
                      v-if="!expandedKeys.has('options') && selectedNode.options?.length"
                      class="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {{ selectedNode.options.length }}
                    </span>
                  </div>
                  <Icon
                    name="lucide:chevron-down"
                    size="14"
                    class="shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
                    :class="{ 'rotate-180': expandedKeys.has('options') }"
                  />
                </button>

                <Transition name="fade">
                  <div
                    v-show="expandedKeys.has('options')"
                    :ref="(el) => (propertyRefs['options'] = el as HTMLElement)"
                    class="border-t border-neutral-100 bg-neutral-50/50 p-2.5 dark:border-neutral-700 dark:bg-neutral-900/30"
                  >
                    <div class="flex flex-col gap-3">
                      <div class="flex flex-col gap-2.5">
                        <div
                          v-for="(option, idx) in selectedNode.options || []"
                          :key="idx"
                          class="group flex items-start gap-1.5"
                        >
                          <div
                            class="flex flex-1 flex-col overflow-hidden rounded border border-neutral-200 bg-white shadow-sm transition-colors focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400/20 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                          >
                            <input
                              :value="option.label"
                              @input="
                                (e) =>
                                  updateOptionLabel(
                                    idx as number,
                                    (e.target as HTMLInputElement).value
                                  )
                              "
                              class="w-full border-none bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                              placeholder="Option label (e.g. New York)"
                            />

                            <div class="h-px w-full bg-neutral-100 dark:bg-neutral-700"></div>

                            <input
                              :value="option.value"
                              @input="
                                (e) =>
                                  updateOptionValue(
                                    idx as number,
                                    (e.target as HTMLInputElement).value
                                  )
                              "
                              class="w-full border-none bg-transparent px-2.5 py-1.5 font-mono text-[10px] text-neutral-500 outline-none placeholder:text-neutral-300 focus:ring-0 dark:text-neutral-400 dark:placeholder:text-neutral-600"
                              placeholder="value (e.g. new-york)"
                            />
                          </div>

                          <button
                            @click="removeOption(idx as number)"
                            type="button"
                            class="mt-1 flex size-6 shrink-0 items-center justify-center rounded text-neutral-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:text-neutral-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            title="Remove Option"
                          >
                            <Icon name="lucide:trash-2" class="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        @click="addOption"
                        type="button"
                        class="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.98] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      >
                        <Icon name="lucide:plus" class="size-3.5" />
                        <span>Add Option</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <template v-else-if="getNodeElementType(selectedNode) === 'element'">
                <div
                  class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                >
                  <button
                    @click="toggleExpand('text')"
                    type="button"
                    class="flex w-full items-center justify-between p-3 text-left outline-none"
                  >
                    <div class="flex items-center gap-2 overflow-hidden">
                      <span
                        class="text-xs font-medium text-neutral-700 capitalize dark:text-neutral-300"
                        >Text</span
                      >

                      <span
                        v-if="!expandedKeys.has('text') && selectedNode.text"
                        class="max-w-[120px] truncate text-[10px] text-neutral-400 dark:text-neutral-500"
                      >
                        {{ selectedNode.text || selectedNode.children }}
                      </span>
                    </div>

                    <Icon
                      name="lucide:chevron-down"
                      size="12"
                      class="shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
                      :class="{ 'rotate-180': expandedKeys.has('text') }"
                    />
                  </button>

                  <Transition name="fade">
                    <div
                      v-show="expandedKeys.has('text')"
                      :ref="(el) => (propertyRefs['text '] = el as HTMLElement)"
                      class="border-t border-neutral-100 bg-neutral-50 px-3 pt-2 pb-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                    >
                      <div class="flex flex-col gap-4">
                        <div class="space-y-2">
                          <label
                            class="mb-1.5 block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                          >
                            Text
                          </label>

                          <input
                            v-model="selectedNode.children"
                            class="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
                            placeholder="Enter label..."
                          />
                        </div>

                        <div class="flex flex-1 flex-col">
                          <span class="text-xs font-semibold dark:text-neutral-100"
                            >Customize Text</span
                          >
                          <div
                            class="mt-3 flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-2.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                          >
                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Weight</label
                              >
                              <div class="relative">
                                <select
                                  v-model="elementFontWeight"
                                  class="w-24 appearance-none rounded border border-transparent bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-700 transition-all outline-none hover:bg-neutral-200 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-800 dark:focus:ring-purple-500/30"
                                >
                                  <option value="normal">Regular</option>
                                  <option value="500">Medium</option>
                                  <option value="600">Semibold</option>
                                  <option value="bold">Bold</option>
                                </select>
                                <Icon
                                  name="lucide:chevron-down"
                                  size="10"
                                  class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                                />
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <label
                                class="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"
                                >Fill</label
                              >

                              <div
                                class="flex items-center gap-1.5 rounded border border-neutral-200 bg-white p-1 transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:ring-purple-500/30 dark:hover:border-neutral-600"
                              >
                                <div
                                  class="relative h-4 w-4 overflow-hidden rounded-[3px] border border-neutral-200 shadow-sm dark:border-neutral-600"
                                >
                                  <input
                                    type="color"
                                    v-model="elementTextColor"
                                    class="absolute -inset-2 h-8 w-8 cursor-pointer appearance-none border-0 bg-transparent p-0"
                                  />
                                </div>

                                <input
                                  type="text"
                                  v-model="elementTextColor"
                                  class="w-14 border-none bg-transparent p-0 font-mono text-[10px] text-neutral-700 uppercase outline-none dark:text-neutral-300"
                                  maxlength="7"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </div>

          <div
            v-if="selectedNode.type !== 'submit' && getNodeElementType(selectedNode) === 'input'"
            class="flex flex-col p-4"
          >
            <div class="mb-2 flex items-center gap-1">
              <h3 class="text-xs font-semibold dark:text-neutral-100">Validation</h3>
              <Tooltip position="top">
                <template #trigger>
                  <Icon
                    name="lucide:info"
                    size="12"
                    class="text-neutral-400 dark:text-neutral-500"
                  />
                </template>
                <template #content>
                  <p class="max-w-xs text-[10px] break-all dark:text-neutral-300">
                    Define validation rules for this specific field.
                  </p>
                </template>
              </Tooltip>
            </div>
            <ValidationEditor :node="selectedNode" />
          </div>

          <div
            class="sticky bottom-0 flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
              @click="removeField"
            >
              <Icon name="lucide:trash-2" class="size-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </ContextMenu>
  </div>
</template>

<style scoped>
.ghost-card {
  opacity: 0.5;
  background: #f0f9ff;
  border: 1px dashed #3b82f6;
}

.is-dragging :deep(.group) * {
  pointer-events: none !important;
}

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
