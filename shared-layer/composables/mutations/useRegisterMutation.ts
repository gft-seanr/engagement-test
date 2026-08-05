import { useMutation } from '@tanstack/vue-query';

export function useRegisterMutation(
  handleRegisterSuccess: (data: RegisterData | null) => void,
  alertMap?: AlertMap<RegisterErrorCode>
) {
  const registerModel = ref<Partial<RegisterParams>>({});

  const campaign = useCampaignState();

  const {
    data: registerResponse,
    isPending,
    isError,
    error: errors,
    reset,
    mutate,
  } = useMutation<RegisterResponse, RegisterError[], RegisterParams>({
    mutationFn: (params) => register(params),
    onSuccess: ({ data }) => {
      handleRegisterSuccess(data);
    },
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_REGISTER_ALERT, registerResponse);

  function handleRegister() {
    mutate({
      ...registerModel.value,
      id: campaign.value.id,
    } as RegisterParams);
  }

  return {
    registerResponse,
    registerModel,
    isPending,
    isError,
    errors,
    alerts,
    handleRegister,
    reset,
  };
}
