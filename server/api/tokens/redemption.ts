export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<RedeemTokenResponse>(
    event,
    '/tokens/redemption',
    {
      method: 'POST',
      body,
    },
    true
  );

  return response;
});
