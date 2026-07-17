export function useMergedConfig<T extends string | number, U>(
  defaultValues: Record<T, U>,
  overrideValues?: Record<T, U>
) {
  const mergedConfig = computed(() => {
    return mergeWithDefaults(defaultValues, overrideValues);
  });

  function mergeWithDefaults(defaultProps: Record<T, U>, overrideProps?: Record<T, U>) {
    let tempProps: Record<T, U> = {} as Record<T, U>;

    for (const key in defaultProps) {
      if (overrideProps && key in overrideProps) {
        tempProps[key as T] = overrideProps[key as T];
      } else {
        tempProps[key as T] = defaultProps[key as T];
      }
    }
    return tempProps;
  }

  return {
    mergedConfig,
  };
}
