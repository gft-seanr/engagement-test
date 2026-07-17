export async function updateSettings(params: any /* todo */) {
  const { data } = await http.post(`/api/admin/settings`, params);

  return data;
}
