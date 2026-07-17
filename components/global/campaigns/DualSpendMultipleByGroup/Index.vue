<script setup lang="ts">
import { animate, stagger } from 'motion-v';
import { type HTMLAttributes } from 'vue';
import { usePreferredColorScheme } from '@vueuse/core';
import { cva } from 'class-variance-authority';

interface CampaignProps {
  rewards: Record<string, GroupedReward> | Record<string, BaseReward>;
  progress: Record<string, GroupedProgress> | Record<string, BaseProgress>;
  completeMessage: string;
  pendingMessage: string;
  helpContent?: SheetMarkdownPropsWithClasses;
}

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes: Classes;
}

type Status = 'in-progress' | 'completed' | 'skipped';

const statusLabel: Record<Status, string> = {
  'in-progress': 'Locked',
  completed: 'Complete',
  skipped: 'Skipped',
};

const { rewards: rewardsConfig, progress: progressConfig } = defineProps<Props>();

const {
  programs,
  userInfo,
  alerts: programsAlerts,
  isLoading: isProgramsLoading,
} = useProgramsQuery();

// Accumulated Program
const {
  programInfo: accumulatedProgramInfo,
  alerts: accumulatedProgramAlerts,
  isLoading: isAccumulatedProgramInfoLoading,
} = useProgramInfoByType(programs, PROGRAM_TYPE.accumulated);

const accumulatedProgressConfig = computed(() => {
  return progressConfig[accumulatedProgramInfo.value?.programId || ''] as GroupedProgress;
});

const {
  progressByCardType: accumulatedProgressByCardType,
  progress: accumulatedProgress,
  multiCheckpointPercentage: accumulatedPercentage,
  isComplete: isAccumulatedProgressComplete,
} = useProgramProgress({
  programInfo: accumulatedProgramInfo,
  groupedProgress: accumulatedProgressConfig,
  userInfo,
});

const accumulatedRewardConfig = computed(() => {
  return rewardsConfig[accumulatedProgramInfo.value?.programId || ''] as GroupedReward;
});

const { rewardByCardType: accumulatedRewardsByCardType } = useProgramReward({
  programInfo: accumulatedProgramInfo,
  groupedReward: accumulatedRewardConfig,
  userInfo,
});

const { mappedProgress: mappedAccumulatedProgress } = useProgressWithRewardAndToken({
  progress: accumulatedProgressByCardType,
  rewards: accumulatedRewardsByCardType,
  getStatus: getAccumulatedProgressStatus,
});

const hasCompletedProgress = computed(() => {
  return mappedAccumulatedProgress.value?.some((progress) => progress.status === 'completed');
});

const hasSkippedProgress = computed(() => {
  return mappedAccumulatedProgress.value?.some((progress) => progress.status === 'skipped');
});

function getAccumulatedProgressStatus(options: { progress?: ProgressItem }): Status {
  const { progress: progressConfig } = options;

  if (!progressConfig) {
    return 'in-progress';
  }

  // Checks if the next tier is already completed and mark current tier as skipped if so
  const nextTier = progressConfig.tier + 1;

  const accumulatedProgressByCardTypeArray = Array.isArray(accumulatedProgressByCardType.value)
    ? accumulatedProgressByCardType.value
    : [];

  const nextTierProgressConfig = accumulatedProgressByCardTypeArray.find(
    (progress) => progress.tier === nextTier
  );

  if (
    nextTierProgressConfig &&
    accumulatedProgress.value.current >= (nextTierProgressConfig?.target || 0)
  ) {
    return 'skipped';
  }

  if (accumulatedProgress.value.current >= (progressConfig?.target || 0)) {
    return 'completed';
  }

  return 'in-progress';
}

// Frequency Program
const {
  programInfo: frequencyProgramInfo,
  alerts: frequencyProgramAlerts,
  isLoading: isFrequencyProgramInfoLoading,
} = useProgramInfoByType(programs, PROGRAM_TYPE.frequency);

const frequencyProgressConfig = computed(() => {
  return progressConfig[frequencyProgramInfo.value?.programId || ''] as BaseProgress;
});

const {
  isComplete: isFrequencyProgressComplete,
  progress: frequencyProgress,
  baseProgress: frequencyBaseProgress,
} = useProgramProgress({
  programInfo: frequencyProgramInfo,
  baseProgress: frequencyProgressConfig,
});

const frequencyRewardConfig = computed(() => {
  return rewardsConfig[frequencyProgramInfo.value?.programId || ''] as BaseReward;
});

const { baseReward: frequencyReward } = useProgramReward({
  programInfo: frequencyProgramInfo,
  baseReward: frequencyRewardConfig,
});

const { mappedProgress: mappedFrequencyProgress } = useProgressWithRewardAndToken({
  progress: frequencyBaseProgress,
  rewards: frequencyReward,
  getStatus: getFrequencyProgressStatus,
});

