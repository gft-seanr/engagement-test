export default defineNuxtRouteMiddleware((to) => {
  const { settings, pageHead } = useSettings();
  const campaign = useCampaignState();

  if (to.name === '404') {
    return;
  }

  // Set campaign ID from route parameters
  campaign.value.id = to.params.id as string;

  // Set program ID from route parameters
  campaign.value.programId = to.query.programId as string;

  // Set custom head for the campaign page
  const pageName = to.name as string;

  if (
    settings.value &&
    Object.entries(settings.value).length !== 0 &&
    pageName &&
    settings.value?.pages[pageName]
  ) {
    // Dynamically set the head based on settings
    const head = {
      ...(pageHead.value || {}),
      ...(settings.value?.pages[pageName]?.pageHead || {}), // Merge global and page-specific head properties
    };

    useHead(head);
  }

  // //Redirect to login page if there's no cookie.
  // if (pageName === 'home' && campaign.value.id && settings.value) {
  //   const authCookie = useCookie(`t-${campaign.value.id}`);

  //   if (!authCookie.value && settings.value?.pages?.login) {
  //     return navigateTo(`/campaign/${campaign.value.id}/login`);
  //   }
  // }
});
