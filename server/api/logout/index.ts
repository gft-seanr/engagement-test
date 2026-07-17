export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  await deleteCookie(event, `t-${body.id}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return {
    isSuccessful: true,
    data: null,
    errors: null,
  };
});
