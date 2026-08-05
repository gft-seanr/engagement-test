<!--
  Submission of Information Template

  Purpose: Simple Submission template with simple state management

  Key Features:
  - Displays sections based on current state
  - Provides submit handler to child components
  - Success state switching on submission completion

  Flow:
  1. Renders sections for current state
  2. Child section calls handleSubmitSuccess() when redemption succeeds
  3. Switches to 'success' state to show success sections

  Layout: Flex column layout with transitions between states

  Usage:  Campaigns  or Submission Form where users can submit infos and see success confirmation

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

const campaign = useCampaignState();
const { setSectionState, visibleSections } = useSectionState(states, sections);

function handleSubmitSuccess() {
  setSectionState('success');
}

provide('submit', {
  handleSubmitSuccess,
});

watch(
  () => campaign.value.isRegistrationClosed,
  (isClosed) => {
    if (isClosed) {
      setSectionState('expired');
    }
  },
  { immediate: true }
);
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
