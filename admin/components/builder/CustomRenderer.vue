<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  section: Section;
  eventHandlers?: Record<string, () => void>;
  noPointerEvents?: boolean;
}

const props = defineProps<Props>();
const { eventHandlers = {} } = props;

const componentKey = computed(() => {
  const schema = props.section?.schema;

  if (!schema || !Array.isArray(schema) || schema.length === 0) {
    return props.section?.id || 'default-key';
  }

  const schemaFingerprint = schema
    .map((node, index) => {
      const id = node.id || node.name || `anon_${index}`;
      const type = node.$formkit || node.$el || 'unknown';
      return `${index}:${id}:${type}`;
    })
    .join('|');

  return `${props.section.id}-${schemaFingerprint}`;
});
</script>

<template>
  <component
    :is="section.component || 'div'"
    :key="componentKey"
    v-bind="{
      ...section.props,
      classes: section.classes,
      sections: section.sections,
      schema: section.schema,
      states: section.states,
      state: section.state,
      alert: section.alert,
      style: section.style,
    }"
    v-bind.attr="{
      ...section.attrs,
      id: section.id,
    }"
    v-on="eventHandlers"
  ></component>
</template>
