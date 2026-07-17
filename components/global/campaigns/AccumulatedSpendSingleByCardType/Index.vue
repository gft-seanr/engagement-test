<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';
import { motion } from 'motion-v';

type MappedProgramUI = Pick<ProgramConfig, 'programId' | 'rewards'> & Partial<ProgramConfig>;

interface CampaignProps extends MappedProgramUI {
  rewards: GroupedReward;
  progress: GroupedProgress;
  cardType?: string;
  actionLabel?: Record<Status, string>;
  alert?: {
    map: AlertMap<RedeemTokenErrorCode | ProgramErrorCode | TokenErrorCode>;
  };
  classes?: Classes;
}

type Status = 'in-progress' | 'complete' | 'expired';

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes?: Classes;
}

const defaultActionLabel: Record<Status, string> = {
  'in-progress': 'Locked',
  complete: 'Open',
  expired: 'Expired',
};

const {
  rewards: rewardsConfig,
  progress: progressConfig,
  classes,
  actionLabel,
  alert,
  programId,
  unit,
  cardType,
} = defineProps<Props>();

// Data fetching: program info and tokens
const {
  tokens,
  isLoading: isTokensLoading,
  alerts: tokenAlerts,
} = useTokensQuery({
  programId,
  isEnabled: false,
  alertMap: alert?.map,
});

const {
  programInfo,
  alerts: programInfoAlerts,
  isLoading: isProgramInfoLoading,
} = useProgramInfoQuery({ programId, alertMap: alert?.map });

// Alerts and loading states
const { alerts, hasAlerts } = useAlertCollection(programInfoAlerts, tokenAlerts);
const hasLoading = useIsLoading([isProgramInfoLoading, isTokensLoading]);

// Progress and Reward Mapping
const { isComplete, percentage, progressByCardType } = useProgramProgress({
  programInfo,
  groupedProgress: progressConfig,
  cardType: () => cardType || '',
});

const { rewardByCardType } = useProgramReward({
  programInfo,
  groupedReward: rewardsConfig,
  cardType: () => cardType || '',
});

const { mappedSingleProgressItem: mappedProgress } = useProgressWithRewardAndToken({
  progress: progressByCardType,
  rewards: rewardByCardType,
  tokens,
  getStatus: getProgressStatus,
});

// Display states: progress and status labels and class variants
const { currentLabel, formattedShortTarget, prefix, suffix } = useProgressDisplay(
  programInfo,
  unit
);

const { mergedConfig: mappedActionLabel } = useMergedConfig(defaultActionLabel, actionLabel);
const { wrapperVariants, actionButtonVariants, footerVariants } = useClassVariants();

const { wrapperAnimation, cardAnimation } = useAnimations();

// Methods
function getProgressStatus(options: { progress?: ProgressItem; token?: Token }): Status {
  const { progress, token } = options;

  if (!progress) return 'in-progress';

  // Todo: check if expired from programInfo
  const isExpired = false;

  if (isExpired) return 'expired';

  if (isComplete.value) {
    return 'complete';
  }

  return 'in-progress';
}

