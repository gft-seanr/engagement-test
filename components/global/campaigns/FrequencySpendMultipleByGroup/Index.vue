<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';

interface CampaignProps {
  title?: string;
  description?: string;
  iconUrl?: string;
  rewards: GroupedReward;
  progress: GroupedProgress;
  statusLabels?: Record<Status, StatusLabel>;
  alert?: {
    map: AlertMap<RedeemTokenErrorCode | ProgramErrorCode | TokenErrorCode>;
  };
}

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes?: Classes;
}

interface StatusLabel {
  cta?: string;
}

type Status = 'in-progress' | 'unclaimed' | 'claimed' | 'expired';

const defaultStatusLabels: Record<Status, StatusLabel> = {
  'in-progress': { cta: 'Locked' },
  unclaimed: { cta: 'Claim' },
  claimed: { cta: 'Open' },
  expired: { cta: 'Expired' },
};

const {
  rewards: rewardsConfig,
  progress: progressConfig,
  classes,
  statusLabels,
  alert,
} = defineProps<Props>();

const campaign = useCampaignState();

// Data fetching: program info and tokens
const {
  userInfo,
  isLoading: isProgramsLoading,
  alerts: programsAlerts,
} = useProgramsQuery({
  programId: campaign.value.programId,
});

const {
  programInfo,
  alerts: programInfoAlerts,
  isLoading: isProgramInfoLoading,
} = useProgramInfoQuery({
  programId: campaign.value.programId,
  alertMap: alert?.map,
});

const {
  tokens,
  isLoading: isTokensLoading,
  alerts: tokensAlerts,
  highestTierToken,
} = useTokensQuery({ programId: campaign.value.programId, alertMap: alert?.map });

// Alerts and loading states
const isLoading = useIsLoading([isProgramsLoading, isProgramInfoLoading, isTokensLoading]);
const { alerts, hasAlerts } = useAlertCollection(programsAlerts, programInfoAlerts, tokensAlerts);

// Progress and reward mapping
const { isComplete, progressByGroup, progress } = useProgramProgress({
  programInfo,
  groupedProgress: progressConfig,
  userInfo,
});

const { rewardByGroup } = useProgramReward({
  programInfo,
  groupedReward: rewardsConfig,
  userInfo,
});

const { mappedProgress } = useProgressWithRewardAndToken({
  progress: progressByGroup,
  rewards: rewardByGroup,
  tokens,
  getStatus: getProgressStatus,
});

// Redemption handlers
const { handleRedeemError } = useRedemptionHandler();

// Display states: labels and class variants
const { mergedConfig: mappedStatusLabel } = useMergedConfig<Status, StatusLabel>(
  defaultStatusLabels,
  statusLabels
);
const { wrapperVariants, ctaVariants, progressCheckpointVariants } = useClassVariants();

// Methods
function getProgressStatus(options: { progress?: ProgressItem; token?: Token }): Status {
  const { progress: progressConfig, token } = options;

  if (!progressConfig) {
    return 'in-progress';
  }
  // Todo: check if expired
  // if (isExpired) return 'expired';

  if (!token) {
    // For progress without rewards, check if tier is reached
    if (!progressConfig.hasRedemption && progress.value.current >= (progressConfig?.tier || 0)) {
      return 'claimed';
    }

    return 'in-progress';
  }

  if (token.statusId === TOKEN_STATUS.redeemed) return 'claimed';
  if (token.statusId === TOKEN_STATUS.active) return 'unclaimed';

  return 'in-progress';
}

