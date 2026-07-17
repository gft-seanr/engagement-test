export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const response = await apiHandler<ProgramResponse>(
    event,
    `/cards?id=${params.id}`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
