export function useProgressDisplay(
  programInfo: ComputedRef<ProgramInfoData | null | undefined>,
  unit?: ProgramUnit
) {
  const { prefix = '', suffix = '' } = unit?.currency ?? {};

  const { formatToShortNumber } = useShortNumberFormat();

  const {
    current: currentLabelConfig,
    remaining: remainingLabelConfig,
    target: targetLabelConfig,
  } = unit?.label || { current: [], remaining: [], target: [] };

  const current = computed(() => programInfo.value?.progress?.current || 0);
  const target = computed(() => programInfo.value?.progress?.target || 0);

  const remaining = computed(() => {
    const remaining = target.value - current.value;
    return remaining > 0 ? remaining : 0;
  });

  const formattedCurrent = computed(() => {
    let mappedCurrent = current.value;

    // Cap current to target for labeling purposes
    if (mappedCurrent > target.value) {
      mappedCurrent = target.value;
    }
    return createFormat(mappedCurrent);
  });

  const formattedTarget = computed(() => createFormat(target.value));
  const formattedRemaining = computed(() => createFormat(remaining.value));
  const formattedShortTarget = computed(() => createFormat(target.value, true));

  const currentLabel = createLabel(formattedCurrent, current, currentLabelConfig);
  const targetLabel = createLabel(formattedTarget, target, targetLabelConfig);
  const remainingLabel = createLabel(formattedRemaining, remaining, remainingLabelConfig);

  function createLabel(
    formatted: ComputedRef<string>,
    count: ComputedRef<number>,
    config: string | string[]
  ) {
    return computed(() => `${formatted.value} ${usePluralize(count.value, config).value}`);
  }

  function createFormat(amount: number, useShortFormat = false) {
    if (useShortFormat) {
      return `${prefix}${formatToShortNumber(amount)}${suffix}`;
    }

    return `${prefix}${amount.toLocaleString()}${suffix}`;
  }

  return {
    prefix,
    suffix,
    currentLabel,
    remainingLabel,
    targetLabel,
    formattedCurrent,
    formattedTarget,
    formattedShortTarget,
    formattedRemaining,
  };
}