function useClassVariants() {
  const wrapperVariants = cva(
    'flex items-center justify-between gap-2 rounded-2xl border p-4 transition-colors duration-300 xs:p-5',
    {
      variants: {
        status: {
          'in-progress': '',
          expired: '',
          unclaimed: '',
          claimed: '',
          completed: '',
        },
        isActive: {
          true: '',
          false: '',
        },
        isComplete: {
          true: '',
          false: '',
        },
      },
      compoundVariants: [
        {
          status: ['in-progress', 'expired'],
          class: 'border-border-neutral bg-surface-raised',
        },
        {
          status: ['unclaimed', 'claimed'],
          isActive: true,
          class:
            'border-secondary bg-secondary-soft dark:border-secondary-dark dark:bg-secondary-dark-soft',
        },
        {
          status: ['unclaimed', 'claimed'],
          isActive: true,
          isComplete: true,
          class: 'border-success bg-success-soft',
        },
      ],
      defaultVariants: {
        status: 'in-progress',
        isActive: false,
        isComplete: false,
      },
    }
  );

  const ctaVariants = cva(
    'flex h-10 items-center justify-center overflow-hidden rounded-full border px-4 text-sm font-bold transition-colors duration-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-50',
    {
      variants: {
        status: {
          'in-progress': '',
          unclaimed: '',
          claimed: '',
          expired: '',
          completed: '',
        },
        isActive: {
          true: '',
          false: '',
        },
        isComplete: {
          true: '',
          false: '',
        },
      },
      compoundVariants: [
        {
          status: ['claimed', 'unclaimed'],
          class: 'cursor-pointer text-white',
        },
        {
          status: ['in-progress', 'expired'],
          class: 'cursor-not-allowed border-border-neutral bg-surface-lower-2 text-text-muted',
        },
        {
          status: ['claimed', 'unclaimed'],
          isActive: true,
          class: 'border-secondary bg-secondary',
        },
        {
          status: ['claimed', 'unclaimed'],
          isActive: true,
          isComplete: true,
          class: 'border-success bg-success',
        },
      ],
      defaultVariants: {
        status: 'in-progress',
        isActive: false,
      },
    }
  );

  const progressCheckpointVariants = cva(
    'size-10 rounded-full border-10 transition-colors duration-300',
    {
      variants: {
        status: {
          'in-progress': '',
          unclaimed: '',
          claimed: '',
          expired: '',
          completed: '',
        },
        isHighestTier: {
          true: '',
          false: '',
        },
        isActive: {
          true: '',
          false: 'bg-surface-primary',
        },
        isComplete: {
          true: '',
          false: '',
        },
      },
      compoundVariants: [
        {
          status: ['in-progress', 'expired'],
          class: 'bg-surface-primary',
        },
        {
          status: ['unclaimed', 'claimed'],
          isActive: true,
          class: 'border-secondary bg-secondary',
        },
        {
          status: ['claimed', 'unclaimed'],
          isActive: true,
          isComplete: true,
          class: 'border-success bg-success',
        },
        {
          status: ['claimed', 'unclaimed'],
          isHighestTier: true,
          isActive: true,
          class: 'bg-surface-primary',
        },
      ],
      defaultVariants: {
        status: 'in-progress',
        isHighestTier: false,
        isActive: false,
      },
    }
  );

  return {
    wrapperVariants,
    ctaVariants,
    progressCheckpointVariants,
  };
}

