interface Options {
  programInfo: MaybeRefOrGetter<Nullable<Program>>;
  groupedReward?: MaybeRefOrGetter<GroupedReward>;
  baseReward?: MaybeRefOrGetter<BaseReward>;
  userInfo?: MaybeRefOrGetter<Nullable<UserInfo>>;
  cardType?: MaybeRefOrGetter<string>;
}

export function useProgramReward(options: Options) {
  const userInfo = computed(() => toValue(options.userInfo));
  const cardType = computed(() => toValue(options.cardType));
  const groupedReward = computed(() => toValue(options.groupedReward));
  const baseReward = computed(() => toValue(options.baseReward));

  const rewardByCardType = computed(() => {
    if (!groupedReward.value || (!userInfo.value?.cardType && !cardType.value)) {
      return undefined;
    }

    const normalizedGroup = normalizeRewardGroup(groupedReward.value);

    // Use cardType from params if provided (e.g., from UI selection), otherwise fallback to userInfo.cardType
    const userCardType = cardType.value || userInfo.value?.cardType;

    if (normalizedGroup && userCardType) {
      return normalizedGroup[userCardType.toLowerCase()];
    }

    return undefined;
  });

  const rewardByGroup = computed(() => {
    if (!groupedReward.value || !userInfo.value?.group) {
      return undefined;
    }

    const normalizedGroup = normalizeRewardGroup(groupedReward.value);
    const userGroup = userInfo.value?.group.toLowerCase();

    if (normalizedGroup) {
      return normalizedGroup[userGroup];
    }

    return undefined;
  });

  // Cache normalized rewards (keys lowercased for lookup)
  function normalizeRewardGroup(rewardGroup: GroupedReward | undefined) {
    if (!rewardGroup) return undefined;

    const normalizedGroup: GroupedReward = {};

    Object.entries(rewardGroup).forEach(([key, value]) => {
      normalizedGroup[key.toLowerCase()] = value;
    });

    return normalizedGroup;
  }

  return {
    baseReward,
    rewardByCardType,
    rewardByGroup,
  };
}
