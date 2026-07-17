import { useQuery, useQueryClient } from '@tanstack/vue-query';

interface QueryOptions {
  programId?: string;
  alertMap?: AlertMap<TokenErrorCode>;
  isEnabled?: boolean;
}

export function useTokensQuery(options: QueryOptions = {}) {
  const { programId, alertMap, isEnabled = true } = options;
  const campaign = useCampaignState();
  const queryClient = useQueryClient();

  const {
    data: tokensResponse,
    isLoading,
    isPending,
    isFetching,
    isError,
    error: errors,
    refetch,
  } = useQuery<TokenResponse, TokenError[]>({
    queryKey: ['tokens', campaign.value.id, programId],
    queryFn: () => getTokens({ id: campaign.value.id, programId }),
    enabled: isEnabled,
  });

  const tokens = computed(() => tokensResponse.value?.data?.tokens || []);

  const totalCount = computed(() => tokensResponse.value?.data?.totalCount || 0);

  const highestTierToken = computed(() => {
    if (!tokens.value.length) return undefined;

    return tokens.value.reduce((previous, current) => {
      return (previous.tier || 0) > (current.tier || 0) ? previous : current;
    });
  });

  function updateToken(newToken: Token) {
    queryClient.setQueryData(
      ['tokens', campaign.value.id, programId],
      (tokenResponse: TokenResponse) => {
        const mappedTokens = tokenResponse.data?.tokens.map((oldToken) => {
          if (oldToken.tokenId === newToken.tokenId) {
            return newToken;
          }
          return oldToken;
        });

        return {
          ...tokenResponse,
          data: { tokens: mappedTokens },
        };
      }
    );
  }

  const alerts = useAlertMap(errors, alertMap);

  const isUnauthorized = useUnauthorizedHandler(errors);

  return {
    tokens,
    totalCount,
    highestTierToken,
    isLoading,
    isPending,
    isFetching,
    isError,
    errors,
    alerts,
    isUnauthorized,
    refetch,
    updateToken,
  };
}
