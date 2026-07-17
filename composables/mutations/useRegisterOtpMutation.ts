import { useMutation } from '@tanstack/vue-query';

export function useRegisterOtpMutation(
  handleRegisterOtpSuccess: (data: RegisterOtpData | null) => void,
  alertMap?: AlertMap<RegisterOtpErrorCode>
) {
  const registerOtpModel = ref<Omit<RegisterOtpParams, 'id' | 'token' | 'mobileno'>>({
    otp: '',
  });

  const campaign = useCampaignState();

  const {
    isPending,
    isError,
    error: errors,
    reset,
    mutate,
  } = useMutation<RegisterOtpResponse, RegisterOtpError[], RegisterOtpParams>({
    mutationFn: (params) => registerOtp(params),
    onSuccess: ({ data }) => {
      handleRegisterOtpSuccess(data);
    },
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_REGISTER_OTP_ALERT);

  function handleRegisterOtp(token: string, mobileno: string) {
    mutate({
      ...registerOtpModel.value,
      id: campaign.value.id,
      token,
      mobileno,
    });
  }

  return {
    registerOtpModel,
    isPending,
    isError,
    errors,
    alerts,
    handleRegisterOtp,
    reset,
  };
}
