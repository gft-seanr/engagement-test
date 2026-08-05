<script lang="ts" setup>
interface CarouselItem {
  id: string;
  title: string;
  description: string;
  details: string;
  footer: string;
}

interface DialogProps {
  title: string;
  description: string;
  tabs: {
    id: string;
    title: string;
  }[];
}

interface Classes {
  outer?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  dialog: DialogProps;
  classes?: Classes;
}

const { items, classes, dialog } = defineProps<CarouselProps>();

const isOpenDialog = ref(false);
const tab = ref(dialog.tabs[0]);

const toggleDialog = (item: CarouselItem) => {
  tab.value = dialog.tabs.find((tab) => tab.id === item.id) || dialog.tabs[0];
  isOpenDialog.value = !isOpenDialog.value;
};
</script>

<template>
  <div :class="cn('-mx-(--card-padding) [--card-padding:--spacing(6)]', classes?.outer)">
    <Carousel
      class="relative w-full"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent>
        <CarouselItem
          v-for="(item, index) in items"
          :key="index"
          class="basis-[85%] last:pr-(--card-padding)"
        >
          <div
            class="flex h-full flex-col justify-center gap-3 rounded-2xl border border-border-neutral p-4 transition-colors duration-300 ease-in-out"
            :class="{ 'ml-(--card-padding)': index === 0 }"
          >
            <div class="flex justify-between">
              <span class="text-sm font-bold text-accent-500 uppercase">
                {{ item.title }}
              </span>
            </div>
            <p class="h-full text-lg leading-7 font-bold">
              {{ item.description }}
            </p>
            <button v-if="item.footer" class="cursor-pointer text-left" @click="toggleDialog(item)">
              <span class="text-xs text-text-muted"> {{ item.footer }} </span>
            </button>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="hidden" />
      <CarouselNext class="hidden" />
    </Carousel>

    <Dialog v-model:open="isOpenDialog">
      <DialogContent class="rounded-2xl text-primary sm:max-w-[425px]">
        <DialogHeader class="pb-2">
          <DialogTitle class="font-heading text-3xl font-bold">{{ dialog.title }}</DialogTitle>
          <DialogDescription class="mt-1 text-sm leading-7 text-primary">
            {{ dialog.description }}
          </DialogDescription>
        </DialogHeader>

        <Tabs :default-value="tab.id" class="-mx-6">
          <TabsList class="grid h-auto w-full grid-cols-2 rounded-none bg-surface-primary">
            <TabsTrigger
              class="cursor-pointer rounded-none border-x-0 border-t-0 border-b-2 border-transparent py-4 data-[state=active]:border-accent-500 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=inactive]:text-text-muted dark:data-[state=active]:bg-surface-lower-1"
              :value="tab.id"
              v-for="tab in dialog.tabs"
            >
              {{ tab.title }}
            </TabsTrigger>
          </TabsList>

          <TabsContent v-for="item in items" :value="item.id" class="px-6">
            <div class="h-[calc(50vh-3rem)] overflow-y-auto pt-4">
              <Markdown :content="item.details" class="prose-sm" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  </div>
</template>
