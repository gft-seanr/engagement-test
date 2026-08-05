<script setup lang="ts">
interface LinkProps {
  label: string;
  destination: string;
}

interface Classes extends NestedClasses<LinkProps> {
  outer?: string;
  wrapper?: string;
}

interface Props extends LinkProps {
  classes?: Classes;
}

defineProps<Props>();

const campaign = useCampaignState();
</script>
<template>
  <div :class="cn('flex items-center justify-center', classes?.outer)">
    <NuxtLink
      v-bind="$attrs"
      :to="`/campaign/${campaign.id}${destination}`"
      :class="
        cn(
          'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-primary bg-white px-4 text-lg font-bold text-primary hover:shadow-md focus:ring-2 focus:outline-none',
          classes?.wrapper
        )
      "
    >
      <span :class="classes?.label">{{ label }}</span>
    </NuxtLink>
  </div>
</template>
