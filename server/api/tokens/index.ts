export default defineEventHandler(async (event) => {
  const params = await getQuery(event);
  const response = await apiHandler<TokenResponse>(
    event,
    `/tokens?id=${params.id}&programid=${params.programId}`,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
