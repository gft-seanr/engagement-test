import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const campaignId = (query.campaignId as string) || '';
  const subdomain = (query.subdomain as string) || '';

  const response = await apiHandler<any>(
    event,
    `/admin/check-affiliate?subdomain=${subdomain}&id=${campaignId}`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
