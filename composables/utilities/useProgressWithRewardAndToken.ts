export function useProgressWithRewardAndToken<T>(options: {
  progress: ComputedRef<BaseProgress | undefined>;
  rewards: ComputedRef<BaseReward | undefined>;
  targets?: ComputedRef<BaseTarget | undefined>;
  tokens?: ComputedRef<Token[]>;
  getStatus: (options: { progress?: ProgressItem; target?: TargetItem; token?: Token }) => T;
}) {
  const { progress, rewards, tokens, getStatus, targets } = options;

  /**
   * Maps each progress item with its corresponding reward and token (if available).
   */
  const mappedProgress = computed(() => {
    if (!rewards.value || !progress.value) {
      return [];
    }

    return progress.value.map((progressItem: ProgressItem) => {
      //find the reward for the progress item based on tier
      const rewardForProgress = rewards.value?.find((reward) => {
        return reward.tier === progressItem.tier;
      });

      let tokenForProgress;

      if (rewardForProgress && tokens?.value) {
        // find the token from useTokensQuery based on tier
        tokenForProgress = tokens.value.find((token) => {
          return token.tier === rewardForProgress.tier;
        });
      }

      // determine the status using the provided getStatus function
      const status = getStatus({ progress: progressItem, token: tokenForProgress });

      return {
        ...progressItem,
        reward: rewardForProgress,
        token: tokenForProgress,
        status,
      };
    });
  });

  /**
   * Maps each targets with its corresponding reward and token (if available).
   */
  const mappedProgressByTargets = computed(() => {
    if (!rewards.value || !progress.value || !targets?.value) {
      return [];
    }

    return targets.value.map((targetItem: TargetItem) => {
      let tokenForProgress;

      //find the reward for the progress item based on target tier
      const rewardForProgress = rewards.value?.find((reward) => reward.tier === targetItem.tier);

      const progressForTarget = progress.value?.find(
        (progress) => progress.tier === targetItem.tier
      );

      if (rewardForProgress && tokens?.value) {
        // find the token from useTokensQuery based on tier
        tokenForProgress = tokens.value.find((token) => {
          return token.tier === rewardForProgress.tier;
        });
      }

      // determine the status using the provided getStatus function
      const status = getStatus({ target: targetItem, token: tokenForProgress });

      return {
        ...targetItem,
        reward: rewardForProgress,
        token: tokenForProgress,
        progress: {
          ...targetItem.progress,
          ...progressForTarget,
        },
        status,
      };
    });
  });

  const mappedSingleProgressItem = computed(() => {
    if (mappedProgress.value && mappedProgress.value.length === 1) {
      return mappedProgress.value[0];
    }

    return undefined;
  });

  return {
    mappedSingleProgressItem,
    mappedProgress,
    mappedProgressByTargets,
  };
}
