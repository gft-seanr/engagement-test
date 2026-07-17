import { useQuery } from '@tanstack/vue-query';
import { type ReceiptTransactionsRequest } from '~/admin/types/receipt-dashboard';
import { getReceiptTransactions } from '~/admin/services/transactions';

export function useReceiptTransactionsQuery(options: ReceiptTransactionsRequest = {}) {
  const { id, processingStatusIds = [] } = options;

  const {
    data: receiptTransactionsResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
    refetch,
  } = useQuery({
    queryKey: ['programs', id, ...(processingStatusIds.length ? [processingStatusIds] : [])],
    queryFn: () => getReceiptTransactions({ id, processingStatusIds }),
    select: (data) => data.data,
  });

  return {
    receiptTransactionsResponse,
    isLoading,
    isPending,
    isError,
    errors,
    refetch,
  };
}
