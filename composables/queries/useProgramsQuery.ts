import { useQuery } from '@tanstack/vue-query';

interface QueryOptions {
  programId?: string;
  alertMap?: AlertMap<ProgramErrorCode>;
}

export function useProgramsQuery(options: QueryOptions = {}) {
  const { alertMap, programId = '' } = options;

  const campaign = useCampaignState();

  const {
    data: programsResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
  } = useQuery<ProgramResponse, ProgramError[]>({
    queryKey: ['programs', campaign.value.id, ...(programId ? [programId] : [])],
    queryFn: () => getPrograms({ id: campaign.value.id, programId }),
  });

  const programs = computed(() => {
    if (!programsResponse.value?.data?.programs?.length) {
      return [];
    }

    return (
      programsResponse.value?.data?.programs
        .slice()
        .sort((a, b) => +b.ordinalPosition - +a.ordinalPosition) || []
    );
  });

  const userInfo = computed(() => {
    return programsResponse.value?.data?.user || null;
  });

  const alerts = useAlertMap(errors, alertMap);

  const isUnauthorized = useUnauthorizedHandler(errors);

  return {
    programs,
    userInfo,
    isLoading,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
  };
}
