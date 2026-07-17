<script setup lang="ts">
const props = defineProps<{
  title: string;
  description?: string;
  campaignUrl: string;
}>();

const { copy: copyToClipboard, copied: isCopied } = useClipboard({
  source: props.campaignUrl,
  copiedDuring: 2000,
});

function handleCopy() {
  copyToClipboard();
}
</script>
<template>
  <div class="flex flex-col gap-1.5 border-t border-neutral-100 pt-2 dark:border-neutral-800">
    <label class="text-[12px] font-medium text-neutral-700 dark:text-neutral-300">{{
      props.title
    }}</label>

    <div
      class="group relative flex h-9 items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/80 shadow-inner dark:border-neutral-700 dark:bg-neutral-900/80"
    >
      <div
        class="flex h-full items-center justify-center pr-2 pl-3 text-neutral-400 dark:text-neutral-500"
      >
        <Icon name="lucide:link" class="size-3.5" />
      </div>

      <input
        :value="props.campaignUrl"
        readonly
        type="text"
        class="h-full w-full appearance-none bg-transparent py-1 pr-10 font-mono text-[12px] text-neutral-600 outline-none select-all dark:text-neutral-400"
      />

      <div class="absolute inset-y-1 right-1 flex items-center">
        <button
          @click="handleCopy"
          type="button"
          class="flex h-full w-7 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-400 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          :title="isCopied ? 'Copied!' : 'Copy URL'"
        >
          <Icon
            :name="isCopied ? 'lucide:check' : 'lucide:copy'"
            class="size-3.5"
            :class="{ 'text-green-500 dark:text-green-400': isCopied }"
          />
        </button>
      </div>
    </div>

    <p class="mt-0.5 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
      {{ props.description || 'The default entry point for this campaign.' }}
    </p>
  </div>
</template>
