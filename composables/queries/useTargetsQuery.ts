import { useQuery } from '@tanstack/vue-query';

export function useTargetsQuery(programId: Ref<string>, alertMap?: AlertMap<TargetErrorCode>) {
  const {
    data: targetsResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
  } = useQuery<TargetResponse, TargetError[]>({
    queryKey: ['targets', programId],
    queryFn: () => getTargets({ programId: programId.value }),
  });

  const alerts = useAlertMap(errors, alertMap);

  const targets = computed(
    () =>
      targetsResponse.value?.data?.targets
        .slice()
        .sort((a, b) => +b.ordinalPosition - +a.ordinalPosition) || []
  );

  const isUnauthorized = useUnauthorizedHandler(errors);

  return {
    targets,
    isLoading,
    isPending,
    isError,
    isUnauthorized,
    errors,
    alerts,
  };
}
