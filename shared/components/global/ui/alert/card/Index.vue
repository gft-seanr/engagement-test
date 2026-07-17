<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Alertprops {
  alerts: Alert[];
  hasIcon?: boolean;
}

interface Classes {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
  inner?: HTMLAttributes['class'];
  hasIcon?: HTMLAttributes['class'];
  alerts?: Record<Alert['type'], HTMLAttributes['class']>;
}

interface Props extends Alertprops {
  classes?: Classes;
}

const { alerts, classes, hasIcon = false } = defineProps<Props>();

const getWrapperClass = (alert: Alert) => {
  switch (alert.type) {
    case 'error':
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    case 'success':
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    case 'warning':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    case 'info':
      return 'border-gray-300 bg-gray-50 dark:bg-gray-900/20';
    default:
      return '';
  }
};

const getIconClass = (alert: Alert) => {
  switch (alert.type) {
    case 'error':
      return 'text-red-500';
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-orange-500';
    case 'info':
      return 'text-gray-500';
    default:
      return '';
  }
};

const getIcon = (alert: Alert) => {
  if (alert.icon) {
    return alert.icon;
  }

  switch (alert.type) {
    case 'error':
      return 'lucide:triangle-alert';
    case 'success':
      return 'lucide:check';
    case 'warning':
      return 'lucide:circle-alert';
    case 'info':
      return 'lucide:info';
    default:
      return '';
  }
};
</script>

<template>
  <div :class="cn('flex flex-col gap-4', classes?.outer)" v-if="alerts.length">
    <div
      v-for="alert in alerts"
      :key="alert.title"
      :class="
        cn(
          'flex items-start rounded-lg border p-4 text-sm',
          getWrapperClass(alert),
          classes?.wrapper
        )
      "
    >
      <Icon
        v-if="hasIcon"
        :name="getIcon(alert)"
        :class="cn('mr-3 shrink-0', getIconClass(alert), classes?.alerts?.[alert.type].icon)"
        :size="alert.iconSize || 24"
      />

      <div :class="cn('flex flex-col gap-2', classes?.inner)">
        <Markdown
          v-if="alert.title"
          :class="cn('font-bold', classes?.alerts?.[alert.type].title)"
          :content="alert.title"
          tag="p"
        />
        <Markdown
          v-if="alert.description"
          :class="
            cn('flex flex-col gap-2 text-text-secondary', classes?.alerts?.[alert.type].description)
          "
          :content="alert.description"
          tag="div"
        />
      </div>
    </div>
  </div>
</template>
