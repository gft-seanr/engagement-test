export default defineEventHandler(async (event) => {
  const params = await getQuery(event);

  if (!params.id || params.id === 'undefined') {
    throw new Error('CampaignId is not defined');
  }

  const response = await apiHandler<SettingsResponse>(event, `/ui-settings?id=${params.id}`, {
    method: 'GET',
  });

  return response;
});
