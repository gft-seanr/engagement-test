import type { TransactionsExtendResponse } from '~/admin/types/receipt-dashboard';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<TransactionsExtendResponse>(
    event,
    '/transactions/expand',
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
