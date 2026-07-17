import { useQuery } from '@tanstack/vue-query';

interface QueryOptions {
  size?: number;
  itemsPerPage?: number;
  alertMap?: AlertMap<TransactionErrorCode>;
  sortDateBy?: 'asc' | 'desc';
}

export function useTransactionsQuery(options: QueryOptions = {}) {
  const { size = 300, itemsPerPage = 0, alertMap, sortDateBy = 'desc' } = options;

  const campaign = useCampaignState();

  const {
    data: transactionsResponse,
    isLoading,
    isPending,
    isError,
    error: errors,
  } = useQuery<TransactionResponse, TransactionError[]>({
    queryKey: ['transactions', campaign.value.id, campaign.value.programId, size],
    queryFn: () =>
      getTransactions({ id: campaign.value.id, programId: campaign.value.programId, size }),
  });

  const visibleItemsCount = ref(itemsPerPage);

  const transactions = computed(() => {
    const transactions = transactionsResponse.value?.data?.transactions || [];

    if (!transactions.length) return [];

    return [...transactions].sort((a, b) => {
      if (!a.transactionDateTime || !b.transactionDateTime) {
        // Put transactions without dates at the end
        if (!a.transactionDateTime && !b.transactionDateTime) return 0;
        if (!a.transactionDateTime) return 1;
        if (!b.transactionDateTime) return -1;
      }

      switch (sortDateBy) {
        case 'asc':
          return (
            new Date(a.transactionDateTime).getTime() - new Date(b.transactionDateTime).getTime()
          );
        case 'desc':
          return (
            new Date(b.transactionDateTime).getTime() - new Date(a.transactionDateTime).getTime()
          );
        default:
          return 0;
      }
    });
  });

  const totalCount = computed(() => transactionsResponse.value?.data?.totalCount || 0);

  const totalAmount = computed(() => {
    return (
      transactions.value
        ?.reduce((sum, transaction) => sum + transaction.amount, 0)
        .toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '0.00'
    );
  });

  const alerts = useAlertMap(errors, alertMap);

  const isUnauthorized = useUnauthorizedHandler(errors);

  // Pagination: Display limited items with "show more" functionality
  const visibleTransactions = computed(() => {
    if (!itemsPerPage) return transactions.value;

    return transactions.value.slice(0, visibleItemsCount.value);
  });

  const hasMoreItems = computed(() => {
    return visibleItemsCount.value < transactions.value.length;
  });

  const showMore = () => {
    visibleItemsCount.value += itemsPerPage;
  };

  return {
    transactions,
    visibleTransactions,
    visibleItemsCount,
    totalCount,
    totalAmount,
    showMore,
    hasMoreItems,
    isLoading,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
  };
}
