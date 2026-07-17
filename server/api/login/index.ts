export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<LoginResponse>(event, '/accounts/login', {
    method: 'POST',
    body,
  });

  if (response?.isSuccessful && response.data?.accessToken) {
    setCookie(event, `t-${body.id}`, response.data?.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
});
