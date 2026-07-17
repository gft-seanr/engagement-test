import { useMutation } from '@tanstack/vue-query';

export function useLoginMutation(
  handleLoginSuccess: (data: LoginData | null) => void,
  alertMap?: AlertMap<LoginErrorCode>
) {
  const loginModel = ref<Omit<LoginParams, 'id'>>({
    code: '',
  });

  const campaign = useCampaignState();

  const {
    data: loginResponse,
    isPending,
    isError,
    error: errors,
    reset,
    mutate,
  } = useMutation<LoginResponse, LoginError[], LoginParams>({
    mutationFn: (params) => login(params),
    onSuccess: ({ data }) => {
      handleLoginSuccess(data);
    },
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_LOGIN_ALERT, loginResponse);

  function handleLogin() {
    mutate({
      ...loginModel.value,
      id: campaign.value.id,
    });
  }

  return {
    loginResponse,
    loginModel,
    isPending,
    isError,
    errors,
    alerts,
    handleLogin,
    reset,
  };
}
