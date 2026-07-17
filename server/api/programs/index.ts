export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const response = await apiHandler<ProgramResponse>(
    event,
    `/programs?id=${params.id}&programId=${params.programId}`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
