export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<RaffleResponse>(
    event,
    '/raffle',
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
