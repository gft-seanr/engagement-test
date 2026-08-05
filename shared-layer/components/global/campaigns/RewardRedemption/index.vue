<!--
  CAMPAIGN REWARD REDEMPTION STANDARD Campaign Template

  Purpose: Reward redemption template with simple state management

  Key Features:
  - Displays sections based on current state
  - Provides redeem handler to child components
  - Success state switching on redemption completion

  Flow:
  1. Renders sections for current state
  2. Child section calls handleRedeemSuccess() when redemption succeeds
  3. Switches to 'success' state to show success sections

  Layout: Flex column layout with transitions between states

  Usage:  Campaigns  or Redemption Form where users can redeem rewards and see success confirmation

  Todo: Add Expired state handling if needed
-->
<script setup lang="ts">
interface Props {
  sections: Array<Section>;
  states: Array<string>;
  classes?: {
    outer?: string;
  };
}

const { sections, states } = defineProps<Props>();

const { setSectionState, visibleSections } = useSectionState(states, sections);

function handleRedeemSuccess() {
  setSectionState('success');
}

provide('redeem', {
  handleRedeemSuccess,
});
</script>
<template>
  <TransitionGroup
    name="list"
    tag="div"
    class="flex flex-col gap-8"
    :class="cn('flex flex-col gap-8', classes?.outer)"
  >
    <SectionRenderer v-for="section in visibleSections" :key="section.id" :section />
  </TransitionGroup>
</template>
