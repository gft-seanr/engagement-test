import { useQuery } from '@tanstack/vue-query';

interface QueryOptions {
  alertMap?: AlertMap<ProgramErrorCode>;
  programId: MaybeRefOrGetter<string>;
}

export function useProgramInfoQuery(options: QueryOptions) {
  const { alertMap } = options;

  const campaign = useCampaignState();

  const reactiveProgramId = computed(() => toValue(options.programId));

  const isEnabled = computed(() => {
    return !!reactiveProgramId?.value;
  });

  const {
    data: programInfoResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
    refetch,
  } = useQuery<ProgramInfoResponse, ProgramError[]>({
    queryKey: ['program', reactiveProgramId, campaign.value.id],
    queryFn: () => getProgramInfo({ programId: reactiveProgramId.value, id: campaign.value.id }),
    enabled: isEnabled,
  });

  const programInfo = computed(() => {
    return programInfoResponse.value?.data || null;
  });

  const alerts = useAlertMap(errors, alertMap);

  const isUnauthorized = useUnauthorizedHandler(errors);

  return {
    programInfo,
    isLoading,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
    refetch,
  };
}
