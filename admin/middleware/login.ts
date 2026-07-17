export default defineNuxtRouteMiddleware((to) => {
  // Early return if not on server, since campaign cookie is httpOnly and cannot be accessed on client-side
  if (!import.meta.server) {
    return;
  }

  const campaignId = to.params.campaignId as string;

  // Check if token cookie exists for this campaign
  if (campaignId) {
    const tokenCookie = useCookie(`t-${campaignId}`);

    // If the cookie exists, redirect to dashboard
    if (tokenCookie.value) {
      console.log(
        `Token cookie ${tokenCookie.value} found for campaign ${campaignId}, redirecting to dashboard`
      );
      return navigateTo(`/admin/${campaignId}/spam-club/dashboard`);
    }
  }
});
