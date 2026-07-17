<script setup lang="ts">
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';

interface Props {
  open: boolean;
  images: string[];
  currentImageIndex: number;
  selectedEntry: ReceiptFileItem | null;
  editFormData: ReceiptFileItem | null;
}

interface Emits {
  (event: 'update:open', value: boolean): void;
  (event: 'update:current-image-index', index: number): void;
  (event: 'navigate-previous'): void;
  (event: 'navigate-next'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Zoom and pan state
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const imageContainer = ref<HTMLDivElement>();

// Computed total quantity from products
const totalQuantity = computed(() => {
  if (!props.editFormData?.spamFinderResponse?.products) return 0;
  return props.editFormData.spamFinderResponse.products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
});

// Reset zoom and pan when image changes
watch(
  () => props.currentImageIndex,
  () => {
    resetZoom();
  }
);

const closeDialog = () => {
  emit('update:open', false);
  resetZoom();
};

const navigateToPreviousImage = () => {
  emit('navigate-previous');
};

const navigateToNextImage = () => {
  emit('navigate-next');
};

const setCurrentImageIndex = (index: number) => {
  emit('update:current-image-index', index);
};

// Zoom functions
const resetZoom = () => {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
};

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.1, 5);
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.1, 0.5);
  // Adjust pan to keep image centered when zooming out
  const containerRect = imageContainer.value?.getBoundingClientRect();
  if (containerRect) {
    const maxPanX = (containerRect.width * (zoomLevel.value - 1)) / 2;
    const maxPanY = (containerRect.height * (zoomLevel.value - 1)) / 2;
    panX.value = Math.max(-maxPanX, Math.min(maxPanX, panX.value));
    panY.value = Math.max(-maxPanY, Math.min(maxPanY, panY.value));
  }
};

// Mouse wheel zoom
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

