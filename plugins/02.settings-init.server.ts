export default defineNuxtPlugin(async (nuxt) => {
  const route = useRoute();
  const campaignId = route.params.id;

  if (!route.path.startsWith('/campaign/')) {
    return;
  }

  try {
    if (!campaignId) {
      throw new Error('Campaign ID is not defined in the route parameters.');
    }

    const { data } = await useFetch(`/api/ui-settings?id=${campaignId}`, {
      method: 'GET',
    });

    // Store the settings in nuxtApp's payload for server-to-client transfer.
    // This approach is used because the settings do not need to be reactive or dynamically updated on the client.
    // It ensures the settings are available during the initial render without requiring additional API calls.
    if (data.value?.isSuccessful) {
      nuxt.payload.data = {
        ...nuxt.payload.data,
        settings: data.value.data,
        timestamp: data.value.timestamp,
      };
    }
  } catch (error) {
    console.log('Failed to load settings:', error);
  }
});
