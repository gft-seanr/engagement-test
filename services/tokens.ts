export async function getTokens(params: TokenParams) {
  const { data } = await http.get<TokenResponse>(
    `/api/tokens?id=${params.id}&programId=${params.programId}`
  );

  return data;
}
