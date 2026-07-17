<script setup lang="ts">
import 'vue-sonner/style.css';

interface PromoWalletTab {
  id: string;
  name: string;
  title?: string;
  description?: string;
}

type PromoWalletTabs = Record<string, PromoWalletTab>;

interface PromoWalletProps {
  title?: string;
  description?: string;
  tabs?: PromoWalletTabs;
  defaultTab?: string;
  programs: ProgramConfig[];
}

interface Classes extends NestedClasses<PromoWalletProps> {
  outer?: string;
  wrapper?: string;
}

interface Props extends PromoWalletProps {
  classes?: Classes;
}

const {
  title = 'Missions',
  description = 'Complete missions to earn rewards',
  tabs = {
    all: {
      id: 'all',
      name: 'All',
      title: '',
    },
    inProgress: {
      id: 'in-progress',
      title: 'In Progress',
      name: 'In Progress',
    },
    available: {
      id: 'available',
      title: 'Available',
      name: 'Available Missions',
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      name: 'Completed Missions',
    },
  } as PromoWalletTabs,
  programs,
  defaultTab = 'all',
} = defineProps<Props>();

const computedDefaultTab = defaultTab || tabs[0]?.id;

// Reusable templates
const [InProgressDefineTemplate, InProgressReuseTemplate] = createReusableTemplate();
const [AvailableDefineTemplate, AvailableReuseTemplate] = createReusableTemplate();
const [CompletedDefineTemplate, CompletedReuseTemplate] = createReusableTemplate();

const { isPending, isError, alerts, programs: programList } = useProgramsQuery();

const mappedPrograms = computed(() => {
  return programList.value.map((program) => {
    const settings = programs.find((setting) => setting.campaignId === program.campaignId);

    if (settings) {
      return {
        ...program,
        ...settings,
        status: program.isRegistered
          ? ('in-progress' as ProgramStatus)
          : ('available' as ProgramStatus),
      };
    }
  });
});

const programsByStatus = computed(() => {
  const groups = {
    all: [] as ProgramConfig[],
    'in-progress': [] as ProgramConfig[],
    available: [] as ProgramConfig[],
    completed: [] as ProgramConfig[],
    expired: [] as ProgramConfig[],
  };

  for (const program of mappedPrograms.value) {
    if (!program) continue;

    groups.all.push(program);

    if (program.status && program.status in groups) {
      groups[program.status].push(program);
    }
  }

  return groups;
});

// Draggable scroll logic
const tabRef = useTemplateRef('tabRef');
const { isDragging } = useDraggableScroll(tabRef);

function useDraggableScroll(target: Ref<ComponentPublicInstance | HTMLElement | null>) {
  const startX = ref(0);
  const scrollLeft = ref(0);

  const el = computed(() => {
    const element = unref(target);
    return (element as ComponentPublicInstance)?.$el || element;
  });

  const { pressed: isDragging } = useMousePressed({ target: el });

  useEventListener(el, 'mousedown', (e: MouseEvent) => {
    if (!el) return;
    startX.value = e.pageX - el.value.offsetLeft;
    scrollLeft.value = el.value.scrollLeft;
    e.preventDefault();
  });

  useEventListener(el, 'mousemove', (e: MouseEvent) => {
    if (!isDragging.value || !el) return;
    e.preventDefault();

    const x = e.pageX - el.value.offsetLeft;
    const walk = (x - startX.value) * 2;
    el.value.scrollLeft = scrollLeft.value - walk;
  });

  return {
    isDragging,
  };
}

