export default defineNuxtRouteMiddleware((to) => {
  const appConfig = useAppConfig();

  const campaignId = to.params.campaignId as string;

  if (!campaignId) {
    return navigateTo('/admin/unauthorized');
  }

  const campaigns = appConfig.engagementAdmin?.campaigns || [];
  const currentCampaignConfig = campaigns.find(
    (c) => c.id.toLowerCase() === campaignId.toLowerCase()
  );

  if (!currentCampaignConfig) {
    return navigateTo('/admin/unauthorized');
  }

  const campaignRoutePrefix = currentCampaignConfig.routePrefix;

  if (!campaignRoutePrefix) {
    return navigateTo('/admin/unauthorized');
  }

  if (!to.path.includes(campaignRoutePrefix)) {
    const rawHomeRoute = currentCampaignConfig.to || currentCampaignConfig.auth.onLoginRedirect;

    const resolvedHomeRoute = rawHomeRoute.replace('{{id}}', campaignId);

    if (to.path !== resolvedHomeRoute) {
      return navigateTo(resolvedHomeRoute);
    }
  }
});