function getFrequencyProgressStatus(options: { progress?: ProgressItem }): Status {
  const { progress: progressConfig } = options;

  if (!progressConfig) {
    return 'in-progress';
  }

  if (frequencyProgress.value.current >= (progressConfig?.target || 0)) {
    return 'completed';
  }

  return 'in-progress';
}

// Loading and Alerts etc.
const hasLoading = useIsLoading([
  isProgramsLoading,
  isAccumulatedProgramInfoLoading,
  isFrequencyProgramInfoLoading,
]);

const { alerts, hasAlerts } = useAlertCollection(
  programsAlerts,
  accumulatedProgramAlerts,
  frequencyProgramAlerts
);

const { runAnimation, animatedCurrentProgress, animatedPercentage } = useProgressAnimation();

const { formatToShortNumber } = useShortNumberFormat();

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const { rewardWrapperVariants, rewardTextVariants } = useClassVariants();

function useProgramInfoByType(programs: Ref<Program[]>, programTypeId: ProgramTypeId) {
  const program = computed(() => {
    return programs.value.find((program) => program.programTypeId === programTypeId);
  });

  const programId = computed(() => {
    return program.value?.programId || '';
  });

  const { programInfo, alerts, isLoading } = useProgramInfoQuery({ programId });

  return {
    programInfo,
    program,
    programId,
    alerts,
    isLoading,
  };
}

function useProgressAnimation() {
  const preferredColor = usePreferredColorScheme();
  const animatedPercentage = ref(0);
  const animatedCurrentProgress = ref(0);
  const isAnimationComplete = ref(false);
  const ANIMATION_DURATION = 1;

  async function runAnimation() {
    // Progress bar animation
    animate(0, accumulatedPercentage.value, {
      duration: ANIMATION_DURATION,
      ease: [0.25, 0.46, 0.45, 0.98],
      onUpdate: (latest) => {
        animatedPercentage.value = latest;
      },
    });

    // Progress amount Animation
    animate(0, accumulatedProgress.value.current, {
      duration: ANIMATION_DURATION,
      ease: [0.25, 0.46, 0.45, 0.98],
      onUpdate: (latest) => {
        animatedCurrentProgress.value = latest;
      },
    });

    const options = {
      delay: stagger(1, { startDelay: ANIMATION_DURATION }),
      duration: 0.2,
      ease: 'easeIn',
    } as const;

    if (hasCompletedProgress.value || isFrequencyProgressComplete.value) {
      // Reward completion animation
      animate(
        '.complete-reward',
        { backgroundColor: ['var(--surface-primary)', 'var(--success-soft)'] },
        options
      );

      animate('.complete-check', { opacity: [0, 1], scale: [0, 1.5, 1] }, options);

      animate(
        '.complete-text',
        {
          opacity: [0.9, 1],
          color: ['var(--text-secondary)', 'var(--text-success)'],
        },
        options
      );
    }

    if (hasSkippedProgress.value) {
      animate(
        '.skipped-reward',
        {
          backgroundColor: [
            'var(--surface-primary)',
            preferredColor.value === 'dark'
              ? 'var(--secondary-dark-soft)'
              : 'var(--secondary-soft)',
          ],
        },
        options
      );

      animate('.skipped-minus', { opacity: [0, 1], scale: [0, 1.5, 1] }, options);

      animate(
        '.skipped-text',
        {
          opacity: [0.9, 1],
          color: [
            'var(--text-secondary)',
            preferredColor.value === 'dark' ? 'var(--primary-dark)' : 'var(--primary)',
          ],
        },
        options
      );
    }
  }

  return {
    runAnimation,
    animatedCurrentProgress,
    animatedPercentage,
    isAnimationComplete,
  };
}

