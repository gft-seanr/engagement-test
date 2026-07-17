<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';
import { cva } from 'class-variance-authority';

type MappedProgramUI = Pick<ProgramConfig, 'programId' | 'rewards'> & Partial<ProgramConfig>;

interface CampaignProps extends MappedProgramUI {
  rewards: GroupedReward;
  progress: GroupedProgress;
  actionLabel?: Record<Status, string>;
  alert?: {
    map: AlertMap<RedeemTokenErrorCode | ProgramErrorCode | TokenErrorCode>;
  };
  classes?: Classes;
}

type Status = 'in-progress' | 'unclaimed' | 'claimed' | 'expired';

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes?: Classes;
}

const defaultActionLabel: Record<Status, string> = {
  'in-progress': 'Locked',
  unclaimed: 'Claim',
  claimed: 'Complete',
  expired: 'Expired',
};

const {
  rewards: rewardsConfig,
  progress: progressConfig,
  classes,
  actionLabel,
  alert,
  programId,
} = defineProps<Props>();

const campaign = useCampaignState();

// Data fetching: program info and tokens
const { userInfo } = useProgramsQuery({
  programId: campaign.value.programId,
});

const {
  programInfo,
  alerts: programInfoAlerts,
  isLoading: isProgramInfoLoading,
} = useProgramInfoQuery({
  programId,
  alertMap: alert?.map,
});

const {
  tokens,
  isLoading: isTokenLoading,
  alerts: tokenAlerts,
} = useTokensQuery({
  programId,
  alertMap: alert?.map,
});

// Alerts and loading states
const { alerts, hasAlerts } = useAlertCollection(programInfoAlerts, tokenAlerts);
const hasLoading = useIsLoading([isProgramInfoLoading, isTokenLoading]);

// Progress and reward mapping
const { isComplete, progressByGroup } = useProgramProgress({
  programInfo,
  userInfo,
  groupedProgress: progressConfig,
});

const { rewardByGroup } = useProgramReward({
  programInfo,
  groupedReward: rewardsConfig,
  userInfo,
});

const { mappedSingleProgressItem: mappedProgress } = useProgressWithRewardAndToken({
  progress: progressByGroup,
  rewards: rewardByGroup,
  tokens,
  getStatus: getProgressStatus,
});

// Redemption handling
const { handleRedeemSuccess, handleRedeemError } = useRedemptionHandler();

// Display states: labels and class variants
const { mergedConfig: mappedActionLabel } = useMergedConfig(defaultActionLabel, actionLabel);
const {
  wrapperVariants,
  actionButtonVariants,
  checkboxVariants,
  footerVariants,
  rewardNameVariants,
} = useClassVariants();

function getProgressStatus(options: { progress?: ProgressItem; token?: Token }): Status {
  const { progress, token } = options;

  if (!progress) return 'in-progress';

  // Todo: check if expired from programInfo
  const isExpired = false;

  if (isExpired) return 'expired';

  if (isComplete.value) {
    // With redemption, for 'gift' reward type
    if (progress.hasRedemption) {
      if (!token) return 'in-progress';

      if (token.statusId === TOKEN_STATUS.redeemed) {
        return 'claimed';
      } else if (token?.statusId === TOKEN_STATUS.active) {
        return 'unclaimed';
      }

      // Fallback for unexpected token status
      return 'in-progress';
    } else {
      // Without redemption for reward type of cashback
      return 'claimed';
    }
  }

  return 'in-progress';
}

function useRedemptionHandler() {
  function handleRedeemSuccess() {
    toast.success('You have successfully claimed your reward.');
  }

  function handleRedeemError() {
    toast.error('Failed to claim reward. Please try again later.');
  }

  return {
    handleRedeemSuccess,
    handleRedeemError,
  };
}

