export async function fetchData(event: any) {
  const body = event.method === 'GET' ? undefined : await readBody(event);

  // let campaignId = (query.id as string) || '';

  // if (!campaignId) {
  //   const referer = getRequestHeader(event, 'referer') || '';
  //   const match = referer.match(/\/admin\/([a-zA-Z0-9-]+)\//);
  //   if (match && match[1]) {
  //     campaignId = match[1];
  //   }
  // }

  // if (!campaignId) {
  //   throw createError({
  //     statusCode: 400,
  //     message: 'Could not determine campaign ID from request',
  //   });
  // }

  const cookieName = `t-B38613D8-9522-4CA0-8475-3352C667E00E`;
  const token = getCookie(event, cookieName);

  const { apiUrl } = await getEnvironmentInfo(event);
  const endpoint = `${apiUrl}${event.path.replace(/^\/api/, '')}`;

  try {
    const response = await $fetch(endpoint, {
      method: event.method,
      credentials: 'include',
      ...(body && { body }),
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    });

    return response;
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const data = error?.data || { message: 'Internal Server Error' };

    setResponseStatus(event, statusCode);
    return data;
  }
}
