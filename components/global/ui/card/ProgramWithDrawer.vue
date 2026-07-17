<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { cva } from 'class-variance-authority';
import { toast } from 'vue-sonner';

const { program } = defineProps<{
  program: ProgramConfig;
}>();

const statusLabel = {
  'in-progress': 'See Progress',
  completed: 'Completed',
  available: 'Join Now',
  expired: 'Expired',
} as const;

const campaign = useCampaignState();
const queryClient = useQueryClient();

const {
  programInfo,
  isPending: isProgramInfoPending,
  isError: isProgramInfoError,
  alerts: programInfoAlerts,
} = useProgramInfoQuery({ programId: program.programId });

const {
  registerModel,
  isPending: isRegisterPending,
  isError: isRegisterError,
  handleRegister,
  alerts: registerAlerts,
} = useRegisterMutation(handleRegisterSuccess);

const { currentLabel, remainingLabel, targetLabel, formattedCurrent } = useProgressDisplay(
  programInfo,
  program.unit
);

const { percentage, progress, hasProgress } = useProgramProgress({ programInfo });

const { wrapperVariants, badgeVariants, statusVariants, actionButtonVariants } = useClassVariants();

const { colorVariables } = useProgramColors(program.colors);

const { handleLoginPass } = useLoginPassMutation();

function handleRegisterSuccess() {
  toast.success('Success!', {
    description: 'You have successfully joined the promo.',
  });

  queryClient.setQueryData(['programs', campaign.value.id], (programResponse: ProgramResponse) => {
    const newPrograms = programResponse.data?.programs.map((oldProgram) => {
      if (oldProgram.programId === program.programId) {
        return {
          ...oldProgram,
          isRegistered: true,
        };
      }
      return oldProgram;
    });

    return {
      ...programResponse,
      data: {
        programs: newPrograms,
      },
    };
  });
}

function handleCallToAction() {
  if (program.status === 'available') {
    handleRegister();
  }
}

