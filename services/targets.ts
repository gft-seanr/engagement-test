export async function getTargets(params: TargetParams) {
  const { data } = await http.get<TargetResponse>(`/api/targets?programId=${params.programId}`);

  return data;
}
