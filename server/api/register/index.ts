export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await apiHandler<RegisterResponse>(
    event,
    '/accounts/register',
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
