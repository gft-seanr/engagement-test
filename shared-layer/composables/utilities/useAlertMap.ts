export function useAlertMap<T extends string, U>(
  errors: Ref<BaseError<T>[] | null>,
  alertMap?: AlertMap<T>,
  response?: Ref<BaseResponse<U, BaseError<T>> | undefined>
) {
  const alerts = computed(() => {
    if (response?.value?.isSuccessful) {
      return [alertMap?.['Successful'] || GENERAL_ALERT['Successful']];
    }

    if (!errors.value || errors.value.length === 0) {
      return [];
    }

    if (!alertMap) {
      return [GENERAL_ALERT['InternalServerError']];
    }

    return errors.value.map((error) => {
      if (!error.code) {
        return GENERAL_ALERT['InternalServerError'];
      }

      const mappedAlert =
        alertMap[error.code.trim() as T] ||
        GENERAL_ALERT[error.code.trim() as ServerErrorCode] ||
        GENERAL_ALERT['InternalServerError'];

      return mappedAlert;
    });
  });

  return alerts;
}
