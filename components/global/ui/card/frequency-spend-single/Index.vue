<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
const { program } = defineProps<{
  program: ProgramUI;
}>();

const variantClasses = {
  'in-progress': {
    wrapper:
      'border-(--accent-primary) bg-(--accent-primary-light) border-border-neutral dark:bg-(--dark-accent-primary-light) dark:border-(--dark-accent-primary)',
    badge: 'bg-(--accent-primary)',
    status: 'bg-(--accent-primary) text-white',
    progress: '[&>*]:bg-(--accent-primary)',
    actionButton: 'bg-(--accent-primary) text-white',
  },
  completed: {
    wrapper: 'border-(--accent-primary) bg-(--accent-primary-light)',
    badge: '',
    status: 'bg-green-500 text-white',
    progress: '[&>*]:bg-(--accent-primary)',
    actionButton: '',
  },
  available: {
    wrapper: 'border-border-secondary bg-surface-lower-2 dark:bg-[#2a2a2a]',
    badge: 'border-border-neutral bg-surface-disable',
    status: 'bg-surface-primary text-text-primary',
    progress: '',
    actionButton:
      'bg-(--secondary-primary) border-secondary-primary hover:bg-secondary-primary-light dark:bg-dark-secondary-primary dark:hover:dark-secondary-primary-light',
  },
  expired: {
    wrapper: 'border-border-secondary bg-surface-lower-2',
    badge: 'border-border-neutral bg-surface-disable',
    status: 'bg-gray-500 text-white',
    progress: '',
    actionButton: '',
  },
} as const;

const statusLabels = {
  'in-progress': 'See Progress',
  completed: 'Completed',
  available: 'Join Now',
  expired: 'Expired',
} as const;

const currentVariantClasses = computed(() => variantClasses[program.status]);

const cssVariables = computed(() => ({
  '--accent-primary': program.colors?.['accent-primary'],
  '--accent-primary-light': program.colors?.['accent-primary-light'],
  '--dark-accent-primary': program.colors?.['dark-accent-primary'],
  '--dark-accent-primary-light': program.colors?.['dark-accent-primary-light'],
  '--secondary-primary': program.colors?.['secondary-primary'],
  '--secondary-primary-light': program.colors?.['secondary-primary-light'],
  '--dark-secondary-primary': program.colors?.['dark-secondary-primary'],
  '--dark-secondary-primary-light': program.colors?.['dark-secondary-primary-light'],
}));

const {
  registerModel,
  isPending: isRegisterPending,
  isError: isRegisterError,
  handleRegister,
  alerts: registerAlerts,
} = useRegisterMutation(handleRegisterSuccess);

const campaign = useCampaignState();

const queryClient = useQueryClient();

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

const { current, remaining, target } = useProgressValues(program);

function useProgressValues(program: ProgramUI) {
  const { prefix, suffix } = program.unit.currency;

  const current = computed(() => {
    let { current, target } = programInfo.value?.progress || { current: 0, target: 0 };

    if (current > target) {
      current = target;
    }

    const label = usePluralize(
      programInfo.value?.progress?.target,
      program.unit.label.current
    ).value;

    return `${prefix}${current}${suffix} of ${target} ${label}`;
  });

  const remaining = computed(() => {
    const remaining =
      (programInfo.value?.progress?.target || 0) - (programInfo.value?.progress?.current || 0);

    const label = usePluralize(remaining, program.unit.label.remaining).value;

    if (remaining <= 0 && programInfo.value?.progress?.target) {
      return 'Complete ✓';
    }

    return `${prefix}${remaining}${suffix} ${label}`;
  });

  const target = computed(() => {
    const target = programInfo.value?.progress.target.toLocaleString() || 0;
    const label = usePluralize(programInfo.value?.progress.target, program.unit.label.target).value;

    return `${prefix}${target}${suffix} ${label}`;
  });

  return { current, remaining, target };
}

const { handleLoginPass } = useLoginPassMutation();

