<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

interface HeadingProps {
  title: string;
  description?: string;
  overline?: string;
  link?: {
    destination: string;
    label: string;
  };
}

interface Classes extends NestedClasses<HeadingProps> {
  outer?: HTMLAttributes['class'];
}

interface Props extends HeadingProps {
  classes?: Classes;
}

defineProps<Props>();
</script>
<template>
  <div :class="cn('text-center', classes?.outer)">
    <Markdown
      v-if="overline"
      :content="overline"
      :class="cn('mb-1 text-xl leading-8 text-text-secondary', classes?.overline)"
      tag="div"
    />
    <Markdown
      :content="title"
      tag="h1"
      :class="cn('font-heading text-4xl leading-8 font-bold', classes?.title)"
    />
    <Markdown
      :content="description"
      :class="
        cn('mt-3 flex flex-col gap-2 text-sm leading-7 text-text-secondary', classes?.description)
      "
    />

    <a
      v-if="link"
      :href="link.destination"
      :class="
        cn('mt-4 text-xs text-gray-400 underline underline-offset-2', classes?.link?.destination)
      "
    >
      <Markdown :content="link.label" tag="span" :class="classes?.link?.label" />
    </a>
  </div>
</template>
