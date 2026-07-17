import { useMutation } from '@tanstack/vue-query';

export function useLoginOtpMutation(
  handleLoginOtpSuccess: (data: LoginOtpData | null) => void,
  alertMap?: AlertMap<LoginOtpErrorCode>
) {
  const loginOtpModel = ref<Omit<LoginOtpParams, 'id' | 'token'>>({
    code: '',
  });

  const campaign = useCampaignState();

  const {
    isPending,
    isError,
    error: errors,
    mutate,
    reset,
  } = useMutation<LoginOtpResponse, LoginOtpError[], LoginOtpParams>({
    mutationFn: (params) => loginOtp(params),
    onSuccess: ({ data }) => {
      handleLoginOtpSuccess(data);
    },
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_LOGIN_OTP_ALERT);

  function handleLoginOtp(token: string) {
    mutate({
      ...loginOtpModel.value,
      id: campaign.value.id,
      token,
    });
  }

  return {
    loginOtpModel,
    isPending,
    isError,
    errors,
    alerts,
    handleLoginOtp,
    reset,
  };
}
