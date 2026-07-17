<script setup lang="ts">
interface Props {
  programs: ProgramConfig[];
  selectLabel?: string;
}

const { programs, selectLabel = 'Select your card' } = defineProps<Props>();

const campaign = useCampaignState();

const {
  isLoading: isProgramsLoading,
  alerts: programsAlerts,
  programs: programList,
} = useProgramsQuery({
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

const { isLoading: isCardsLoading, alerts: cardAlerts, cards } = useCardsQuery();

// Alerts and loading states
const { alerts, hasAlerts } = useAlertCollection(cardAlerts, programsAlerts);
const hasLoading = useIsLoading([isProgramsLoading, isCardsLoading]);

const { activeCard, cardOptions } = useCardTypeSelection();

function useCardTypeSelection() {
  const activeCard = ref<string | null>(null);

  const cardOptions = computed(() => {
    return cards.value.map((card) => {
      return {
        label: card.cardType,
        value: card.cardType,
      };
    });
  });

  watch(
    cards,
    (newCards) => {
      if (newCards.length && !activeCard.value) {
        activeCard.value = newCards[0].cardType;
      }
    },
    { immediate: true }
  );

  return {
    activeCard,
    cardOptions,
  };
}
</script>
<template>
  <div class="min-h-86">
    <alert-hero-centered v-if="hasAlerts" :alert="alerts[0]"> </alert-hero-centered>

    <template v-else-if="hasLoading">
      <div class="py-10 text-center text-primary">
        <Icon name="lucide:loader-circle" class="animate-spin text-2xl" />
      </div>
    </template>
    <div v-else-if="mappedPrograms.length && cards.length">
      <p class="mb-4 text-center text-sm text-text-secondary">{{ selectLabel }}</p>
      <Select v-model="activeCard">
        <SelectTrigger
          class="h-12! w-full rounded-full border-border-neutral px-5 dark:bg-surface-raised"
        >
          <SelectValue class="text-lg font-bold" />
        </SelectTrigger>
        <SelectContent
          @close-auto-focus="(e: Event) => e.preventDefault()"
          class="rounded-2xl border-border-neutral"
        >
          <SelectItem
            class="h-11.5 rounded-lg px-4.5 text-base text-text-secondary [&_svg]:size-5 [&_svg]:text-primary"
            v-for="card in cardOptions"
            :key="card.value"
            :value="card.value"
          >
            {{ card.label }}
          </SelectItem>
        </SelectContent>
      </Select>
      <div class="mt-4">
        <Component
          v-for="program in mappedPrograms"
          :is="program.component"
          :key="program.programId"
          :cardType="activeCard"
          v-bind="program"
        />
      </div>
    </div>
  </div>
</template>
