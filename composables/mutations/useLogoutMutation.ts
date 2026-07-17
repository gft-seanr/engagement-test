import { useMutation } from '@tanstack/vue-query';

export function useLogoutMutation(handleLogoutSuccess: () => void) {
  const campaign = useCampaignState();

  const { isPending, isError, error, mutate } = useMutation<
    LogoutResponse,
    LogoutError[],
    LogoutParams
  >({
    mutationFn: (params) => logout(params),
    onSuccess: async () => {
      handleLogoutSuccess();
    },
  });

  function handleLogout() {
    mutate({ id: campaign.value.id });
  }

  return {
    isPending,
    isError,
    error,
    handleLogout,
  };
}
