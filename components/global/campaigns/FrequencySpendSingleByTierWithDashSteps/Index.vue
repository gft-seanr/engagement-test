<script setup lang="ts">
import { type HTMLAttributes, h, resolveComponent } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';
import { cva } from 'class-variance-authority';

interface CampaignProps {
  title: string;
  description?: string;
  iconUrl?: string;
  unit: ProgramUnit;
  rewards: BaseReward;
  progress: BaseProgress;
  statusLabel?: Record<Status, string>;
  alert?: {
    map: AlertMap<RedeemTokenErrorCode | ProgramErrorCode | TokenErrorCode>;
  };
}

type Status = 'claimed' | 'unclaimed' | 'in-progress' | 'expired' | 'completed';

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes?: Classes;
}

const defaultStatusLabel: Record<Status, string> = {
  'in-progress': 'Reward Locked',
  unclaimed: 'Claim Reward',
  claimed: 'Open Reward',
  expired: 'Expired',
  completed: 'Complete ✓',
};

const {
  title,
  unit,
  rewards: rewardsConfig,
  progress: progressConfig,
  classes,
  statusLabel,
  alert,
} = defineProps<Props>();

const campaign = useCampaignState();

// TEST
const programId = 'prog-123-abc';

// Data fetching: program info and tokens
const {
  programInfo,
  isLoading: isProgramInfoLoading,
  alerts: programInfoAlerts,
} = useProgramInfoQuery({
  programId: programId,
  alertMap: alert?.map,
});

const {
  tokens,
  isLoading: isTokenLoading,
  alerts: tokenAlerts,
} = useTokensQuery({
  programId: programId,
  alertMap: alert?.map,
});

// Alerts and loading states
const { alerts, hasAlerts } = useAlertCollection(programInfoAlerts, tokenAlerts);
const isLoading = useIsLoading([isProgramInfoLoading, isTokenLoading]);

// Progress and reward mapping
const { isComplete, progressByTier, progress } = useProgramProgress({
  baseProgress: progressConfig,
  programInfo,
});

const { baseReward } = useProgramReward({
  baseReward: rewardsConfig,
  programInfo,
});

const { mappedSingleProgressItem: mappedProgress } = useProgressWithRewardAndToken({
  progress: progressByTier,
  rewards: baseReward,
  tokens,
  getStatus: getProgressStatus,
});

// Redemption handling
const { handleRedeemSuccess, handleRedeemError } = useRedemptionHandler();

// Display states: Progress and Status labels and class variants
const { remainingLabel, targetLabel, formattedCurrent } = useProgressDisplay(programInfo, unit);
const { mergedConfig: mappedStatusLabel } = useMergedConfig(defaultStatusLabel, statusLabel);
const { wrapperVariants, actionButtonVariants } = useClassVariants();

// Methods
function getProgressStatus(options: { progress?: ProgressItem; token?: Token }) {
  // const progress = programInfo.value?.progress;
  const { token, progress } = options;

  if (!progress) return 'in-progress';

  //Todo: check if expired
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
      // Without redemption
      return 'completed';
    }
  }

  return 'in-progress';
}

function useRedemptionHandler() {
  function handleRedeemSuccess() {
    const iconUrl = mappedProgress.value?.reward?.claimIconUrl;
    const IconComponent = resolveComponent('Icon');

    toast.success(mappedProgress.value?.reward?.claimTitle || '', {
      description:
        mappedProgress.value?.reward?.claimDescription ||
        'You have successfully claimed your reward.',
      icon: iconUrl ? h(IconComponent, { name: iconUrl, class: 'text-xl' }) : undefined,
    });
  }

  function handleRedeemError(alerts: Alert[]) {
    const alert = alerts[0];

    toast.error(alert?.title || '', {
      description: alert.description,
    });
  }

  return {
    handleRedeemSuccess,
    handleRedeemError,
  };
}

