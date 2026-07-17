export function useUnauthorizedHandler(errors: Ref<BaseError<any>[] | null>) {
  const auth = useAuthState();

  const isUnauthorized = computed(() => {
    if (!errors.value) return false;
    return errors.value?.some((error) => error.code === 'Unauthorized');
  });

  watch(isUnauthorized, (value) => {
    if (value) {
      auth.value.isUnauthorized = true;
    }
  });

  return isUnauthorized;
}
