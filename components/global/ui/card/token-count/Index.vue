<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface CardProps {
  title?: string;
  iconUrl?: string;
  singularUnit: string;
  pluralUnit: string;
  footer: string;
}

interface Classes extends NestedClasses<CardProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CardProps {
  classes?: Classes;
}

defineProps<Props>();

const { totalCount, isPending } = useTokensQuery();

const { serverDateTime } = useSettings();
</script>

<template>
  <div
    :class="
      cn('overflow-hidden rounded-lg rounded-tl-[1.5rem] border border-black/16', classes?.outer)
    "
  >
    <Markdown
      v-if="title"
      :class="
        cn(
          'border-b border-black/16 bg-accent-900 p-2 text-center text-xs text-white',
          classes?.title
        )
      "
      :content="title"
    />

    <div
      :class="
        cn(
          'center flex items-center justify-between gap-2 bg-accent-700 px-5 text-white xs:gap-4',
          classes?.wrapper
        )
      "
    >
      <template v-if="isPending">
        <div class="animate-pulse space-y-2 py-6">
          <div class="h-8 w-32 rounded bg-gray-300"></div>
          <div class="h-4 w-48 rounded bg-gray-200"></div>
        </div>
      </template>
      <div v-else class="space-y-2 py-6">
        <p class="font-heading text-xl font-bold xs:text-2xl">
          <span class="mr-2 inline-block">{{ totalCount.toLocaleString() }}</span>
          <span>{{ totalCount > 1 ? pluralUnit : singularUnit }}</span>
        </p>
        <p class="text-xs">
          Your {{ pluralUnit.toLocaleLowerCase() }} as of
          <NuxtTime :datetime="serverDateTime" year="numeric" month="short" day="numeric" />.
        </p>
      </div>
      <NuxtImg :src="iconUrl" class="h-16"></NuxtImg>
    </div>
  </div>
</template>