function useClassVariants() {
  const wrapperVariants = cva('overflow-hidden rounded-2xl border', {
    variants: {
      status: {
        'in-progress': 'bg-constant-white border-border-neutral',
        unclaimed: 'border-primary bg-primary-soft dark:bg-primary-dark-soft',
        complete: 'border-green-600 bg-success-soft dark:border-green-500',
        expired: 'border-gray-300 bg-gray-50',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const actionButtonVariants = cva(
    'flex h-10 cursor-not-allowed items-center justify-center overflow-hidden rounded-full border px-4 text-lg text-sm font-bold transition-colors duration-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-50',
    {
      variants: {
        status: {
          'in-progress':
            'hover:bg-surface-lower-3 cursor-not-allowed border-border-neutral bg-surface-disable text-text-secondary',
          complete: 'border-success bg-success text-white',
          expired: 'cursor-not-allowed bg-gray-400 text-white',
        },
      },
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  const footerVariants = cva(
    'flex h-10 cursor-pointer items-center justify-between border-t border-border-neutral text-center text-sm tracking-wide',
    {
      variants: {
        status: {
          'in-progress': 'text-text-secondary',
          complete: 'bg-green-200 dark:bg-green-900/40',
          expired: '',
        },
      },
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  return {
    wrapperVariants,
    actionButtonVariants,
    footerVariants,
  };
}

function useAnimations() {
  const wrapperAnimation = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      ease: [0.02, 0.35, 0.25, 0.99],
    },
    exit: {
      opacity: 0,
      y: 15,
      ease: [0.02, 0.35, 0.25, 0.99],
    },
    transition: { duration: 0.2, delay: 0.05 },
  };

  const cardAnimation = {
    initial: { opacity: 0, scale: 0.85 },
    animate: {
      opacity: 1,
      scale: 1,
      ease: [0.26, 0.02, 0.23, 0.94],
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      ease: [0.26, 0.02, 0.23, 0.94],
    },
    transition: { duration: 0.2 },
  };

  return {
    wrapperAnimation,
    cardAnimation,
  };
}
</script>
<template>
  <div :class="cn('flex flex-col gap-6', classes?.outer)">
    <!-- todo: add program === null || -->
    <template v-if="hasAlerts">
      <alert-card :alerts="[alerts[0]]"> </alert-card>
    </template>

    <template v-if="hasLoading">
      <div class="animate-pulse">
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col gap-5 px-5 py-6">
            <div class="flex gap-5">
              <div
                class="h-14 min-w-14 shrink-0 rounded-[.75rem] border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
              ></div>
              <div class="flex grow flex-col gap-2">
                <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-1">
              <div class="h-3 w-[8%] rounded bg-gray-200 dark:bg-gray-700"></div>
              <div
                class="h-2.5 flex-1 rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
              ></div>
              <div class="h-3 w-[8%] rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <div
          class="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-gray-200 p-4 xs:p-5 dark:border-gray-700"
        >
          <div class="flex-1 space-y-2">
            <div class="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="h-10 w-20 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </template>

    <template v-else-if="mappedProgress">
      <AnimatePresence mode="wait">
        <motion.div :key="cardType" v-bind="wrapperAnimation">
          <div
            class="overflow-hidden rounded-2xl border border-border-neutral dark:bg-surface-raised"
          >
            <div class="flex flex-col gap-5 px-5 py-6">
              <div class="flex gap-5">
                <motion.div
                  v-bind="cardAnimation"
                  mode="popLayout"
                  class="h-14 min-w-14 shrink-0 overflow-hidden rounded-md border border-border-neutral bg-surface-primary dark:bg-neutral-900"
                >
                  <img
                    class="size-full"
                    v-if="mappedProgress.imageUrl"
                    :src="mappedProgress.imageUrl"
                  />
                </motion.div>
                <div class="flex grow items-center gap-3">
                  <div>
                    <p class="text-xs leading-5 text-text-secondary">
                      <template v-if="programInfo?.description">
                        {{ programInfo.description }}
                      </template>
                      <template v-else>Spends as of <NuxtTime :datetime="Date.now()" /></template>
                    </p>

                    <h2 class="text-lg font-bold">{{ currentLabel }}</h2>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-1">
                <span class="w-[8%] text-right text-xs text-text-muted">
                  {{ prefix }}0{{ suffix }}
                </span>
                <Progress
                  v-model="percentage"
                  class="progress h-2.5 rounded-full border border-border-neutral bg-surface-disable [&>div]:bg-secondary"
                />
                <span class="w-[8%] text-xs text-text-muted">{{ formattedShortTarget }}</span>
              </div>
            </div>
          </div>

          <div
            class="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-border-neutral p-4 transition-colors duration-300 xs:p-5 dark:bg-surface-raised"
          >
            <div>
              <p class="flex items-center gap-1 font-bold">
                <TransitionGroup name="list">
                  <Icon
                    key="1"
                    v-if="mappedProgress.status === 'complete'"
                    name="lucide:check"
                    class="text-lg"
                  />
                  <span key="2">
                    {{ mappedProgress.reward?.rewardName }}
                  </span>
                </TransitionGroup>
              </p>

              <p class="mt-1 text-xs text-text-secondary">
                {{ mappedProgress.reward?.rewardDescription }}
              </p>
            </div>

            <div :class="actionButtonVariants({ status: mappedProgress.status })">
              <div
                v-if="mappedProgress.status !== 'in-progress'"
                class="to-[rgba(255, 255, 255, 0)] absolute inset-0 top-0.5 h-full w-full bg-linear-to-b from-[#fff] from-0% to-100% opacity-16"
              ></div>

              <a
                v-if="
                  mappedProgress.status === 'complete' && mappedProgress.reward?.type === 'gift'
                "
                :href="`https://gft.ph/${mappedProgress.token?.link}`"
                target="_blank"
                class="relative z-10 size-full"
              >
                {{ mappedActionLabel[mappedProgress.status] }}
              </a>

              <span v-else>
                {{ mappedActionLabel[mappedProgress.status] }}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </template>
  </div>
</template>