const {
  programInfo,
  isPending: isProgramInfoPending,
  isError: isProgramInfoError,
  alerts: programInfoAlerts,
} = useProgramInfoQuery(program);

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
    :style="cssVariables"
    :class="currentVariantClasses.wrapper"
    class="flex h-full flex-col justify-center gap-5 rounded-2xl border p-4 transition-colors duration-300 ease-in-out dark:text-black"
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
          class="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border p-4 leading-none"
          :class="currentVariantClasses.badge"
        >
          <div
            class="absolute inset-0 h-full w-full rounded-full before:absolute before:inset-0 before:h-full before:w-full before:rounded-full before:border-x-2 before:border-t-2 before:border-white before:opacity-24 after:absolute after:inset-0 after:h-full after:w-full after:rounded-full after:bg-gradient-to-b after:from-white after:to-white/0 after:opacity-24"
          ></div>
          <img :src="program.iconUrl" alt="" />
        </div>
        <div class="flex flex-col gap-1 font-heading">
          <h2 class="font-bold text-text-primary">{{ program.title }}</h2>
          <p class="line-clamp-2 text-xs leading-6 text-text-secondary">
            {{ program.description }}
          </p>
        </div>
      </div>

      <div v-if="programInfo?.progress && program.status !== 'available'">
        <ProgressFrequencySingle
          :hasAnimation="true"
          :target="programInfo?.progress.target"
          :current="programInfo?.progress.current"
        />
      </div>

      <div class="flex items-center justify-between text-sm">
        <div class="font-heading text-xs text-text-secondary">
          <template v-if="program.status === 'in-progress'">
            <span> {{ current }} </span>
          </template>

          <template v-else-if="program.status === 'available'">
            <span>
              {{ target }}
            </span>
          </template>
        </div>

        <Drawer>
          <DrawerTrigger
            class="cursor-pointer rounded-full px-6 py-2.5 font-heading text-sm font-bold hover:shadow-md"
            :class="currentVariantClasses.status"
          >
            {{ statusLabels[program.status] }}
          </DrawerTrigger>
          <DrawerContent
            class="mx-auto !max-h-[90%] !rounded-t-2xl px-6 pt-2 pb-10 text-center xs:max-w-[414px]"
          >
            <DrawerHeader>
              <DrawerTitle
                class="text-center font-heading text-xl font-bold"
                v-if="program.drawerTitle"
              >
                {{ program.drawerTitle }}
              </DrawerTitle>
              <DrawerClose class="absolute top-0 right-0 h-14 w-14">
                <Icon name="lucide:x" class="text-2xl" />
              </DrawerClose>
              <DrawerDescription class="sr-only"></DrawerDescription>
            </DrawerHeader>
            <div :style="cssVariables" class="flex flex-col items-center justify-center gap-6">
              <div
                class="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border p-4 leading-none"
                :class="currentVariantClasses.badge"
              >
                <div
                  class="absolute inset-0 h-full w-full rounded-full before:absolute before:inset-0 before:h-full before:w-full before:rounded-full before:border-x-2 before:border-t-2 before:border-white before:opacity-24 after:absolute after:inset-0 after:h-full after:w-full after:rounded-full after:bg-gradient-to-b after:from-white after:to-white/0 after:opacity-24"
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
              <div class="w-full" v-if="programInfo?.progress">
                <ProgressFrequencySingle
                  :target="programInfo?.progress.target || 0"
                  :current="programInfo?.progress.current || 0"
                />
              </div>

              <div class="flex w-full justify-between gap-2 font-heading text-sm">
                <div
                  class="flex w-full items-center justify-between gap-1"
                  v-if="program.status === 'in-progress'"
                >
                  <span class="text-text-secondary"> {{ current }} </span>
                  <span class="text-green-500"> {{ remaining }} </span>
                </div>
                <p
                  class="w-full text-center text-text-primary"
                  v-else-if="program.status === 'available'"
                >
                  {{ target }}
                </p>
              </div>
              <div class="-mx-(--card-padding) [--card-padding:--spacing(6)]">
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
                  :href="`/campaign/${program.campaignId}?programId=${program.programId}`"
                  target="_blank"
                  :class="currentVariantClasses.actionButton"
                  class="flex h-12 w-full cursor-pointer items-center justify-center rounded-full border px-6 py-2.5 font-heading font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ statusLabels[program.status] }}
                </a>
                <button
                  v-else
                  type="button"
                  @click="handleCallToAction"
                  :class="currentVariantClasses.actionButton"
                  :disabled="isRegisterPending"
                  class="flex h-12 w-full cursor-pointer items-center justify-center rounded-full border px-6 py-2.5 font-heading font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="lucide:loader-circle" class="animate-spin" v-if="isRegisterPending" />
                  <span v-else>
                    {{ statusLabels[program.status] }}
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
