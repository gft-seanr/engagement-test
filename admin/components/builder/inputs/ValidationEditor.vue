<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import Tooltip from '~admin/components/admin-ui/Tooltip.vue';

const props = defineProps<{
  node: any;
}>();

if (props.node.validation === undefined) props.node.validation = '';
if (props.node.validationMessages === undefined) props.node.validationMessages = {};

const showAddForm = ref(false);

const showArgField = computed(() => {
  const included = ['min', 'max', 'matches', 'length'];
  return included.includes(selectedNewRule.value);
});

const availableRules = [
  { value: 'required' },
  { value: 'email' },
  { value: 'matches', placeholder: 'ex: ^[A-Za-z]+$' }, // Regex example
  { value: 'min', placeholder: 'ex: 8' },
  { value: 'max', placeholder: 'ex: 255' },
  { value: 'length', placeholder: 'ex: 5,6 (min,max)' },
  { value: 'url' },
  { value: 'alpha' },
  { value: 'number' },
  { value: 'consent' },
  { value: 'accepted' },
];

const argPlaceholder = computed(() => {
  const currentRule = availableRules.find((r) => r.value === selectedNewRule.value);
  return currentRule?.placeholder || 'Enter value';
});

const selectedNewRule = ref('required');
const newRuleArg = ref('');

// Helper to extract "min" from "min:5"
const getRuleName = (ruleString: string) => {
  if (!ruleString) return '';
  return ruleString.split(':')[0].trim();
};

const validationRules = computed({
  get: () => {
    if (!props.node.validation) return [];
    return String(props.node.validation).split('|').filter(Boolean);
  },
  set: (newRules: string[]) => {
    props.node.validation = newRules.join('|');
  },
});

function addRule() {
  let rule = selectedNewRule.value;
  const arg = newRuleArg.value?.trim();

  if (arg) {
    rule = `${rule}:${arg}`;
  }

  // Prevent duplicates
  if (!validationRules.value.some((r) => getRuleName(r) === selectedNewRule.value)) {
    validationRules.value = [...validationRules.value, rule];
  }

  newRuleArg.value = '';
  selectedNewRule.value = 'required';
  showAddForm.value = false;
}

function removeRule(index: number) {
  const rules = [...validationRules.value];
  const ruleToRemove = rules[index];

  // Remove rule from list
  rules.splice(index, 1);
  validationRules.value = rules;

  const ruleName = getRuleName(ruleToRemove);
  if (props.node.validationMessages?.[ruleName]) {
    delete props.node.validationMessages[ruleName];
  }
}

const expandedKeys = ref(new Set<string>());
const validationEls = ref<Array<HTMLElement | null>>([]);

function toggleExpand(key: string) {
  if (expandedKeys.value.has(key)) expandedKeys.value.delete(key);
  else expandedKeys.value.add(key);
}
watch(
  expandedKeys,
  async () => {
    await nextTick();
    const keys = Array.from(expandedKeys.value);

    if (!keys.length) return;

    const lastKey = keys[keys.length - 1];
    const idx = Number(lastKey);
    const el = validationEls.value[idx];

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1.5 dark:bg-neutral-900/50">
      <div
        v-if="validationRules.length > 0"
        v-for="(rule, index) in validationRules"
        :key="index"
        :ref="(el) => (validationEls[index] = el as HTMLElement)"
        class="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-800"
        :class="{
          'hover:border-neutral-300 dark:hover:border-neutral-600': !expandedKeys.has(
            String(index)
          ),
        }"
      >
        <button
          type="button"
          @click="toggleExpand(String(index))"
          class="flex w-full items-center justify-between p-3 text-left outline-none select-none"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <div class="flex items-baseline gap-1">
              <span class="text-xs font-medium text-neutral-700 capitalize dark:text-neutral-300">
                {{ getRuleName(rule) }}
              </span>
              <span
                v-if="rule.includes(':')"
                class="font-mono text-[10px] text-neutral-400 dark:text-neutral-500"
              >
                {{ `(${rule.split(':')[1]})` }}
              </span>
            </div>

            <span
              v-if="!expandedKeys.has(String(index)) && node.validationMessages[getRuleName(rule)]"
              class="max-w-[120px] truncate text-[10px] text-neutral-400 dark:text-neutral-500"
            >
              — {{ node.validationMessages[getRuleName(rule)] }}
            </span>
          </div>

          <Icon
            name="lucide:chevron-down"
            size="12"
            class="shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500"
            :class="{ 'rotate-180': expandedKeys.has(String(index)) }"
          />
        </button>

        <Transition name="fade">
          <div
            v-show="expandedKeys.has(String(index))"
            class="border-t border-neutral-100 bg-neutral-50 px-3 pt-2 pb-3 dark:border-neutral-700 dark:bg-neutral-800/50"
          >
            <label
              class="mb-1.5 block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
            >
              Custom Error Message
            </label>

            <input
              v-model="node.validationMessages[getRuleName(rule)]"
              placeholder="e.g. This field is required"
              class="w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
            />

            <div class="mt-3 flex justify-end">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/50"
                @click="removeRule(index)"
              >
                <Icon name="lucide:trash-2" size="12" />
                Remove Rule
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <button
        v-show="!showAddForm"
        @click="showAddForm = true"
        type="button"
        class="group flex w-full items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white/50 px-3 py-2 text-neutral-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
      >
        <div
          class="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white group-hover:border-purple-400 group-hover:text-purple-600 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:border-purple-500/50 dark:group-hover:text-purple-400"
        >
          <Icon name="lucide:plus" class="size-3" />
        </div>
        <span class="text-xs font-medium">Add Rule</span>
      </button>

      <div
        v-if="showAddForm"
        class="mt-2 rounded-md border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label
              class="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500"
            >
              Rule
            </label>

            <select
              v-model="selectedNewRule"
              class="w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-purple-500/30"
              aria-label="Select validation rule"
            >
              <option v-for="r in availableRules" :key="r.value" :value="r.value">
                {{ r.value.charAt(0).toUpperCase() + r.value.slice(1) }}
              </option>
            </select>
          </div>

          <div v-if="showArgField" class="flex flex-col gap-1">
            <div class="flex items-center gap-1">
              <label
                class="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500"
              >
                Argument
              </label>
              <Tooltip
                text="Argument for the validation rule, e.g. minimum length for 'min' rule or regex for 'matches'"
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

            <input
              v-model="newRuleArg"
              :placeholder="argPlaceholder"
              class="w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-purple-500/30"
            />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              @click="addRule"
              type="button"
              class="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700 dark:hover:bg-purple-500"
            >
              Add Rule
            </button>

            <button
              @click="
                () => {
                  showAddForm = false;
                  newRuleArg = '';
                  selectedNewRule = 'required';
                }
              "
              type="button"
              class="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
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
