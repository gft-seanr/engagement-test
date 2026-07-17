export default defineEventHandler(async (event) => {
  const params = await getQuery(event);

  // Build query parameters object conditionally
  const queryParams = {
    id: params.id as string,
    ...(params.processingStatusIds && {
      ProcessingStatusIds: params.processingStatusIds as string,
    }),
    ...(!params.processingStatusIds && params.size && { size: params.size as string }),
    ...(!params.processingStatusIds &&
      params.programId && { programId: params.programId as string }),
  };

  const apiPath = `/transactions?${new URLSearchParams(queryParams).toString()}`;

  const response = await apiHandler<TransactionResponse>(
    event,
    apiPath,
    {
      method: 'GET',
    },
    true
  );

  return response;
});
