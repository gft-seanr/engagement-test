import { useMutation } from '@tanstack/vue-query';

export function useLoginPassMutation(handleLoginPassSuccess?: () => void) {
  const {
    data: loginResponse,
    isPending,
    isError,
    error: errors,
    reset,
    mutate,
  } = useMutation<unknown, unknown, LoginPassParams>({
    mutationFn: (params) => loginPass(params),
    onSuccess: () => {
      handleLoginPassSuccess?.();
    },
  });

  function handleLoginPass(id: string, token?: string, parentCampaignId?: string) {
    mutate({
      id,
      token,
      parentCampaignId,
    } as LoginPassParams);
  }

  return {
    loginResponse,
    isPending,
    isError,
    errors,
    handleLoginPass,
    reset,
  };
}
