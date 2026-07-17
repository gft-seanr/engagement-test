export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await apiHandler<SubmitInformationResponse>(event, '/submissions', {
    method: 'POST',
    body,
  });

  return response;
});
