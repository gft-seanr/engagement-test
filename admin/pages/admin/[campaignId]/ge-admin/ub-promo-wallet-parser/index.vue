<script setup lang="ts">
import { ref } from 'vue';
import * as xlsx from 'xlsx';

const rawExcelData = ref<Record<string, any>>({});
const isDragging = ref(false);

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  await processExcel(file);

  target.value = '';
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;

  await processExcel(file);
}

async function processExcel(file: File) {
  const buffer = await file.arrayBuffer();

  const workbook = xlsx.read(buffer, {
    type: 'buffer',
    cellDates: true,
  });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, {
    header: 1,
    raw: false,
  });

  const mappedData: Record<string, any> = {};

  rawRows.forEach((row) => {
    if (row[0] && row[1] !== undefined) {
      const key = String(row[0]).trim();
      let value = row[1];

      const isDateField = key.includes('Start') || key.includes('End') || key.includes('Expiry');

      if (isDateField) {
        value = useDateFormat(value, 'MM/DD/YYYY').value;
      }

      if (key === 'Long Description (How it Works)') {
        const paragraphs = String(value)
          .split(/\r?\n/)
          .filter((p) => p.trim() !== '');

        const formattedMarkdown = paragraphs.map((p) => `+ ${p.trim()}`).join('\n');

        mappedData[key] = formattedMarkdown;
      }

      mappedData[key] = value;
    }
  });

  rawExcelData.value = mappedData;
  console.log('✅ Excel Successfully Parsed:', mappedData);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 p-8">
    <div
      class="relative flex h-48 w-full max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
      :class="
        isDragging
          ? 'border-purple-500 bg-purple-50'
          : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100'
      "
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <Icon name="lucide:file-spreadsheet" class="mb-3 size-10 text-neutral-400" />
      <p class="text-sm font-medium text-neutral-700">Drop your Campaign Excel file here</p>
      <p class="mt-1 text-xs text-neutral-500">or click to browse</p>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        class="absolute inset-0 cursor-pointer opacity-0"
        @change="handleFileUpload"
      />
    </div>

    <div
      v-if="Object.keys(rawExcelData).length"
      class="w-full max-w-2xl rounded-lg bg-neutral-900 p-4 shadow-lg"
    >
      <h3 class="mb-2 text-sm font-bold text-white">Raw Excel Output:</h3>
      <pre class="overflow-auto text-xs whitespace-pre-wrap text-green-400">{{
        JSON.stringify(rawExcelData, null, 2)
      }}</pre>
    </div>
  </div>
</template>