function useRedemptionHandler() {
  function handleRedeemError(alert: Alert) {
    if (!alert) return;

    toast.error(alert.description || GENERAL_ALERT['InternalServerError'], {
      duration: 5000,
    });
  }
  return { handleRedeemError };
}
</script>
<template>
  <div :class="cn('outer min-h-75.5', classes?.outer)">
    <template v-if="programInfo === null || hasAlerts">
      <alert-card :alerts="[alerts[0]]"> </alert-card>
    </template>

    <template v-if="isLoading">
      <div class="animate-pulse">
        <ProgressAccumulatedTier
          :tier="0"
          :animation-config="{ isAnimated: false, speedMs: 0 }"
          :progress-bar-style="{
            fillColorHex: '#e5e7eb',
            widthPx: 8,
          }"
        >
          <ProgressAccumulatedTierItem
            v-for="count in 3"
            :key="`skeleton-${count}`"
            :index="count - 1"
          >
            <ProgressAccumulatedTierItemCheckpoint>
              <div
                class="size-10 rounded-full border-10 border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700"
              ></div>
            </ProgressAccumulatedTierItemCheckpoint>

            <ProgressAccumulatedTierItemCard>
              <div
                class="rounded-2xl border border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
                <div class="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </ProgressAccumulatedTierItemCard>
          </ProgressAccumulatedTierItem>
        </ProgressAccumulatedTier>
      </div>
    </template>

    <template v-else>
      <ProgressAccumulatedTier
        :tier="progress?.current || 0"
        :animation-config="{ isAnimated: true, speedMs: 300 }"
        :progress-bar-style="{
          fillColorHex: isComplete ? 'var(--success)' : 'var(--secondary)',
          widthPx: 8,
        }"
      >
        <ProgressAccumulatedTierItem v-for="(progress, i) in mappedProgress" :key="i" :index="i">
          <ProgressAccumulatedTierItemCheckpoint v-slot="{ isActive }">
            <div
              :class="
                progressCheckpointVariants({
                  status: progress.status,
                  isActive,
                  isHighestTier: progress.token?.tier === highestTierToken?.tier && isActive,
                  isComplete,
                })
              "
            ></div>
          </ProgressAccumulatedTierItemCheckpoint>

          <ProgressAccumulatedTierItemCard v-slot="{ isActive }">
            <div :class="wrapperVariants({ status: progress.status, isActive, isComplete })">
              <div>
                <p class="flex items-center gap-1 font-bold">
                  <TransitionGroup name="list">
                    <Icon key="1" v-if="isActive" name="lucide:check" class="text-lg" />
                    <span key="2">{{ progress?.title }}</span>
                  </TransitionGroup>
                </p>
                <p class="mt-1 text-sm" v-if="progress.description">
                  {{ progress.description }}
                </p>
              </div>

              <div v-if="progress.hasRedemption">
                <RenderlessRewardRedemption
                  :key="progress.token?.tokenId"
                  :program-id="campaign.programId"
                  :campaign-id="campaign.id"
                  :token="progress.token"
                  @onError="handleRedeemError"
                  v-slot="{ handleClaim, isPending, isRedeemSuccessful, resetRedemption }"
                >
                  <button
                    v-if="progress.status === 'unclaimed'"
                    :class="ctaVariants({ status: progress.status, isActive, isComplete })"
                    :disabled="isPending"
                    @click="handleClaim"
                  >
                    <span v-if="isPending">
                      <Icon name="lucide:loader-circle" class="animate-spin" />
                    </span>
                    <span v-else> {{ mappedStatusLabel[progress.status].cta }} </span>
                  </button>

                  <a
                    v-else-if="progress.status === 'claimed'"
                    :href="`https://gft.ph/${progress.token?.link}`"
                    :class="ctaVariants({ status: progress.status, isActive, isComplete })"
                    target="_blank"
                  >
                    {{ mappedStatusLabel[progress.status].cta }}
                  </a>

                  <span
                    v-else
                    :class="ctaVariants({ status: progress.status, isActive, isComplete })"
                  >
                    {{ mappedStatusLabel[progress.status].cta }}
                  </span>

                  <Drawer
                    :open="isRedeemSuccessful"
                    @update:open="(value: boolean) => !value && resetRedemption"
                  >
                    <DrawerContent
                      class="mx-auto max-h-[90%]! rounded-t-2xl! px-6 pt-2 pb-10 text-center xs:max-w-103.5"
                    >
                      <DrawerHeader>
                        <DrawerTitle class="text-center font-heading text-xl font-bold">
                        </DrawerTitle>
                        <DrawerClose
                          class="absolute top-0 right-0 h-14 w-14"
                          @click="resetRedemption"
                        >
                          <Icon name="lucide:x" class="text-2xl" />
                        </DrawerClose>
                        <DrawerDescription class="sr-only"></DrawerDescription>
                      </DrawerHeader>

                      <div class="flex flex-col items-center justify-center gap-6">
                        <div
                          class="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-success p-4 leading-none"
                        >
                          <Icon name="lucide:check" class="text-6xl text-white" />
                        </div>
                        <div class="flex flex-col gap-3">
                          <h2 class="font-heading text-3xl font-bold text-text-primary">
                            {{ progress.reward?.claimTitle || 'Reward Claimed' }}
                          </h2>
                          <p class="font-heading text-sm leading-6 text-text-secondary">
                            {{ progress.reward?.claimDescription || 'Enjoy your eGC' }}
                          </p>
                        </div>

                        <div
                          class="flex w-full gap-4 rounded-2xl border border-primary bg-primary-soft p-5"
                        >
                          <div
                            class="flex size-12 items-center justify-center rounded-[7px] bg-surface-primary p-3"
                          >
                            <img
                              :src="progress.reward?.rewardImageUrl"
                              :alt="progress.reward?.rewardName"
                            />
                          </div>
                          <div class="flex flex-col justify-center gap-2">
                            <p class="text-lg font-bold">
                              {{ progress.reward?.rewardName }}
                            </p>
                            <p
                              class="wrap-break-word text-text-secondary"
                              v-if="progress.reward?.rewardDescription"
                            >
                              {{ progress.reward.rewardDescription }}
                            </p>
                          </div>
                        </div>
                        <div class="flex w-full justify-between gap-4">
                          <button
                            class="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-border-primary bg-surface-lower-2 px-6 py-2.5 font-bold text-text-secondary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            @click="resetRedemption"
                          >
                            Back to Home
                          </button>
                          <a
                            target="_blank"
                            :href="progress.token ? `https://gft.ph/${progress.token.link}` : '#'"
                            class="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-border-neutral bg-primary px-6 py-2.5 font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Open Reward
                          </a>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </RenderlessRewardRedemption>
              </div>
            </div>
          </ProgressAccumulatedTierItemCard>
        </ProgressAccumulatedTierItem>
      </ProgressAccumulatedTier>
    </template>
    <Toaster position="bottom-center" richColors />
  </div>
</template>
