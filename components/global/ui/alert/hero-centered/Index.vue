<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';

interface AlertProps {
  title?: string;
  description?: string;
  icon?: string;
  iconSize?: number;
  variant?: Alert['type'];
  alert?: Alert;
  circled?: boolean;
}

interface Classes extends NestedClasses<AlertProps> {
  outer?: HTMLAttributes['class'];
  iconVariant?: Record<Alert['type'], HTMLAttributes['class']>;
}

interface Props extends AlertProps {
  classes?: Classes;
}

const {
  title,
  description,
  variant,
  alert,
  icon,
  iconSize = 80,
  circled,
  classes,
} = defineProps<Props>();

// Alert icon mappings
const variants = {
  error: {
    icon: 'lucide:circle-alert',
    circledIcon: 'lucide:x',
  },
  success: {
    icon: 'lucide:circle-check',
    circledIcon: 'lucide:check',
  },
  warning: {
    icon: 'lucide:info',
    circledIcon: 'lucide:info',
  },
  info: {
    icon: 'lucide:info',
    circledIcon: 'lucide:info',
  },
} as const;

const alertVariant = computed(() => variant || alert?.type);

const mappedIcon = computed(() => {
  if (icon) return icon;
  if (!alertVariant.value) return '';

  const variantConfig = variants[alertVariant.value];
  return circled ? variantConfig?.circledIcon : variantConfig?.icon || '';
});

const mappedIconSize = computed(() => {
  if (iconSize !== undefined) return iconSize;
  return circled ? 40 : 80;
});

const iconVariants = cva('flex size-full items-center justify-center', {
  variants: {
    variant: {
      error: classes?.iconVariant?.error || 'text-danger',
      success: classes?.iconVariant?.success || 'text-success',
      warning: classes?.iconVariant?.warning || 'text-warning',
      info: classes?.iconVariant?.info || 'text-neutral-500',
    },
    circled: {
      true: 'rounded-full border border-border-neutral p-4 text-white',
    },
  },
  compoundVariants: [
    {
      variant: 'error',
      circled: true,
      class: 'bg-danger',
    },
    {
      variant: 'success',
      circled: true,
      class: 'bg-success',
    },
    {
      variant: 'warning',
      circled: true,
      class: 'bg-warning',
    },
    {
      variant: 'info',
      circled: true,
      class: 'bg-neutral-500',
    },
  ],
});

const iconClass = computed(() => {
  return cn(
    iconVariants({
      variant: alertVariant.value,
      circled,
    }),
    classes?.icon
  );
});

const mappedTitle = computed(() => title || alert?.title);
const mappedDescription = computed(() => description || alert?.description);
</script>
<template>
  <div :class="cn('flex flex-col items-center justify-center gap-4 text-center', classes?.outer)">
    <div v-if="mappedIcon" class="relative flex size-20 items-center justify-center">
      <div
        v-if="circled"
        class="absolute inset-0 size-full rounded-full bg-linear-to-b from-white to-transparent opacity-24"
      ></div>

      <div :class="iconClass">
        <Icon :name="mappedIcon" :size="mappedIconSize" />
      </div>
    </div>

    <Markdown
      v-if="mappedTitle"
      :class="cn('font-heading text-[1.75rem] font-bold', classes?.title)"
      :content="mappedTitle"
      tag="h2"
    />

    <Markdown
      v-if="mappedDescription"
      :class="
        cn(
          'flex flex-col gap-4 text-sm leading-7 text-text-secondary *:text-pretty',
          classes?.description
        )
      "
      :content="mappedDescription"
      tag="div"
    />
  </div>
</template>
