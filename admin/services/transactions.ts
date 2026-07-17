import type {
  ReceiptTransactionsResponse,
  ReceiptTransactionsRequest,
  TransactionsExtendRequest,
  TransactionsExtendResponse,
  PatchTransactionData,
} from '~/admin/types/receipt-dashboard';

export async function getReceiptTransactions(params: ReceiptTransactionsRequest) {
  const { data } = await http.get<ReceiptTransactionsResponse>(
    `/api/transactions?id=${params.id}&processingStatusIds=[${params.processingStatusIds}]`
  );

  return data;
}

export async function extendTransactions(params: TransactionsExtendRequest) {
  const { data } = await http.post<TransactionsExtendResponse>(`/api/transactions/expand`, params);

  return data;
}

export async function patchTransaction(body: PatchTransactionData) {
  const { data } = await http.patch<ReceiptTransactionsResponse>(`/api/transactions`, body);

  return data;
}