function useClassVariants() {
  const wrapperVariants = cva('', {
    variants: {
      status: {
        'in-progress':
          'border-primary bg-primary-soft dark:border-primary-dark dark:bg-primary-dark-soft',
        completed: 'border-primary bg-primary-soft',
        available: 'border-border-secondary bg-surface-lower-2 dark:bg-[#2a2a2a]',
        expired: '',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const badgeVariants = cva('', {
    variants: {
      status: {
        'in-progress': 'bg-primary',
        completed: '',
        available: 'border-border-neutral bg-surface-disable',
        expired: '',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const statusVariants = cva('', {
    variants: {
      status: {
        'in-progress': 'bg-primary text-white',
        completed: 'bg-green-500 text-white',
        available: 'bg-surface-primary text-text-primary',
        expired: '',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  const actionButtonVariants = cva('', {
    variants: {
      status: {
        'in-progress': 'bg-primary text-white',
        completed: '',
        available:
          'hover:bg-secondary-hard border-secondary bg-secondary dark:bg-secondary-dark dark:hover:bg-secondary-dark-soft',
        expired: '',
      },
    },
    defaultVariants: {
      status: 'in-progress',
    },
  });

  return {
    wrapperVariants,
    badgeVariants,
    statusVariants,
    actionButtonVariants,
  };
}

watch(programInfo, async (programInfo) => {
  if (programInfo) {
    handleLoginPass(programInfo.campaignId, '', campaign.value.id);
  }
});

onMounted(() => {
  registerModel.value = {
    programId: program.programId,
  };
});
</script>

<template>
  <div
    :class="
      cn(
        'flex h-full flex-col justify-between gap-5 rounded-2xl border p-4 transition-colors duration-300 ease-in-out dark:text-black',
        wrapperVariants({ status: program.status })
      )
    "
    :style="colorVariables"
  >
    <template v-if="isProgramInfoError">
      <alert-card v-if="programInfoAlerts" :alerts="programInfoAlerts"> </alert-card>
    </template>

    <template v-else-if="isProgramInfoPending">
      <div class="flex justify-between gap-4">
        <div
          class="relative flex h-16 w-16 shrink-0 animate-pulse items-center justify-center rounded-full border bg-gray-200 dark:bg-gray-700"
        ></div>

        <div class="flex flex-1 flex-col gap-1">
          <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="space-y-2">
            <div class="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="h-2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

        <div class="h-9 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-between gap-4">
        <div
          :class="
            cn(
              'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border p-4 leading-none',
              badgeVariants({ status: program.status })
            )
          "
        >
          <div
            class="absolute inset-0 h-full w-full rounded-full before:absolute before:inset-0 before:h-full before:w-full before:rounded-full before:border-x-2 before:border-t-2 before:border-white before:opacity-24 after:absolute after:inset-0 after:h-full after:w-full after:rounded-full after:bg-linear-to-b after:from-white after:to-white/0 after:opacity-24"
          ></div>

          <img :src="program.iconUrl" :alt="program.title" />
        </div>
        <div class="flex flex-col gap-1 font-heading">
          <h2 class="font-bold text-text-primary">{{ program.title }}</h2>
          <p class="line-clamp-2 text-xs leading-6 text-text-secondary">
            {{ program.description }}
          </p>
        </div>
      </div>

      <div v-if="['in-progress', 'completed'].includes(program.status)">
        <template v-if="program.programTypeId == PROGRAM_TYPE.accumulated">
          <Progress
            v-model="percentage"
            class="border border-border-neutral bg-surface-lower-2 dark:border-neutral-600 dark:bg-neutral-700 [&>div]:bg-primary"
          />
        </template>
        <template v-else-if="program.programTypeId == PROGRAM_TYPE.frequency">
          <ProgressDashSteps :current="progress.current" :target="progress.target" hasAnimation />
        </template>
      </div>

      <div class="flex items-center justify-between text-sm">
        <div class="font-heading text-xs text-text-secondary">
          <template v-if="program.status === 'in-progress'">
            <span v-if="hasProgress">{{ currentLabel }}</span>
            <span v-else>{{ targetLabel }}</span>
          </template>
        </div>

        <Drawer>
          <DrawerTrigger
            :class="
              cn(
                'cursor-pointer rounded-full px-3 py-2.5 font-heading text-xs font-bold hover:shadow-md xs:px-6 xs:text-sm',
                statusVariants({ status: program.status })
              )
            "
          >
            {{ statusLabel[program.status] }}
          </DrawerTrigger>
          <DrawerContent
            class="mx-auto max-h-[90%]! rounded-t-2xl! px-6 pt-2 pb-10 text-center xs:max-w-103.5"
          >
            <DrawerHeader>
              <DrawerTitle
                class="text-center font-heading text-xl font-bold"
                v-if="program.drawerTitle"
              >
                {{ program.drawerTitle }}
              </DrawerTitle>
              <DrawerClose class="absolute top-0 right-0 size-14 hover:cursor-pointer">
                <Icon name="lucide:x" class="text-2xl" />
              </DrawerClose>
              <DrawerDescription class="sr-only"></DrawerDescription>
            </DrawerHeader>

            <div :style="colorVariables" class="flex flex-col items-center justify-center gap-6">
              <div
                :class="
                  cn(
                    'relative flex size-24 shrink-0 items-center justify-center rounded-full border p-4 leading-none',
                    badgeVariants({ status: program.status })
                  )
                "
              >
                <div
                  class="absolute inset-0 h-full w-full rounded-full before:absolute before:inset-0 before:h-full before:w-full before:rounded-full before:border-x-2 before:border-t-2 before:border-white before:opacity-24 after:absolute after:inset-0 after:h-full after:w-full after:rounded-full after:bg-linear-to-b after:from-white after:to-white/0 after:opacity-24"
                ></div>
                <img :src="program.iconUrl" />
              </div>
              <div class="flex flex-col gap-2">
                <h2 class="font-heading text-3xl font-bold text-text-primary">
                  {{ program.title }}
                </h2>
                <p class="font-heading text-sm leading-6 text-text-secondary">
                  {{ program.description }}
                </p>
              </div>

              <div class="w-full" v-if="['in-progress', 'completed'].includes(program.status)">
                <template v-if="program.programTypeId == PROGRAM_TYPE.accumulated">
                  <Progress
                    v-model="percentage"
                    class="border border-border-neutral bg-surface-lower-2 dark:border-border-neutral dark:bg-[#2a2a2a] [&>div]:bg-primary"
                  />
                </template>
                <template v-else-if="program.programTypeId == PROGRAM_TYPE.frequency">
                  <ProgressDashSteps :current="progress.current" :target="progress.target" />
                </template>
              </div>

              <div
                class="flex w-full justify-between gap-2 font-heading text-sm"
                v-if="program.status === 'in-progress' || program.status === 'completed'"
              >
                <!-- in-progress -->
                <div
                  v-if="program.status === 'in-progress'"
                  class="flex w-full items-center gap-1 font-heading"
                  :class="hasProgress ? 'justify-between' : 'justify-center'"
                >
                  <template v-if="hasProgress">
                    <span class="text-text-secondary">Current: {{ currentLabel }} </span>
                    <span class="text-green-500">
                      {{ remainingLabel }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-text-secondary"> {{ targetLabel }} </span>
                  </template>
                </div>

                <!-- todo: completed -->
                <p
                  v-else-if="program.status === 'completed'"
                  class="w-full text-center text-text-primary"
                >
                  Complete ✓
                </p>
              </div>

              <div
                class="-mx-(--card-padding) [--card-padding:--spacing(6)]"
                v-if="program.details?.length"
              >
                <Carousel
                  class="relative w-full"
                  :opts="{
                    align: 'start',
                  }"
                >
                  <CarouselContent>
                    <CarouselItem
                      v-for="(detail, index) in program.details"
                      :key="index"
                      class="basis-[90%] last:pr-(--card-padding)"
                    >
                      <div
                        class="flex h-full flex-col justify-center gap-1 rounded-2xl border border-border-primary bg-surface-lower-2 p-4 text-left font-heading text-xs leading-6 text-text-primary transition-colors duration-300 ease-in-out"
                        :class="{ 'ml-(--card-padding)': index === 0 }"
                      >
                        <p class="font-bold">
                          {{ detail.title }}
                        </p>
                        <p>
                          {{ detail.description }}
                        </p>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious class="hidden" />
                  <CarouselNext class="hidden" />
                </Carousel>
              </div>

              <div class="w-full">
                <alert-card
                  v-if="isRegisterError && registerAlerts"
                  :alerts="registerAlerts"
                  class="mb-4"
                >
                </alert-card>

                <a
                  v-if="program.status === 'in-progress'"
                  target="_blank"
                  :href="`/campaign/${program.campaignId}?programId=${program.programId}`"
                  :class="
                    cn(
                      'flex h-12 w-full cursor-pointer items-center justify-center rounded-full border px-6 py-2.5 font-heading font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
                      actionButtonVariants({ status: program.status })
                    )
                  "
                >
                  {{ statusLabel[program.status] }}
                </a>

                <button
                  v-else
                  type="button"
                  @click="handleCallToAction"
                  :disabled="isRegisterPending"
                  :class="
                    cn(
                      'flex h-12 w-full cursor-pointer items-center justify-center rounded-full border bg-primary px-6 py-2.5 font-heading font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
                      actionButtonVariants({ status: program.status })
                    )
                  "
                >
                  <Icon v-if="isRegisterPending" name="lucide:loader-circle" class="animate-spin" />
                  <span v-else>
                    {{ statusLabel[program.status] }}
                  </span>
                </button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </template>
  </div>
</template>
