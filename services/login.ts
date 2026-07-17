export async function login(params: LoginParams) {
  const { data } = await http.post<LoginResponse>(`/api/login`, params);

  return data;
}

export async function loginOtp(params: LoginOtpParams) {
  const { data } = await http.post<LoginOtpResponse>(`/api/login/verify`, params);

  return data;
}

export async function logout(params: LogoutParams) {
  const { data } = await http.post(`/api/logout`, params);

  return data;
}

export async function loginPass(params: LoginPassParams) {
  const { data } = await http.post(`/api/login/pass`, params);

  return data;
}
