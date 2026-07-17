import { useAuthStore } from '~admin/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const campaignId = to.params.campaignId as string;

  if (!campaignId) return;

  const appConfig = useAppConfig();
  const campaigns = appConfig.engagementAdmin?.campaigns || [];
  const currentCampaign = campaigns.find((c) => c.id?.toLowerCase() === campaignId?.toLowerCase());

  if (!currentCampaign) return;

  const redirectPath = currentCampaign.auth.onLoginRedirect.replace('{{id}}', campaignId);
  const requiredTokenKey = currentCampaign.auth.tokenKey;
  const hasValidToken = !!(authStore as any)[requiredTokenKey];

  if (hasValidToken) {
    return navigateTo(redirectPath);
  }
});
