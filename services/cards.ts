export async function getCards(params: CardParams) {
  const { data } = await http.get<CardResponse>(`/api/cards?id=${params.id}`);

  return data;
}
