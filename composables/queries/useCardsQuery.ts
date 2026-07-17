import { useQuery } from '@tanstack/vue-query';

interface QueryOptions {
  programId?: string;
  alertMap?: AlertMap<CardErrorCode>;
}

export function useCardsQuery(options: QueryOptions = {}) {
  const { alertMap, programId = '' } = options;

  const campaign = useCampaignState();

  const {
    data: cardsResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
  } = useQuery<CardResponse, CardError[]>({
    queryKey: ['cards', campaign.value.id],
    queryFn: () => getCards({ id: campaign.value.id }),
  });

  const cards = computed(() => {
    if (!cardsResponse.value?.data?.cards?.length) {
      return [];
    }

    return cardsResponse.value.data.cards;
  });

  const alerts = useAlertMap(errors, alertMap);

  const isUnauthorized = useUnauthorizedHandler(errors);

  return {
    cards,
    isLoading,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
  };
}
