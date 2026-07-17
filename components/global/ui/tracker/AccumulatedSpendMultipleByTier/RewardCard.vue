<script setup lang="ts">
import { cva } from 'class-variance-authority';

const props = defineProps<{
  status: 'locked' | 'pending' | 'active';
  title: string;
  description: string;
  giftUrl?: string;
}>();

const cardVariants = cva('rounded-2xl border', {
  variants: {
    status: {
      expired: 'border-border-neutral bg-surface-primary',
      locked: 'border-border-neutral bg-surface-primary',
      pending: 'border-success bg-success-soft',
      active: 'border-success bg-success-soft',
    },
  },
});

const cardIconVariants = cva(
  'flex size-10 items-center justify-center rounded-lg border border-border-neutral',
  {
    variants: {
      status: {
        expired: 'bg-surface-disable text-text-primary',
        locked: 'bg-surface-disable text-text-primary',
        pending: 'bg-success text-white',
        active: 'bg-success text-white',
      },
    },
  }
);

const cardFooterVariants = cva(
  'block w-full rounded-b-[15px] border-t border-border-neutral px-4 py-2 text-center text-sm font-bold',
  {
    variants: {
      status: {
        expired: 'bg-surface-disable text-text-primary',
        locked: 'bg-surface-disable text-text-primary',
        pending: 'bg-success text-white',
        active: 'cursor-pointer bg-success text-white hover:opacity-90',
      },
    },
  }
);

const footerText = computed(() => {
  switch (props.status) {
    case 'locked':
      return 'Locked';
    case 'pending':
      return 'To be awarded soon';
    case 'active':
      return 'Open Gift';
  }
});

const cardIcon = computed(() => {
  switch (props.status) {
    case 'locked':
      return 'lucide:lock';
    case 'pending':
    case 'active':
      return 'lucide:star';
  }
});
</script>

<template>
  <article :class="cn(cardVariants({ status }))">
    <div class="flex items-center gap-x-4 p-4 pt-3.5">
      <div :class="cn(cardIconVariants({ status }))">
        <Icon :name="cardIcon" :size="24" />
      </div>

      <div class="flex flex-col">
        <p class="font-bold text-text-primary">
          {{ props.title }}
        </p>
        <p class="text-xs text-text-secondary">
          {{ props.description }}
        </p>
      </div>
    </div>

    <a
      :href="props?.giftUrl ? `https://gft.ph/${props.giftUrl}` : undefined"
      :target="props?.giftUrl"
      :class="cn(cardFooterVariants({ status }))"
    >
      {{ footerText }}
    </a>
  </article>
</template>