function useClassVariants() {
  const wrapperVariants = cva('overflow-hidden rounded-3xl border', {
    variants: {
      status: {
        'in-progress':
          'bg-constant-white border-border-neutral dark:border-neutral-700 dark:bg-neutral-900',
        unclaimed: 'border-primary bg-primary-soft dark:bg-primary-dark-soft',
        claimed: '',
        completed: '',
        expired: 'border-gray-300 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900',
      },
    },
    compoundVariants: [
      {
        status: ['claimed', 'completed'],
        class: 'border-primary bg-primary-soft dark:bg-primary-dark-soft',
      },
    ],
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const actionButtonVariants = cva(
    'relative flex h-10 items-center justify-center border-t text-center text-sm tracking-wide',
    {
      variants: {
        status: {
          'in-progress':
            'cursor-not-allowed border-border-neutral bg-surface-lower-2 text-text-muted dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500',
          unclaimed:
            'border-primary bg-primary font-bold text-white hover:bg-primary/90 dark:bg-primary-dark',
          claimed: 'hover:bg-primary/90 dark:hover:bg-primary-dark/90',
          completed: '',
          expired: 'cursor-not-allowed bg-gray-400 text-white dark:bg-neutral-600',
        },
      },
      compoundVariants: [
        {
          status: ['claimed', 'completed'],
          class: 'border-primary bg-primary font-bold text-white dark:bg-primary-dark',
        },
      ],
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  return {
    wrapperVariants,
    actionButtonVariants,
  };
}
</script>
<template>
  <div :class="cn('flex flex-col gap-6', classes?.outer)">
    <template v-if="programInfo === null || hasAlerts">
      <alert-card :alerts="[alerts[0]]"> </alert-card>
    </template>

    <template v-if="isLoading">
      <div class="animate-pulse">
        <div
          class="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex flex-col gap-5 px-5 py-6">
            <div class="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>

            <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex justify-between">
              <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700">
            <div class="h-10 w-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div class="mx-auto mt-5 h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mx-auto mt-2 h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </template>

    <template v-else>
      <div v-if="mappedProgress" :class="wrapperVariants({ status: mappedProgress.status })">
        <div class="flex flex-col gap-5 px-5 py-6">
          <h2 class="text-xl font-bold dark:text-neutral-100">{{ title }}</h2>
          <p v-if="description" class="text-text-secondary dark:text-neutral-400">
            {{ description }}
          </p>

          <ProgressDashSteps :current="progress.current" :target="progress.target" hasAnimation />

          <div
            class="flex font-heading text-sm"
            :class="mappedProgress.status === 'completed' ? 'justify-center' : 'justify-between'"
          >
            <p class="text-text-secondary dark:text-neutral-400">
              Current: {{ formattedCurrent }} of {{ targetLabel }}
            </p>
            <p class="text-green-500">
              <template v-if="mappedProgress.status === 'claimed'">
                {{ mappedStatusLabel['completed'] }}
              </template>
              <template v-else-if="mappedProgress.status === 'in-progress'">
                {{ remainingLabel }}
              </template>
            </p>
          </div>
        </div>
        <div :class="actionButtonVariants({ status: mappedProgress.status })">
          <div
            v-if="mappedProgress.status !== 'in-progress'"
            class="to-[rgba(255, 255, 255, 0)] absolute h-full w-full bg-linear-to-b from-[#fff] from-0% to-100% opacity-16 dark:from-black dark:to-[rgba(0,0,0,0)]"
          ></div>

          <template v-if="mappedProgress.hasRedemption">
            <a
              v-if="mappedProgress.status === 'claimed'"
              :href="`https://gft.ph/${mappedProgress.token?.link}`"
              target="_blank"
              class="relative z-10 h-full w-full leading-10"
            >
              {{ mappedStatusLabel[mappedProgress.status] }}
            </a>

            <RenderlessRewardRedemption
              v-else
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
                :disabled="mappedProgress.status !== 'unclaimed'"
              >
                <Icon v-if="isPending" name="lucide:loader-circle" class="animate-spin text-2xl" />
                <span v-else>
                  {{ mappedStatusLabel[mappedProgress.status] }}
                </span>
              </button>
            </RenderlessRewardRedemption>
          </template>
          <template v-else>
            <span>
              {{ mappedStatusLabel[mappedProgress.status] }}
            </span>
          </template>
        </div>
      </div>

      <p class="text-center text-sm dark:text-neutral-400" v-if="mappedProgress?.reward">
        {{ mappedProgress.description }}
      </p>
    </template>

    <Toaster position="bottom-center" richColors />
  </div>
</template>
