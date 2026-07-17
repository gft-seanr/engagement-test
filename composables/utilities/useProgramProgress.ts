interface ProgressOptions {
  programInfo: MaybeRefOrGetter<Nullable<Program>>;
  groupedProgress?: MaybeRefOrGetter<GroupedProgress>;
  baseProgress?: MaybeRefOrGetter<BaseProgress>;
  userInfo?: MaybeRefOrGetter<Nullable<UserInfo>>;
  cardType?: MaybeRefOrGetter<string>;
}

export function useProgramProgress(options: ProgressOptions) {
  const programInfo = computed(() => toValue(options.programInfo));
  const userInfo = computed(() => toValue(options.userInfo));
  const cardType = computed(() => toValue(options.cardType));
  const groupedProgress = computed(() => toValue(options.groupedProgress));
  const baseProgress = computed(() => toValue(options.baseProgress));

  const progress = computed(() => {
    return programInfo.value?.progress || { current: 0, target: 0, tier: 0 };
  });

  const hasProgress = computed(() => {
    return progress.value.current && progress.value.current > 0;
  });

  const percentage = computed(() => {
    if (progress.value.target === 0) return 0;

    return Math.min((progress.value.current / progress.value.target) * 100, 100) || 0;
  });

  const multiCheckpointPercentage = computed(() => {
    if (
      !progressByGroup.value &&
      !baseProgress.value &&
      !progressByCardType.value &&
      !progressByTier.value
    ) {
      return 0;
    }

    const currentProgress =
      baseProgress.value ||
      progressByGroup.value ||
      progressByCardType.value ||
      progressByTier.value;

    const checkpoints = currentProgress?.map((item, index) => {
      return {
        position: ((index + 1) / currentProgress?.length) * 100, // position in percentage e.g. for 3 position: 33.33, 66.67, 100
        target: item.target,
      };
    });

    if (currentProgress && checkpoints) {
      return getProgressPercentage(progress.value.current, currentProgress, checkpoints);
    }

    return 0;
  });

  const isComplete = computed(() => {
    if (progress.value.target === 0) {
      return false;
    }

    return progress.value.current >= progress.value.target;
  });

  const progressByGroup = computed(() => {
    if (!groupedProgress.value || !userInfo.value?.group) {
      return undefined;
    }

    const normalizedGroup = normalizeProgressGroup(groupedProgress.value);
    const userGroup = userInfo.value?.group.toLowerCase();

    if (normalizedGroup) {
      return normalizedGroup[userGroup];
    }

    return undefined;
  });

  const progressByTier = computed(() => {
    if (!baseProgress.value) return undefined;

    return baseProgress.value.filter(
      (progress) => progress.tier === programInfo.value?.progress?.tier
    );
  });

  const progressByCardType = computed(() => {
    if (!groupedProgress.value || (!userInfo.value?.cardType && !cardType.value)) {
      return undefined;
    }

    const normalizedGroup = normalizeProgressGroup(groupedProgress.value);

    // Use cardType from params if provided (e.g., from UI selection), otherwise fallback to userInfo.cardType
    const userCardType = cardType.value || userInfo.value?.cardType;

    if (normalizedGroup && userCardType) {
      return normalizedGroup[userCardType.toLowerCase()];
    }

    return undefined;
  });

  function normalizeProgressGroup(progressGroup: GroupedProgress | undefined) {
    if (!progressGroup) return undefined;

    const normalizedGroup: GroupedProgress = {};

    Object.entries(progressGroup).forEach(([key, value]) => {
      normalizedGroup[key.toLowerCase()] = value;
    });

    return normalizedGroup;
  }

  /**
   * Calculate progress percentage for a multi-checkpoint progress bar with unequal segments.
   * @param currentSpend - Current spending amount
   * @param checkpoints - Array of { position, target } objects e.g. [{ position: 50, target: 500 }, { position: 100, target: 1000 }]
   * @returns Progress percentage (0-100)
   */
  function getProgressPercentage(
    currentSpend: number,
    progress: BaseProgress,
    checkpoints: Array<{ position: number; target: number }>
  ): number {
    // Find which segment the current spend falls into
    for (let counter = 0; counter <= progress.length - 1; counter++) {
      const currentCheckpoint = checkpoints[counter];
      const nextCheckpoint = checkpoints[counter + 1];

      // if the first tier/segment is not reached
      if (currentSpend < currentCheckpoint.target) {
        const percentage = (currentSpend / currentCheckpoint.target) * currentCheckpoint.position;

        return percentage;
      }

      // if the middle tier/segment is reached
      if (
        currentSpend >= currentCheckpoint.target &&
        nextCheckpoint &&
        currentSpend <= nextCheckpoint.target
      ) {
        // Calculate progress within this segment (0 to 1)
        const segmentProgress =
          (currentSpend - currentCheckpoint.target) /
          (nextCheckpoint.target - currentCheckpoint.target);

        // Map to the visual position range
        const percentage =
          currentCheckpoint.position +
          segmentProgress * (nextCheckpoint.position - currentCheckpoint.position);

        return percentage;
      }
    }

    // If beyond the last checkpoint, return 100%
    return currentSpend >= checkpoints[checkpoints.length - 1].target ? 100 : 0;
  }

  return {
    progress,
    percentage,
    multiCheckpointPercentage,
    isComplete,
    hasProgress,
    baseProgress,
    progressByGroup,
    progressByCardType,
    progressByTier,
  };
}