function useClassVariants() {
  const wrapperVariants = cva('overflow-hidden rounded-2xl border', {
    variants: {
      status: {
        'in-progress': 'bg-constant-white border-border-neutral',
        unclaimed:
          'border-accent-primary bg-accent-primary-light dark:bg-dark-accent-primary-light',
        claimed: 'border-green-600 bg-success-soft dark:border-green-500',
        expired: 'border-gray-300 bg-gray-50',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const actionButtonVariants = cva(
    'relative flex h-full items-center justify-center border-l border-border-neutral px-4 font-bold',
    {
      variants: {
        status: {
          'in-progress':
            'hover:bg-surface-lower-3 cursor-not-allowed border-border-neutral bg-surface-lower-2 text-text-muted',
          unclaimed:
            'bg-accent-primary font-bold text-white hover:bg-accent-primary/90 dark:bg-dark-accent-primary',
          claimed: 'bg-success font-bold text-white',
          expired: 'cursor-not-allowed bg-gray-400 text-white',
        },
      },
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  const checkboxVariants = cva(
    'flex size-6 shrink-0 items-center justify-center rounded-md border border-border-neutral inset-shadow-md',
    {
      variants: {
        status: {
          'in-progress': 'bg-surface-lower-1',
          unclaimed: '',
          claimed: 'bg-success',
          expired: '',
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
          unclaimed: '',
          claimed: 'bg-green-200 dark:bg-green-900/40',
          expired: '',
        },
      },
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  const rewardNameVariants = cva('flex items-center gap-1 text-sm', {
    variants: {
      status: {
        'in-progress': '',
        unclaimed: '',
        claimed: 'font-bold',
        expired: '',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  return {
    wrapperVariants,
    actionButtonVariants,
    checkboxVariants,
    footerVariants,
    rewardNameVariants,
  };
}
</script>
<template>
  <div :class="cn('outer flex flex-col gap-6', classes?.outer)">
    <template v-if="programInfo === null || hasAlerts">
      <alert-card :alerts="[alerts[0]]"> </alert-card>
    </template>

    <template v-if="hasLoading">
      <div class="animate-pulse">
        <div
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center gap-5 px-5 py-6">
            <div
              class="size-14 shrink-0 rounded-[.75rem] border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
            ></div>

            <div class="flex-1 space-y-2">
              <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div
              class="size-6 shrink-0 rounded-md border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
            ></div>
          </div>

          <div
            class="flex h-10 items-center justify-between border-t border-gray-200 dark:border-gray-700"
          >
            <div class="px-4">
              <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="h-full border-l border-gray-200 px-4 dark:border-gray-700">
              <div class="flex h-full items-center">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        v-if="mappedProgress"
        :class="
          wrapperVariants({
            status: mappedProgress.status,
          })
        "
      >
        <div class="flex gap-5 px-5 py-6">
          <div
            class="size-14 shrink-0 rounded-[.75rem] border border-border-neutral bg-surface-primary dark:bg-neutral-900"
          >
            <img v-if="iconUrl" :src="iconUrl" alt="Icon" />
          </div>
          <div class="flex grow items-center gap-3">
            <div>
              <h2 class="text-lg font-bold">{{ title }}</h2>
              <p class="text-xs leading-5 text-text-secondary">{{ description }}</p>
            </div>

            <div
              :class="
                checkboxVariants({
                  status: mappedProgress.status,
                })
              "
            >
              <Icon
                v-if="mappedProgress.status === 'claimed'"
                name="lucide:check"
                class="text-white"
              />
            </div>
          </div>
        </div>

        <div :class="footerVariants({ status: mappedProgress.status })">
          <div class="px-4">
            <span :class="rewardNameVariants({ status: mappedProgress.status })">
              <Icon
                v-if="mappedProgress.status === 'claimed'"
                name="lucide:check"
                class="text-base"
              />
              {{ mappedProgress.reward?.rewardName }}
            </span>
          </div>

          <div :class="actionButtonVariants({ status: mappedProgress.status })">
            <div
              v-if="mappedProgress.status !== 'in-progress'"
              class="to-[rgba(255, 255, 255, 0)] absolute inset-0 top-0.5 h-full w-full bg-linear-to-b from-[#fff] from-0% to-100% opacity-16"
            ></div>

            <template v-if="mappedProgress.hasRedemption">
              <a
                v-if="mappedProgress.status === 'claimed' && mappedProgress.reward?.type === 'gift'"
                :href="`https://gft.ph/${mappedProgress.token?.link}`"
                target="_blank"
                class="relative z-10 h-full w-full leading-10"
              >
                {{ mappedActionLabel[mappedProgress.status] }}
              </a>

              <RenderlessRewardRedemption
                v-else-if="mappedProgress.status === 'unclaimed'"
                :key="mappedProgress.token?.tokenId"
                :programId="campaign.programId"
                :campaignId="campaign.id"
                :token="mappedProgress.token"
                @onSuccess="handleRedeemSuccess"
                @onError="handleRedeemError"
                v-slot="{ handleClaim, isPending }"
              >
                <button
                  class="relative z-10 h-full w-full cursor-pointer disabled:cursor-not-allowed"
                  @click="handleClaim"
                  :disabled="isPending"
                >
                  <Icon
                    v-if="isPending"
                    name="lucide:loader-circle"
                    class="animate-spin text-2xl"
                  />
                  <span v-else>
                    {{ mappedActionLabel[mappedProgress.status] }}
                  </span>
                </button>
              </RenderlessRewardRedemption>
            </template>

            <span v-else>
              {{ mappedActionLabel[mappedProgress.status] }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <Toaster position="bottom-center" richColors />
  </div>
</template>
