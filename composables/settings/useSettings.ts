export function useSettings() {
  const nuxtApp = useNuxtApp();

  // const settings = computed<Settings>(() => {
  //   return nuxtApp.payload.data?.settings || null;
  // });

  const reactiveSettings = ref<Settings | null>(null);

  const settings = computed<Settings>({
    get: () => {
      return reactiveSettings.value || nuxtApp.payload.data?.settings || null;
    },
    set: (newSettings: Settings) => {
      reactiveSettings.value = newSettings;
    },
  });

  const updateSettings = (newSettings: Settings) => {
    reactiveSettings.value = newSettings;
  };

  const serverDateTime = computed<string>(() => {
    return nuxtApp.payload.data?.timestamp;
  });

  const pageHead = computed(() => {
    return settings?.value?.pageHead;
  });

  const colorTheme = computed(() => {
    return settings?.value?.theme?.colors;
  });

  const formTheme = computed(() => {
    return settings?.value?.theme?.form;
  });

  return {
    reactiveSettings,
    settings,
    pageHead,
    colorTheme,
    formTheme,
    serverDateTime,
    updateSettings,
  };
}
