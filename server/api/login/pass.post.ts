export default defineEventHandler(async (event) => {
  const { id, token, parentCampaignId } = await readBody(event);

  if (parentCampaignId) {
    const parentToken = getCookie(event, `t-${parentCampaignId}`) as string;

    setCookie(event, `t-${id}`, parentToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  } else {
    setCookie(event, `t-${id}`, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  return {
    isSuccessful: true,
    data: null,
    errors: [],
    timestamp: new Date().toISOString(),
  };
});
