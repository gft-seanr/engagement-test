import { defineEventHandler, getQuery, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const campaignId = (query.campaignId as string) || '';

  const body = await readBody(event);

  const response = await apiHandler<any>(
    event,
    `/admin/programs?id=${campaignId}`,
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
