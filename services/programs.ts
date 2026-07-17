export async function getPrograms(params: ProgramParams) {
  const { data } = await http.get<ProgramResponse>(
    `/api/programs?id=${params.id}&programId=${params.programId}`
  );

  return data;
}

export async function getProgramInfo(params: ProgramInfoParams) {
  const { data } = await http.get<ProgramInfoResponse>(
    `/api/programs/${params.programId}?id=${params.id}&programId=${params.programId}`
  );

  return data;
}
