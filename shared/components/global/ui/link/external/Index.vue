<script lang="ts" setup>
import { type HTMLAttributes } from 'vue';

interface LinkProps {
  label: string;
  destination: string;
  prefixIcon?: string;
  suffixIcon?: string;
}

type Classes = NestedClasses<LinkProps> & {
  outer?: HTMLAttributes['class'];
};

interface Props extends LinkProps {
  classes?: Classes;
}

const { label, destination, prefixIcon, suffixIcon } = defineProps<Props>();
</script>
<template>
  <div :class="cn('flex justify-center', classes?.outer)" v-if="destination">
    <a
      :class="
        cn(
          'flex items-center gap-1 rounded-md border border-primary px-3 py-2 text-xs text-primary hover:shadow-md dark:border-primary-dark dark:text-primary-dark',
          classes?.destination
        )
      "
      v-bind.attrs="$attrs"
      :href="destination"
      target="_blank"
    >
      <Icon v-if="prefixIcon" :name="prefixIcon" :class="classes?.prefixIcon" />

      <Markdown tag="span" :content="label" :class="classes?.label" />

      <Icon v-if="suffixIcon" :name="suffixIcon" :class="classes?.suffixIcon" />
    </a>
  </div>
</template>
