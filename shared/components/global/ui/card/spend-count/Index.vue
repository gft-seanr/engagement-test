<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface CardProps {
  title?: string;
  description?: string;
  iconUrl?: string;
  amountCurrency?: string;
  amountDescription?: string;
}

interface Classes extends NestedClasses<CardProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
  amountWrapper?: HTMLAttributes['class'];
}

interface Props extends CardProps {
  classes?: Classes;
}

defineProps<Props>();

const { totalAmount, isPending } = useTransactionsQuery();
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
          'center flex items-center justify-between gap-2 bg-accent-700 px-5 text-white',
          classes?.wrapper
        )
      "
    >
      <template v-if="isPending">
        <div class="animate-pulse space-y-4 py-6">
          <div class="flex flex-col gap-2">
            <div class="h-8 w-32 rounded bg-gray-300"></div>
            <div class="h-4 w-32 rounded bg-gray-300"></div>
          </div>
          <div class="h-8 w-48 rounded bg-gray-200"></div>
        </div>
      </template>
      <div v-else class="space-y-4 py-6">
        <div :class="classes?.amountWrapper">
          <p class="flex gap-2 font-heading text-2xl font-bold">
            <span :class="classes?.amountCurrency">
              {{ amountCurrency || 'P' }}{{ totalAmount.toLocaleString() }}
            </span>
          </p>
          <Markdown
            tag="p"
            :content="amountDescription || 'Total Spend'"
            :class="cn('text-xs text-pretty', classes?.amountDescription)"
          />
        </div>

        <Markdown
          v-if="description"
          :content="description"
          tag="p"
          :class="cn('text-xs text-pretty', classes?.amountDescription)"
        />
      </div>
      <NuxtImg :src="iconUrl" :imgAttrs="{ height: '96' }" :class="classes?.iconUrl"></NuxtImg>
    </div>
  </div>
</template>
