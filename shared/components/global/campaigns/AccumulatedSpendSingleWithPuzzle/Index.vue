<script setup lang="ts">
import { animate, stagger } from 'motion-v';
import { type HTMLAttributes } from 'vue';
import { useIsFetching } from '@tanstack/vue-query';
import { usePreferredColorScheme } from '@vueuse/core';

interface CampaignProps {
  rewards: Record<string, Record<string, RewardItem>>;
  puzzleItems: PuzzleItem[];
  emptyPuzzleUrl: string;
  completePuzzleUrl: string;
  helpContent?: SheetMarkdownPropsWithClasses;
}

interface PuzzleItem {
  url: string;
  width: number;
  height: number;
  x: number;
  y: number;
  order: number;
  isVisible?: boolean;
}

interface Classes extends NestedClasses<CampaignProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends CampaignProps {
  classes: Classes;
}

interface BaseProgress {
  current: number;
  target: number;
  tier?: number;
  remaining?: number;
  percentage?: number;
}

const { rewards, puzzleItems, emptyPuzzleUrl, completePuzzleUrl, helpContent } =
  defineProps<Props>();

const { programs, userInfo, alerts: programAlerts } = useProgramsQuery();

// Accumulated Program
const { programInfo: accumulatedProgramInfo, alerts: accumulatedProgramAlerts } =
  useProgramInfoByType(programs, PROGRAM_TYPE.accumulated);

const {
  progress: accumulatedProgress,
  percentage: accumulatedPercentage,
  isComplete: isAccumulatedProgramComplete,
} = useProgressCalculation(accumulatedProgramInfo);

const { rewardByCardType: accumulatedReward } = useRewardMapperByProgramId(
  accumulatedProgramInfo,
  rewards,
  userInfo
);

// Frequency Program
const { programInfo: frequencyProgramInfo, alerts: frequencyProgramAlerts } = useProgramInfoByType(
  programs,
  PROGRAM_TYPE.frequency
);

const { isComplete: isFrequencyProgramComplete } = useProgressCalculation(frequencyProgramInfo);

const { transactions, isPending } = useTransactionsQuery();

const dateOfLastTransaction = computed(() => {
  if (!transactions.value.length) return '';

  return transactions.value[0].transactionDateTime;
});

const isFetching = useIsFetching();

const { alerts, hasAlerts } = useAlertCollection(
  programAlerts,
  accumulatedProgramAlerts,
  frequencyProgramAlerts
);

const { reward: frequencyReward } = useRewardMapperByProgramId(frequencyProgramInfo, rewards);

const { runAnimation, animatedCurrentProgress, animatedPercentage, isAnimationComplete } =
  usePuzzleAndProgressAnimation(accumulatedProgress, puzzleItems);

const { formatToShortNumber } = useShortNumberFormat();

function useProgramInfoByType(programs: Ref<Program[]>, programTypeId: ProgramTypeId) {
  const program = computed(() => {
    return programs.value.find((program) => program.programTypeId === programTypeId);
  });

  const programId = computed(() => {
    return program.value?.programId || '';
  });

  const { programInfo, alerts } = useProgramInfoQuery({ programId });

  return {
    programInfo,
    program,
    alerts,
    programId,
  };
}

function useRewardMapperByProgramId(
  programInfo: MaybeRefOrGetter<Nullable<Program> | undefined>,
  rewards: MaybeRefOrGetter<Record<string, Record<string, RewardItem>>>,
  userInfo?: MaybeRefOrGetter<Nullable<UserInfo> | undefined>
) {
  const reactiveProgramId = computed(() => {
    const program = toValue(programInfo);
    return program ? program.programId : null;
  });

  const reactiveCardType = computed(() => {
    const user = toValue(userInfo);
    return user ? user.cardType : null;
  });

  const reactiveRewards = computed(() => toValue(rewards));

  const reward = computed(() => reactiveRewards.value[reactiveProgramId.value || '']);

  const rewardByCardType = computed(() => {
    if (reward.value && reactiveCardType.value) {
      const tieredReward = reward.value as Record<string, RewardItem>;
      const normalized: Record<string, RewardItem> = {};

      Object.keys(tieredReward).forEach((key) => {
        const lowerKey = key.toLowerCase();
        normalized[lowerKey] = tieredReward[key];
      });

      return normalized[reactiveCardType.value.toLowerCase()];
    }
  });

  return {
    reward,
    rewardByCardType,
  };
}

