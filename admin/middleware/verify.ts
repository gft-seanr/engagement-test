export default defineNuxtRouteMiddleware((to) => {
  const campaignId = to.params.campaignId as string;

  if (campaignId) {
    // Check if loginData cookie exists
    const loginData = useCookie('loginData');

    // If loginData does not exist, redirect back to login
    if (!loginData.value) {
      return navigateTo(`/admin/${campaignId}/login`);
    }

    // Check if token cookie exists for this campaign
    const tokenCookie = useCookie(`t-${campaignId}`);

    // If the cookie exists, redirect to dashboard
    if (tokenCookie.value) {
      return navigateTo(`/admin/${campaignId}/spam-club/dashboard`);
    }
  }
});
