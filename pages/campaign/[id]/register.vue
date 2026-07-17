<script setup lang="ts">
definePageMeta({
  name: 'register',
});

const { settings } = useSettings();
const route = useRoute();
const pageName = route.name as string;
const page = computed(() => settings.value?.pages[pageName]);
</script>

<template>
  <component
    v-if="settings"
    :is="page.template"
    v-bind.props="{
      ...page.props,
      classes: page.classes,
    }"
  ></component>
</template>
