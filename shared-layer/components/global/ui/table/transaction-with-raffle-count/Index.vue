<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

interface TransactionWithRaffleCountProps extends TransactionTableProps {
  raffleCountUnit: [string, string];
}

interface Classes extends NestedClasses<TransactionWithRaffleCountProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends TransactionWithRaffleCountProps {
  classes?: Classes;
}

const { itemsPerPage = 10 } = defineProps<Props>();

const { transactions, isPending, alerts, isError, showMore, hasMoreItems, visibleTransactions } =
  useTransactionsQuery({ itemsPerPage });
</script>
<template>
  <div :class="cn(classes?.outer)">
    <div :class="cn(classes?.wrapper)">
      <p
        :class="cn('text-neutral-black font-heading text-2xl font-bold', classes?.title)"
        v-if="title"
      >
        {{ title }}
      </p>

      <p :class="cn('text-sm text-text-secondary', classes?.description)" v-if="description">
        {{ description }}
      </p>
    </div>
    <template v-if="isPending">
      <div
        class="mt-8 flex animate-pulse items-center justify-between"
        v-for="index in 5"
        :key="index"
      >
        <div>
          <div class="mb-2 h-4 w-48 rounded bg-gray-300"></div>
          <div class="h-3 w-32 rounded bg-gray-200"></div>
        </div>
        <div class="flex flex-col items-end text-right">
          <div class="mb-2 h-4 w-20 rounded bg-gray-300"></div>
          <div class="h-3 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </template>
    <template v-else-if="isError && alerts.length">
      <alert-hero-centered :alert="alerts[0]" class="min-h-80 justify-center"></alert-hero-centered>
    </template>
    <template v-else-if="transactions?.length === 0">
      <div
        :class="
          cn('mt-4 flex min-h-80 justify-center pt-10 text-text-muted', classes?.emptyMessage)
        "
      >
        <p>{{ emptyMessage || 'You have no transactions yet.' }}</p>
      </div>
    </template>
    <template v-else>
      <div
        class="mt-6 flex w-full items-start justify-between gap-4"
        v-for="(transaction, index) in visibleTransactions"
        :key="index"
      >
        <div class="basis-2/3 truncate text-left">
          <p class="text-neutral-black overflow-hidden font-bold text-ellipsis">
            {{ transaction.description }}
          </p>

          <p class="mt-2 text-sm font-semibold">P{{ transaction.amount.toLocaleString() }}</p>

          <div class="mt-2 text-xs text-text-secondary">
            <NuxtTime
              :datetime="transaction.transactionDateTime"
              year="numeric"
              month="short"
              day="numeric"
            />
          </div>
        </div>
        <div class="shrink-0 basis-1/3 text-right" v-if="transaction.amount">
          <p class="flex w-full items-center justify-end font-semibold whitespace-nowrap">
            <Icon name="lucide:plus" class="text-green-500" />
            {{ transaction.raffleEntries }}
            {{ transaction.raffleEntries > 1 ? raffleCountUnit[1] : raffleCountUnit[0] }}
          </p>
          <div class="mt-2 text-xs leading-5 whitespace-nowrap text-text-secondary">
            <span v-if="additionalReference"> {{ transaction[additionalReference] }} • </span>
            {{ transaction.referenceNo }}
          </div>
        </div>
      </div>
      <button
        class="mx-auto mt-8 block rounded-full bg-surface-disable px-4 py-3 text-sm text-text-primary hover:cursor-pointer"
        v-if="hasMoreItems"
        @click="showMore"
      >
        Show More
      </button>
    </template>
  </div>
</template>
