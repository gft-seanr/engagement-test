export const useAdminAppStore = defineStore('adminApp', () => {
  const route = useRoute();
  const appConfig = useAppConfig();

  const currentCampaignId = computed(() => route.params.campaignId as string);

  const currentCampaignConfig = computed(() => {
    return appConfig.engagementAdmin.campaigns.find(
      (c) => c.id?.toLowerCase() === currentCampaignId.value?.toLowerCase()
    );
  });

  const currentCampaignProjects = computed(() => currentCampaignConfig.value?.projects || []);

  return {
    currentCampaignId,
    currentCampaignConfig,
    currentCampaignProjects,
  };
});
