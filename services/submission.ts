export async function submitInformation(params: SubmitInformationParams) {
  const { data } = await http.post<SubmitInformationResponse>(`/api/submissions`, params);

  return data;
}
