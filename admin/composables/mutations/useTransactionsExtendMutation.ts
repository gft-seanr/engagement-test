import { useMutation } from '@tanstack/vue-query';
import type { TransactionsExtendRequest } from '~/admin/types/receipt-dashboard';
import { extendTransactions } from '~/admin/services/transactions';

export function useTransactionsExtendMutation() {
  const {
    data: receiptSignedURLsResponse,
    isPending,
    isError,
    error: errors,
    mutate: mutateExtendTransactions,
    mutateAsync: mutateExtendTransactionsAsync,
  } = useMutation({
    mutationFn: (options: TransactionsExtendRequest) => extendTransactions(options),
  });

  return {
    receiptSignedURLsResponse,
    isPending,
    isError,
    errors,
    mutateExtendTransactions,
    mutateExtendTransactionsAsync,
  };
}
