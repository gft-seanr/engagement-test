import { useMutation } from '@tanstack/vue-query';
import type { PatchTransactionData } from '~/admin/types/receipt-dashboard';
import { patchTransaction } from '~/admin/services/transactions';

export function usePatchTransactionMutation() {
  const {
    data: patchResponse,
    isPending: isPatchPending,
    isError: isPatchError,
    error: patchErrors,
    mutate: mutatePatchTransaction,
    reset: resetPatchTransaction,
    mutateAsync: mutatePatchTransactionAsync,
  } = useMutation({
    mutationFn: (body: PatchTransactionData) => patchTransaction(body),
  });

  return {
    patchResponse,
    isPatchPending,
    isPatchError,
    patchErrors,
    mutatePatchTransaction,
    mutatePatchTransactionAsync,
    resetPatchTransaction,
  };
}
