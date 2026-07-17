import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const campaignId = (query.campaignId as string) || '';

  const response = await apiHandler<any>(
    event,
    `/admin/programs?id=${campaignId}`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
