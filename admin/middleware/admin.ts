import { useAuthStore } from '~admin/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const appConfig = useAppConfig();

  if (to.path.includes('/login') || to.path.includes('/verify')) {
    return;
  }

  const campaignId = to.params.campaignId as string;

  if (!campaignId) {
    return navigateTo('/admin/unauthorized'); //404 page currently
  }

  const campaigns = appConfig.engagementAdmin?.campaigns || [];
  const currentCampaignConfig = campaigns.find(
    (c) => c.id.toLowerCase() === campaignId.toLowerCase()
  );

  if (!currentCampaignConfig) {
    return navigateTo('/admin/unauthorized');
  }

  const requiredTokenKey = currentCampaignConfig.auth?.tokenKey;
  const hasValidToken = requiredTokenKey ? !!(authStore as any)[requiredTokenKey] : false;

  if (!hasValidToken) {
    return navigateTo(`/admin/${campaignId}/login`);
  }
});
