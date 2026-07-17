import { useMutation } from '@tanstack/vue-query';

export function useRedeemMutation(
  handleRedeemSuccess: (data: RedeemTokenData | null) => void,
  alertMap?: AlertMap<RedeemTokenErrorCode>
) {
  const redeemData = ref<Omit<RedeemTokenParams, 'id'>>();

  const campaign = useCampaignState();

  const {
    isPending,
    isError,
    error: errors,
    mutate,
  } = useMutation<RedeemTokenResponse, RedeemTokenError[], RedeemTokenParams>({
    mutationFn: (params) => redeemToken(params),
    onSuccess: ({ data }) => {
      handleRedeemSuccess(data);
    },
    networkMode: 'always',
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_REDEEM_ALERT);

  const isUnauthorized = useUnauthorizedHandler(errors);

  function handleRedeem() {
    mutate({
      ...redeemData.value,
      id: campaign.value.id,
    });
  }

  return {
    redeemData,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
    handleRedeem,
  };
}
