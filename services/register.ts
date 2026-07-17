export async function register(params: RegisterParams) {
  const { data } = await http.post<RegisterResponse>(`/api/register`, params);

  return data;
}

export async function registerOtp(params: RegisterOtpParams) {
  const { data } = await http.post<RegisterOtpResponse>(`/api/register/`, params);

  return data;
}
