//todo: refactor
export async function raffle(params: any) {
  const { data } = await http.post(`/api/raffle`, params);

  return data;
}
