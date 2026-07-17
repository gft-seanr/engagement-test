<script setup lang="ts">
interface Props {
  alert?: {
    map: AlertMap<ProgramErrorCode>;
  };
  programs: ProgramConfig[];
}

const { alert, programs } = defineProps<Props>();

const campaign = useCampaignState();

const {
  isPending,
  isError,
  alerts,
  programs: programList,
} = useProgramsQuery({
  alertMap: alert?.map,
  programId: campaign.value.programId,
});

const mappedPrograms = computed(() => {
  return programList.value
    .map((program) => {
      return {
        ...program,
        ...programs.find((p) => p.programId === program.programId),
      };
    })
    .filter((program) => program.component)
    .sort((a, b) => {
      return Number(a.ordinalPosition) - Number(b.ordinalPosition);
    });
});
</script>
<template>
  <div class="min-h-50">
    <alert-hero-centered v-if="isError && alerts" :alert="alerts[0]"> </alert-hero-centered>

    <template v-else-if="isPending">
      <div class="py-10 text-center text-primary">
        <Icon name="lucide:loader-circle" class="animate-spin text-2xl" />
      </div>
    </template>
    <div v-else-if="mappedPrograms.length">
      <Component
        v-for="program in mappedPrograms"
        :is="program.component"
        :key="program.programId"
        v-bind="program"
      />
    </div>
  </div>
</template>