function useProgressCalculation(programInfo: ComputedRef<Nullable<Program> | undefined>) {
  const progress = computed(() => {
    return programInfo.value?.progress || { current: 0, target: 0 };
  });

  const percentage = computed(() => {
    if (progress.value.target === 0) return 0;

    return Math.min((progress.value.current / progress.value.target) * 100, 100) || 0;
  });

  const isComplete = computed(() => {
    if (progress.value.target === 0) {
      return false;
    }

    return progress.value.current >= progress.value.target;
  });

  return {
    progress,
    percentage,
    isComplete,
  };
}

function usePuzzleAndProgressAnimation(progress: Ref<BaseProgress>, puzzleItems: PuzzleItem[]) {
  const animatedPercentage = ref(0);
  const animatedCurrentProgress = ref(0);
  const perPuzzleDuration = 0.4;
  const isAnimationComplete = ref(false);

  const animationDuration = computed(() => {
    return visiblePuzzleLength.value * perPuzzleDuration;
  });

  const mappedPuzzleItems = computed(() => {
    const targetPerPuzzleItem = progress.value.target / puzzleItems.length;
    return puzzleItems.map((item) => ({
      ...item,
      isVisible: item.order <= progress.value.current / targetPerPuzzleItem,
    }));
  });

  const visiblePuzzleLength = computed(
    () => mappedPuzzleItems.value.filter((item) => item.isVisible).length
  );

  async function runAnimation() {
    const preferredColor = usePreferredColorScheme();

    // Puzzle item stagger animation
    mappedPuzzleItems.value.forEach((item) => {
      if (item.isVisible) {
        animate(
          `.progress-item[data-order="${item.order}"]`,
          { opacity: [0, 1], scale: [0.95, 1] },
          {
            delay: (item.order - 1) * perPuzzleDuration,
            duration: perPuzzleDuration,
            ease: 'easeOut',
          }
        );
      }
    });

    // Progress bar animation
    animate(0, accumulatedPercentage.value, {
      duration: animationDuration.value,
      ease: [0.25, 0.46, 0.45, 0.98],
      onUpdate: (latest) => {
        animatedPercentage.value = latest;
      },
    });

    // Current Progress Amount Animation
    animate(0, accumulatedProgress.value.current, {
      duration: animationDuration.value,
      ease: [0.25, 0.46, 0.45, 0.98],
      onUpdate: (latest) => {
        animatedCurrentProgress.value = latest;
      },
    });

    if (isAccumulatedProgramComplete.value) {
      animate(
        '.progress div',
        { backgroundColor: '#5D9879' },
        {
          duration: animationDuration.value,
          ease: 'linear',
        }
      );

      animate(
        [
          [
            '.puzzle-complete',
            { opacity: [0, 1] },
            {
              duration: 1,
              ease: 'easeInOut',
            },
          ],
          [
            '.puzzle',
            { rotate: [0, 8, -8, 4, -4, 2, -2, 0] },
            {
              duration: 0.5,
              ease: 'easeIn',
            },
          ],
          [
            '.puzzle-glare',
            {
              x: ['-100%', '150%'],
              opacity: [0, 0.8, 0.8, 0],
            },
            {
              duration: 0.8,
              ease: 'easeOut',
            },
          ],
          [
            '.stars',
            { scale: [1, 1.25, 1], rotate: [0, 8, -8, 4, -4, 2, -2, 0] },
            {
              delay: stagger(0.2),
              duration: 0.4,
              ease: 'easeIn',
            },
          ],
        ],
        { delay: animationDuration.value + 0.5 }
      ).then(() => {
        setTimeout(() => {
          isAnimationComplete.value = true;
        }, 2000);

        animate(
          '.puzzle-glare',
          {
            x: ['-100%', '150%'],
            opacity: [0, 0.8, 0.8, 0],
          },
          {
            delay: 9,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 6,
            ease: 'easeOut',
          }
        );
      });
    }

    if (isAccumulatedProgramComplete.value && isFrequencyProgramComplete.value) {
      await nextTick();

      const borderColor = preferredColor.value === 'dark' ? '#4c7e5f' : '#20c45d';

      animate(
        '.complete-container',
        {
          borderColor: borderColor,
        },
        {
          delay: animationDuration.value + 5.5,
          duration: 0.2,
          ease: 'linear',
        }
      );
    }

    if (isAccumulatedProgramComplete.value || isFrequencyProgramComplete.value) {
      await nextTick();

      const options = {
        delay: stagger(1, { startDelay: animationDuration.value + 4 }),
        duration: 0.2,
        ease: 'easeIn',
      } as const;

      const bgColor =
        preferredColor.value === 'dark' ? 'rgba(219, 251, 231, .3)' : 'rgba(219, 251, 231, 1)';

      animate(
        '.complete-reward',
        { backgroundColor: ['rgba(255, 255, 255, 0.05)', bgColor] },
        options
      );

      animate('.complete-check', { opacity: [0, 1], scale: [0, 1.3, 1] }, options);

      animate(
        '.complete-text',
        {
          opacity: [0.9, 1],
          color: ['#525252', '#20c45d'],
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

watch(isFetching, async (value) => {
  if (value === 0) {
    await nextTick();

    runAnimation();
  }
});
</script>
<template>
  <div :class="cn('bg-surface-primary', classes?.outer)">
    <div class="relative mb-8 flex min-h-72 w-full flex-col justify-between">
      <div class="absolute h-[calc(100%-2rem)] w-full bg-[#222B37]"></div>
      <div class="z-20 flex items-center justify-between px-6 py-4">
        <img
          src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/securitybank/sb-icon.png"
          class="h-7 w-auto"
          alt=""
        />
        <!-- <SheetMarkdownContent
          v-if="helpContent"
          v-bind="helpContent"
          :triggerIcon="'lucide:circle-question-mark'"
        ></SheetMarkdownContent> -->
      </div>

      <ClientOnly>
        <CardContainer style="perspective: 200px">
          <CardBody class="size-54">
            <div
              class="puzzle before:content[''] relative mx-auto size-54 overflow-hidden rounded-4xl bg-gray-200/50 p-1 after:absolute after:inset-0 after:z-20 after:rounded-4xl after:border after:border-white/40"
            >
              <div
                class="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                :style="{
                  backgroundImage: `url(${emptyPuzzleUrl})`,
                }"
              ></div>
              <div
                v-for="(item, index) in puzzleItems"
                :key="index"
                class="progress-item absolute z-20 bg-cover bg-center opacity-0"
                :data-order="item.order"
                :class="{
                  visible: item.isVisible,
                }"
                :style="{
                  top: `${item.y}px`,
                  left: `${item.x}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  backgroundImage: `url(${item.url})`,
                }"
              ></div>

              <div
                class="puzzle-complete absolute inset-0 z-20 h-full w-full bg-cover bg-center opacity-0"
                :style="{
                  backgroundImage: `url(${completePuzzleUrl})`,
                }"
              ></div>

              <div
                class="puzzle-glare glare-effect pointer-events-none absolute inset-0 z-30 h-full w-[150%]"
              ></div>

              <BorderBeam
                v-if="isAnimationComplete"
                :size="108"
                :duration="6"
                :border-width="3"
                class="z-30"
                colorFrom="#F3850D"
                colorTo="#FEF0C3"
              />
            </div>
          </CardBody>
        </CardContainer>
      </ClientOnly>

      <!-- prettier-ignore -->
      <svg class="stars absolute top-1/3 right-1/10" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0456 0.231515C11.1725 -0.0771716 11.6097 -0.0771709 11.7366 0.231515L13.2274 3.85793C14.2894 6.44143 16.3408 8.49277 18.9243 9.55483L22.5507 11.0456C22.8594 11.1725 22.8594 11.6097 22.5507 11.7366L18.9243 13.2274C16.3408 14.2894 14.2894 16.3408 13.2274 18.9243L11.7366 22.5507C11.6097 22.8594 11.1725 22.8594 11.0456 22.5507L9.55484 18.9243C8.49279 16.3408 6.44145 14.2894 3.85794 13.2274L0.23153 11.7366C-0.0771564 11.6097 -0.0771557 11.1725 0.23153 11.0456L3.85794 9.55483C6.44145 8.49277 8.49279 6.44143 9.55484 3.85793L11.0456 0.231515Z" fill="white"/></svg>

      <!-- prettier-ignore -->
      <svg class="stars absolute bottom-1/3 left-1/10" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0456 0.231499C11.1725 -0.0771869 11.6097 -0.0771863 11.7366 0.2315L13.2274 3.85791C14.2894 6.44142 16.3408 8.49276 18.9243 9.55481L22.5507 11.0456C22.8594 11.1725 22.8594 11.6097 22.5507 11.7366L18.9243 13.2274C16.3408 14.2894 14.2894 16.3407 13.2274 18.9243L11.7366 22.5507C11.6097 22.8594 11.1725 22.8594 11.0456 22.5507L9.55484 18.9243C8.49279 16.3407 6.44145 14.2894 3.85794 13.2274L0.23153 11.7366C-0.0771564 11.6097 -0.0771558 11.1725 0.23153 11.0456L3.85794 9.55481C6.44145 8.49276 8.49279 6.44142 9.55484 3.85791L11.0456 0.231499Z" fill="#4B9ECF"/></svg>
    </div>

    <div v-if="isFetching" class="animate-pulse">
      <!-- Progress Info Skeleton -->
      <div class="mt-6 h-16 text-center">
        <div class="mx-auto h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="mx-auto mt-3 h-5 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Progress Bar Skeleton -->
      <div class="relative mx-6 mt-6">
        <div class="h-[14px] w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>

        <div class="mt-5 flex justify-between">
          <div class="h-4 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Rewards Cards Skeleton -->
      <div
        class="mx-6 mt-6 rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
      >
        <!-- First Reward -->
        <div class="flex h-22 items-center justify-between p-5" v-for="i in 2">
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
    <div v-else>
      <div class="mt-6 text-center">
        <p
          class="mt-4 block text-center font-heading text-[34px] leading-8 font-bold text-text-primary"
        >
          P{{
            animatedCurrentProgress.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </p>
        <!-- <p class="mt-3 text-sm">
          Your spend as of
          <NuxtTime
            v-if="!transactions.length"
            :datetime="Date.now()"
            month="short"
            day="numeric"
            year="numeric"
          />
          <NuxtTime
            v-else
            :datetime="dateOfLastTransaction"
            month="short"
            day="numeric"
            year="numeric"
          />
        </p> -->
        <p class="mt-3 text-sm" v-if="accumulatedProgramInfo?.description">
          {{ accumulatedProgramInfo.description }}
        </p>
      </div>
      <div class="relative mx-6 mt-6">
        <Progress
          v-model="animatedPercentage"
          class="progress h-2.5 rounded-full [&>div]:bg-[#4B9ECF]"
        />

        <div
          class="absolute top-0 h-2.5 w-full transition-transform after:absolute after:top-1/2 after:-right-2 after:z-20 after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:border after:border-border-neutral after:bg-white after:content-['']"
          :style="`transform: translateX(-${100 - animatedPercentage}%)`"
        ></div>

        <div class="mt-5 flex justify-between text-sm text-text-secondary">
          <span>P0</span>
          <span class="uppercase"
            >P{{ formatToShortNumber(accumulatedProgress.target).toLocaleString() }}</span
          >
        </div>
      </div>
      <div class="mx-6 mt-6">
        <div
          class="complete-container z-20 overflow-hidden rounded-2xl border border-border-neutral bg-surface-primary"
          :class="{
            'bg-surface-lower-1': !isAccumulatedProgramComplete,
          }"
          v-if="accumulatedReward || frequencyReward"
        >
          <div
            class="flex items-center justify-between p-5"
            v-if="accumulatedReward"
            :class="{ 'complete-reward': isAccumulatedProgramComplete }"
          >
            <div>
              <p class="font-bold">{{ accumulatedReward.rewardName }}</p>
              <p class="mt-2 text-xs text-text-secondary">
                {{ accumulatedReward.targetDescription }} •
                <span :class="{ 'complete-text text-text-success': isAccumulatedProgramComplete }">
                  {{ isAccumulatedProgramComplete ? 'Complete' : 'Locked' }}
                </span>
              </p>
            </div>

            <div
              class="shadow-inset-custom flex h-6 w-6 items-center justify-center rounded-md border border-border-neutral bg-surface-lower-1"
            >
              <Icon
                name="lucide:check"
                class="complete-check text-text-success"
                v-if="isAccumulatedProgramComplete"
              />
            </div>
          </div>
          <div
            class="flex items-center justify-between border-t border-border-neutral p-5"
            v-if="frequencyReward"
            :class="{ 'complete-reward': isFrequencyProgramComplete }"
          >
            <div>
              <p class="font-bold">{{ frequencyReward?.rewardName }}</p>
              <p class="mt-2 text-xs text-text-secondary">
                {{ frequencyReward?.targetDescription }} •
                <span :class="{ 'complete-text text-text-success': isFrequencyProgramComplete }">
                  {{ isFrequencyProgramComplete ? 'Complete' : 'Locked' }}
                </span>
              </p>
            </div>

            <div
              class="shadow-inset-custom flex h-6 w-6 items-center justify-center rounded-md border border-border-neutral bg-surface-lower-1"
            >
              <Icon
                name="lucide:check"
                class="complete-check text-text-success"
                v-if="isFrequencyProgramComplete"
              />
            </div>
          </div>
        </div>
      </div>

      <p
        v-if="isAccumulatedProgramComplete || isFrequencyProgramComplete"
        class="mt-6 px-6 text-center text-sm text-text-secondary"
      >
        Your eGC Reward will be sent to your mobile number within 30 days after the promo ends.
      </p>
    </div>
  </div>
</template>
<style scoped>
.shadow-inset-custom {
  box-shadow: inset 0 2.4px 4.8px 0 rgba(0, 0, 0, 0.04);
}

.glare-effect {
  --glare-gradient: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 70%
  );
  background: var(--glare-gradient);
  transform: translateX(-100%);
}
</style>