// Mouse drag for panning
const handleMouseDown = (event: MouseEvent) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true;
    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
    event.preventDefault();
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value && zoomLevel.value > 1) {
    event.preventDefault();
    const deltaX = event.clientX - dragStartX.value;
    const deltaY = event.clientY - dragStartY.value;

    panX.value += deltaX;
    panY.value += deltaY;

    // Update drag start position for next move
    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// Transform style
const imageTransform = computed(() => {
  return `translate(${panX.value}px, ${panY.value}px) scale(${zoomLevel.value})`;
});

// Cursor style
const cursorStyle = computed(() => {
  if (zoomLevel.value > 1) {
    return isDragging.value ? 'grabbing' : 'grab';
  }
  return 'default';
});

// Lifecycle
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove, { passive: false });
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <Dialog :open="open" @update:open="closeDialog">
    <DialogContent
      class="h-[90vh] !w-[95vw] !max-w-none gap-0 !bg-neutral-50 p-0"
      style="width: 95vw; max-width: none"
    >
      <DialogHeader class="border-b border-gray-200 !bg-neutral-50 p-6 pb-2">
        <DialogTitle class="flex items-center justify-between">
          <span>Receipt Image {{ currentImageIndex + 1 }} of {{ images.length }}</span>
        </DialogTitle>
      </DialogHeader>

      <div class="flex h-full overflow-hidden">
        <!-- Left Side - Image Viewer -->
        <div ref="imageContainer" class="relative flex-1 overflow-hidden bg-black px-6 pb-6">
          <!-- Zoom Controls -->
          <div class="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <button
              @click="zoomIn"
              class="rounded-full bg-black/70 p-2 text-white transition-all hover:bg-black/80 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <Icon name="lucide:zoom-in" :size="20" />
            </button>
            <button
              @click="zoomOut"
              class="rounded-full bg-black/70 p-2 text-white transition-all hover:bg-black/80 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <Icon name="lucide:zoom-out" :size="20" />
            </button>
            <button
              @click="resetZoom"
              class="rounded-full bg-black/70 p-2 text-white transition-all hover:bg-black/80 focus:ring-2 focus:ring-white focus:outline-none"
              title="Reset Zoom"
            >
              <Icon name="lucide:maximize" :size="20" />
            </button>
          </div>

          <!-- Zoom Level Indicator -->
          <div
            class="absolute top-4 right-4 z-20 rounded-full bg-black/70 px-3 py-1 text-sm text-white"
          >
            {{ Math.round(zoomLevel * 100) }}%
          </div>

          <!-- Navigation buttons -->
          <button
            v-if="images.length > 1"
            @click="navigateToPreviousImage"
            class="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
            :disabled="images.length <= 1"
          >
            <Icon name="lucide:chevron-left" :size="24" />
          </button>

          <button
            v-if="images.length > 1"
            @click="navigateToNextImage"
            class="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
            :disabled="images.length <= 1"
          >
            <Icon name="lucide:chevron-right" :size="24" />
          </button>

          <!-- Current image -->
          <div
            class="flex h-full items-center justify-center select-none"
            @wheel="handleWheel"
            @mousedown="handleMouseDown"
            :style="{ cursor: cursorStyle }"
          >
            <img
              v-if="images[currentImageIndex]"
              :src="images[currentImageIndex]"
              :alt="`Receipt image ${currentImageIndex + 1}`"
              class="h-auto max-h-full max-w-full transition-transform duration-100 select-none"
              :style="{
                transform: imageTransform,
              }"
              draggable="false"
              style="max-height: calc(90vh - 120px)"
            />
          </div>

          <!-- Image counter dots -->
          <div
            v-if="images.length > 1"
            class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
          >
            <button
              v-for="(_, index) in images"
              :key="index"
              @click="setCurrentImageIndex(index)"
              class="h-2 w-2 rounded-full transition-all"
              :class="{
                'bg-white': index === currentImageIndex,
                'bg-white/50 hover:bg-white/75': index !== currentImageIndex,
              }"
            />
          </div>
        </div>

        <!-- Right Side - Details -->
        <div class="w-1/3 overflow-y-auto border-l border-gray-200 bg-gray-50 p-6">
          <div class="space-y-6">
            <!-- Spam Finder Response -->
            <div v-if="editFormData">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Spam Finder Response</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <label class="text-sm font-semibold text-gray-600">Invoice Number:</label>
                    <p class="text-sm">
                      {{ editFormData.spamFinderResponse.invoiceNumber || 'N/A' }}
                    </p>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-600">Store Name:</label>
                    <p class="text-sm">{{ editFormData.spamFinderResponse.storeName || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-600">Store ID:</label>
                    <p class="text-sm">{{ editFormData.spamFinderResponse.storeId || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-600">Receipt Date & Time:</label>
                    <p class="text-sm">
                      {{ editFormData.spamFinderResponse.receiptDateTime || 'N/A' }}
                    </p>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-600">Total SPAM Cans:</label>
                    <p class="text-sm font-medium">{{ totalQuantity }}</p>
                  </div>
                </div>

                <!-- Products -->
                <div v-if="editFormData.spamFinderResponse.products?.length">
                  <label class="text-sm font-semibold text-gray-600">Products:</label>
                  <div class="mt-2 space-y-2">
                    <div
                      v-for="(product, index) in editFormData.spamFinderResponse.products"
                      :key="index"
                      class="flex justify-between rounded border border-gray-200 bg-white p-2 text-sm"
                    >
                      <span>{{ product.name }}</span>
                      <span class="font-medium">Qty: {{ product.quantity }}</span>
                    </div>
                  </div>
                </div>

                <!-- Feedback -->
                <div>
                  <h3 class="mb-4 text-lg font-semibold text-gray-900">Auth Response</h3>
                  <p class="mt-1 rounded border border-gray-200 bg-white p-2 text-sm">
                    {{ selectedEntry?.feedback || 'No feedback provided' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
