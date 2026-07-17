<script lang="ts" setup>
interface Props {
  section: Section;
  eventHandlers?: Record<string, () => void>;
}

const { eventHandlers = {} } = defineProps<Props>();
</script>
<template>
  <component
    :is="section.component || 'div'"
    :key="section.id"
    v-bind.prop="{
      ...section.props,
      classes: section.classes,
      sections: section.sections,
      schema: section.schema,
      states: section.states,
      state: section.state,
      alert: section.alert,
    }"
    v-bind.attr="{
      ...section.attrs,
      id: section.id,
    }"
    v-on="eventHandlers"
  ></component>
</template>
