<script setup lang="ts">
defineProps<SheetMarkdownPropsWithClasses>();
</script>

<template>
  <Sheet>
    <SheetTrigger
      :class="
        cn(
          'mx-auto flex w-fit items-center gap-x-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-sm text-primary',
          classes?.outer
        )
      "
    >
      <Icon v-if="triggerIcon" :name="triggerIcon" :class="cn('size-4', classes?.triggerIcon)" />
      <span v-if="triggerText" :class="classes?.triggerText">
        {{ triggerText }}
      </span>
    </SheetTrigger>

    <SheetContent
      side="bottom"
      aria-describedby=""
      :class="cn('mx-auto max-w-[414px] rounded-t-2xl p-6 pb-12', classes?.wrapper)"
    >
      <SheetHeader class="p-0">
        <div class="flex items-center justify-between">
          <SheetTitle :class="cn('font-poppins text-4xl font-bold', classes?.sheetTitle)">
            {{ sheetTitle }}
          </SheetTitle>
          <SheetClose
            class="size-6 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary dark:text-foreground"
          >
            <Icon name="lucide:x" size="24" />
            <span class="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetHeader>

      <Markdown
        :content="sheetContent"
        :class="
          cn(
            'prose text-text-primary dark:prose-invert prose-h2:text-base prose-h2:font-bold prose-h2:text-primary prose-p:leading-7 prose-thead:border-b-0 prose-tr:border-b-0 prose-th:pb-3 prose-th:text-start prose-th:text-primary prose-td:py-1 prose-td:text-sm',
            classes?.sheetContent
          )
        "
      />

      <SheetFooter>
        <LinkExternal v-if="linkExternal" v-bind="linkExternal" />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
