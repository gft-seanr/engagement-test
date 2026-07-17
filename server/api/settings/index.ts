export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler(
    event,
    '/settings',
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
