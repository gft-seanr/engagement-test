import { ReceiptTransactionsResponse } from '~/admin/types/receipt-dashboard';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<ReceiptTransactionsResponse>(
    event,
    '/transactions',
    {
      method: 'PATCH',
      body,
    },
    true
  );

  return response;
});
