export function useIsLoading(loadingStates: Ref<boolean>[]) {
  const isLoading = computed(() => {
    return loadingStates.some((state) => state.value);
  });

  return isLoading;
}