function useClassVariants() {
  const rewardWrapperVariants = cva(
    'flex items-center justify-between border-border-neutral p-5 [&:nth-child(n+2)]:border-t',
    {
      variants: {
        status: {
          'in-progress': '',
          completed: 'complete-reward',
          skipped: 'skipped-reward',
        },
      },
      defaultVariants: {
        status: 'in-progress',
      },
    }
  );

  const rewardTextVariants = cva('', {
    variants: {
      status: {
        'in-progress': 'text-text-secondary',
        completed: 'complete-text text-text-success',
        skipped: 'skipped-text text-primary',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  return {
    rewardWrapperVariants,
    rewardTextVariants,
  };
}

function customizeIcon(content: string) {
  return content.replace(/stroke-width="2"/g, `stroke-width="3"`);
}

watch(hasLoading, async (hasLoading) => {
  if (!hasLoading) {
    await nextTick();

    runAnimation();
  }
});
</script>
<template>
  <div :class="classes?.outer">
    <div v-if="hasLoading" class="animate-pulse">
      <!-- Progress Info Skeleton -->
      <div class="mt-6 h-16 text-center">
        <div class="mx-auto h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mx-auto mt-3 h-5 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Progress Bar Skeleton -->
      <div class="relative mx-6 mt-6">
        <div class="h-3.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>

        <div class="mt-5 flex justify-between">
          <div class="h-4 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Rewards Cards Skeleton -->
      <div
        class="mx-6 mt-6 rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
      >
        <div class="flex h-22 items-center justify-between p-5" v-for="counter in 3">
          <div class="flex-1">
            <div class="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="h-6 w-6 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <div class="mt-6 text-center">
        <div class="mx-auto mt-3 h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mx-auto mt-2 h-4 w-80 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>

    <div v-else :class="classes?.rewards">
      <div class="mt-4 text-center">
        <div v-if="hasAlerts" class="mb-6 px-6">
          <alert-card :alerts="alerts"> </alert-card>
        </div>

        <div class="relative mx-6">
          <p class="font-heading text-6xl leading-8 font-bold text-text-primary">
            P{{
              animatedCurrentProgress.toLocaleString('en-us', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>

          <SheetMarkdownContent
            v-if="helpContent"
            v-bind="helpContent"
            :triggerIcon="'lucide:info'"
            :classes="{
              outer: 'p-0 bg-transparent mx-0 cursor-pointer absolute inset-y-0 right-0',
              triggerIcon: 'text-4xl text-text-muted hover:text-primary',
              ...classes.helpContent?.classes,
            }"
          ></SheetMarkdownContent>
        </div>

        <p class="mt-3 text-sm" v-if="accumulatedProgramInfo?.description">
          {{ accumulatedProgramInfo.description }}
        </p>
      </div>

      <div class="relative mx-6 mt-6">
        <Progress
          v-model="animatedPercentage"
          class="progress h-2.5 rounded-full border border-border-neutral bg-surface-disable [&>div]:bg-secondary"
        />

        <div
          class="absolute top-0 h-2.5 w-full transition-transform after:absolute after:top-1/2 after:-right-2 after:z-20 after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:border after:border-border-neutral after:bg-white after:content-['']"
          :style="`transform: translateX(-${100 - animatedPercentage}%)`"
        ></div>

        <div
          class="mt-6 grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(38px,38px))] justify-between text-xs text-text-secondary"
        >
          <span class="">P0</span>
          <span
            class="text-center uppercase last:text-right"
            v-for="accumulatedProgress in mappedAccumulatedProgress"
            :key="accumulatedProgress.tier"
          >
            P{{ formatToShortNumber(accumulatedProgress.target) }}
          </span>
        </div>
      </div>

      <div class="mx-6 mt-6">
        <div
          class="complete-container z-20 overflow-hidden rounded-2xl border border-border-neutral bg-surface-primary"
          :class="{
            'bg-surface-lower-1': !isAccumulatedProgressComplete,
          }"
          v-if="mappedAccumulatedProgress?.length || mappedFrequencyProgress?.length"
        >
          <template v-if="mappedAccumulatedProgress?.length">
            <ReuseTemplate
              v-for="progress in mappedAccumulatedProgress"
              :progress="progress"
              :statusLabel="statusLabel"
              :key="progress.tier"
            ></ReuseTemplate>
          </template>

          <template v-if="mappedFrequencyProgress?.length">
            <ReuseTemplate
              v-for="progress in mappedFrequencyProgress"
              :progress="progress"
              :statusLabel="statusLabel"
              :key="progress.tier"
            ></ReuseTemplate>
          </template>
        </div>
      </div>

      <Markdown
        v-if="isAccumulatedProgressComplete && isFrequencyProgressComplete"
        :content="completeMessage"
        :class="cn('mt-6 px-6 text-center text-sm text-text-secondary', classes.completeMessage)"
        tag="p"
      />
      <Markdown
        v-else-if="hasCompletedProgress || hasSkippedProgress || isFrequencyProgressComplete"
        :content="pendingMessage"
        :class="cn('mt-6 px-6 text-center text-sm text-text-secondary', classes.pendingMessage)"
        tag="p"
      />
    </div>

    <DefineTemplate v-slot="{ progress, statusLabel }">
      <div :class="rewardWrapperVariants({ status: progress.status })">
        <div>
          <p class="font-bold">{{ progress.reward?.rewardName }}</p>
          <p class="mt-2 text-xs">
            <span class="text-text-secondary">{{ progress.reward?.targetDescription }}</span>
            •
            <span :class="rewardTextVariants({ status: progress.status })">
              {{ statusLabel[progress.status] }}
            </span>
          </p>
        </div>

        <div
          class="shadow-inset-custom flex size-6 items-center justify-center rounded-md border border-border-neutral bg-surface-lower-1 p-0.5"
        >
          <Icon
            v-if="progress.status === 'skipped'"
            :customize="customizeIcon"
            :size="'1.5em'"
            name="lucide:minus"
            class="skipped-minus stroke-3 text-primary"
          />
          <Icon
            v-else-if="progress.status === 'completed'"
            :customize="customizeIcon"
            :size="'1.5em'"
            name="lucide:check"
            class="complete-check text-text-success"
          />
        </div>
      </div>
    </DefineTemplate>
  </div>
</template>
