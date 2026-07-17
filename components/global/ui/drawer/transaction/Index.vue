<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

interface DrawerTransactionProps {
  title: string;
  description: string;
  label: string;
  prefixIcon?: string;
  suffixIcon?: string;
}

interface Classes extends NestedClasses<DrawerTransactionProps> {
  outer?: HTMLAttributes['class'];
  wrapper?: HTMLAttributes['class'];
}

interface Props extends DrawerTransactionProps {
  classes: Classes;
}
const { label, prefixIcon, suffixIcon } = defineProps<Props>();
</script>
<template>
  <Drawer>
    <DrawerTrigger
      :class="
        cn(
          'flex cursor-pointer items-center justify-center rounded-full px-6 py-2.5 font-heading text-sm',
          classes?.outer
        )
      "
    >
      <template v-if="prefixIcon">
        <Icon :name="prefixIcon" :class="cn('inline', classes?.prefixIcon)" />
      </template>

      <span :class="cn(classes?.label)">{{ label }}</span>

      <template v-if="suffixIcon">
        <Icon :name="suffixIcon" :class="cn('inline', classes?.suffixIcon)" />
      </template>
    </DrawerTrigger>
    <DrawerContent
      :class="
        cn('mx-auto !rounded-t-2xl pt-2 pb-10 text-center xs:max-w-[414px]', classes?.wrapper)
      "
    >
      <DrawerHeader>
        <DrawerTitle :class="cn('text-center font-heading text-xl font-bold', classes?.title)">
          {{ title }}
        </DrawerTitle>
        <DrawerClose class="absolute top-0 right-0 h-14 w-14">
          <Icon name="lucide:x" class="text-2xl" />
        </DrawerClose>
        <DrawerDescription class="sr-only"></DrawerDescription>
      </DrawerHeader>

      <div class="mx-auto min-h-[40vh] w-full overflow-y-auto px-6">
        <TableTransaction />
      </div>
    </DrawerContent>
  </Drawer>
</template>
