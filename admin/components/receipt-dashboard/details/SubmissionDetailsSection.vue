<script setup lang="ts">
import { ZoomInIcon } from 'lucide-vue-next';
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { formatDate } from '~/admin/utils/helpers';
import { getStatusColorClasses, getStatusDisplayName } from '~/admin/utils/helpers';

interface Props {
  selectedEntry: ReceiptFileItem;
  signedURLs: string[];
  isPending: boolean;
  isError?: boolean;
  errors?: any[];
}

interface Emits {
  (event: 'open-image', index: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="space-y-4">
    <h3 class="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
      Submission Details
    </h3>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label class="text-sm font-bold">Name</label>
        <p class="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-900">
          {{ selectedEntry.name }}
        </p>
      </div>

      <div>
        <label class="text-sm font-bold">Contact Number</label>
        <p class="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-900">
          {{ selectedEntry.contactNumber }}
        </p>
      </div>

      <div>
        <label class="text-sm font-bold">Submission Date</label>
        <p class="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-900">
          {{ formatDate(selectedEntry.submissionDate) }}
        </p>
      </div>

      <div>
        <label class="text-sm font-bold">Status</label>
        <div class="mt-1">
          <span
            class="inline-block rounded-full px-3 py-2 text-xs font-medium"
            :class="[
              getStatusColorClasses(selectedEntry.statusId).bg,
              getStatusColorClasses(selectedEntry.statusId).text,
            ]"
          >
            {{ getStatusDisplayName(selectedEntry.statusId) }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <label class="mb-3 block text-sm font-bold">Receipt Images</label>

      <!-- Error Alert -->
      <Alert v-if="!isPending && isError" class="border-red-500 bg-red-100 text-red-500">
        <AlertDescription class="text-red-500">
          {{
            errors?.[0]?.description ||
            'An error occurred while loading receipt images. Please try again.'
          }}
        </AlertDescription>
      </Alert>

      <!-- Loading state -->
      <div v-else-if="isPending" class="grid grid-cols-2 gap-4">
        <div v-for="i in 2" :key="`loading-${i}`" class="animate-pulse">
          <div class="h-40 w-full rounded-lg bg-gray-200"></div>
        </div>
      </div>

      <!-- No images available -->
      <div
        v-else-if="signedURLs.length === 0"
        class="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
      >
        <div class="text-center text-gray-500">
          <Icon name="lucide:image-off" :size="32" class="mx-auto mb-2" />
          <p class="text-sm">No receipt images available</p>
        </div>
      </div>

      <!-- Actual images -->
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="(imageUrl, index) in signedURLs"
          :key="index"
          class="group relative cursor-pointer"
          @click="emit('open-image', index)"
        >
          <div
            class="relative overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg"
          >
            <img
              :src="imageUrl"
              :alt="`Receipt image ${index + 1}`"
              class="h-40 w-full object-contain"
              loading="lazy"
            />

            <div
              class="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center transition-all"
            >
              <ZoomInIcon
                class="text-white opacity-0 transition-opacity group-hover:opacity-100"
                :size="24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
