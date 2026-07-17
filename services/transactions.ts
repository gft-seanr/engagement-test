export async function getTransactions({ id, programId, size }: TransactionParams) {
  const { data } = await http.get<TransactionResponse>(
    `/api/transactions?id=${id}&size=${size}${programId ? `&programId=${programId}` : ''}`
  );

  return data;
}