function selectTab(tabId: string) {
  const tabElement = tabRef.value?.$el.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
  if (tabElement && tabRef.value?.$el) {
    const container = tabRef.value.$el;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tabElement.getBoundingClientRect();

    if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
      const offset = tabRect.left - containerRect.left - (containerRect.width - tabRect.width) / 2;
      container.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    }
  }
}
</script>
<template>
  <div :class="classes?.outer">
    <Toaster position="bottom-center" richColors />

    <InProgressDefineTemplate>
      <div>
        <h2 class="font-heading text-xl font-semibold">
          {{ tabs.inProgress.title }}
        </h2>

        <p v-if="tabs.inProgress.description">
          {{ tabs.inProgress.description }}
        </p>

        <div v-if="!programsByStatus['in-progress'].length">
          <p class="my-10 text-center text-sm text-text-secondary italic">
            There's no in-progress mission yet.
          </p>
        </div>

        <div
          v-else
          :class="cn('-mx-(--card-padding) mt-6 [--card-padding:--spacing(6)]', classes?.outer)"
        >
          <Carousel>
            <CarouselContent>
              <CarouselItem
                v-for="(program, index) in programsByStatus['in-progress']"
                :key="program.campaignId"
                :class="[
                  {
                    'basis-[90%] last:pr-(--card-padding)':
                      programsByStatus['in-progress'].length > 1,
                  },
                ]"
              >
                <Component
                  :class="{
                    'ml-(--card-padding)': index === 0,
                    'mr-(--card-padding)': programsByStatus['in-progress'].length === 1,
                  }"
                  :is="program.component"
                  :program="program"
                  :key="program.campaignId"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="hidden" />
            <CarouselNext class="hidden" />
          </Carousel>
        </div>
      </div>
    </InProgressDefineTemplate>

    <AvailableDefineTemplate>
      <div>
        <h2 class="font-heading text-xl font-semibold">
          {{ tabs.available.title }}
        </h2>
        <p v-if="tabs.available.description">{{ tabs.available.description }}</p>

        <p
          v-if="!programsByStatus['available'].length"
          class="my-10 text-center text-sm text-text-secondary italic"
        >
          There's no available mission yet.
        </p>

        <div class="mt-6 flex flex-col gap-4">
          <Component
            v-for="program in programsByStatus['available']"
            :key="program.campaignId"
            :is="program.component"
            :program="program"
          />
        </div>
      </div>
    </AvailableDefineTemplate>

    <div :class="cn('flex flex-col gap-10 pt-6 pb-16', classes?.wrapper)">
      <div class="font-heading">
        <h1 :class="cn('text-4xl font-bold', classes?.title)">{{ title }}</h1>

        <p v-if="description" :class="cn('mt-2 text-sm text-text-secondary', classes?.description)">
          {{ description }}
        </p>
      </div>

      <alert-hero-centered v-if="isError && alerts" :alert="alerts[0]"> </alert-hero-centered>
      <template v-else-if="isPending">
        <div class="py-10 text-center text-primary">
          <Icon name="lucide:loader-circle" class="animate-spin text-2xl" />
        </div>
      </template>
      <template v-else>
        <Tabs :defaultValue="computedDefaultTab" class="gap-8">
          <div class="-mr-(--card-padding) [--card-padding:--spacing(6)]">
            <TabsList class="w-full last:pr-(--card-padding)" ref="tabRef">
              <TabsTrigger
                v-for="tab in tabs"
                class="inline-flex flex-col items-center justify-center gap-0 after:invisible after:block after:h-0 after:overflow-hidden after:font-bold after:content-[attr(title)]"
                :title="tab.name"
                :class="{
                  'cursor-grabbing select-none': isDragging,
                  'cursor-pointer': !isDragging,
                }"
                :value="tab.id"
                :key="tab.id"
                :data-value="tab.id"
                @click="selectTab(tab.id)"
              >
                {{ tab.name }}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" class="flex flex-col gap-8">
            <template v-if="!programList.length">
              <p class="my-10 text-center text-sm text-text-secondary italic">
                There's no available mission at this time. <br />
                Please check back later.
              </p>
            </template>
            <InProgressReuseTemplate v-if="programsByStatus['in-progress'].length" />
            <AvailableReuseTemplate v-if="programsByStatus['available'].length" />
          </TabsContent>

          <TabsContent value="in-progress">
            <InProgressReuseTemplate />
          </TabsContent>

          <TabsContent value="available">
            <AvailableReuseTemplate />
          </TabsContent>

          <TabsContent value="completed">
            <h2 class="font-heading text-xl font-semibold">
              {{ tabs.completed.title }}
            </h2>
            <p class="my-10 text-center text-sm text-text-secondary italic">
              There's no completed missions yet.
            </p>
          </TabsContent>
        </Tabs>
      </template>
    </div>
  </div>
</template>
