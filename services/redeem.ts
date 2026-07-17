export async function redeemToken(params: RedeemTokenParams) {
  const { data } = await http.post<RedeemTokenResponse>('/api/tokens/redemption', params);

  return data;
}
