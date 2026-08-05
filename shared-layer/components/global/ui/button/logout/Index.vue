<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

interface LogoutProps {
  label: string;
  prefixIcon?: string;
  suffixIcon?: string;
}

interface Classes extends NestedClasses<LogoutProps> {
  outer?: HTMLAttributes['class'];
  input: HTMLAttributes['class'];
}

interface Props extends LogoutProps {
  classes?: Classes;
}
defineProps<Props>();

const queryClient = useQueryClient();
const campaign = useCampaignState();
const { isPending, handleLogout } = useLogoutMutation(handleLogoutSuccess);

async function handleLogoutSuccess() {
  navigateTo(`/campaign/${campaign.value.id}/login`);
  await queryClient.clear();
}
</script>
<template>
  <div :class="cn('flex w-full items-center justify-center', classes?.outer)">
    <button
      :class="
        cn(
          'flex cursor-pointer items-center gap-1 text-sm underline-offset-4 hover:underline',
          classes?.input
        )
      "
      type="button"
      @click="handleLogout"
    >
      <Icon v-if="prefixIcon && !isPending" :name="prefixIcon" :class="classes?.prefixIcon" />
      <Markdown tag="span" :content="label" :class="classes?.label" />
      <Icon v-if="suffixIcon && !isPending" :name="suffixIcon" :class="classes?.suffixIcon" />

      <Icon v-if="isPending" name="lucide:loader-circle" class="animate-spin" />
    </button>
  </div>
</template>
