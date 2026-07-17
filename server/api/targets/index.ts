export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const response = await apiHandler<TargetResponse>(
    event,
    `/programs/${params.programId}/targets`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
