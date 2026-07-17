<script setup lang="ts">
import { Button } from '@/components/shadcn-ui/button';

interface Props {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  showFirstLast?: boolean;
}

interface Emits {
  (e: 'update:currentPage', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  showFirstLast: true,
});

const emit = defineEmits<Emits>();

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1);
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems));

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages.value <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Show smart pagination with ellipsis
    if (props.currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages.value);
    } else if (props.currentPage >= totalPages.value - 2) {
      pages.push(
        1,
        '...',
        totalPages.value - 3,
        totalPages.value - 2,
        totalPages.value - 1,
        totalPages.value
      );
    } else {
      pages.push(
        1,
        '...',
        props.currentPage - 1,
        props.currentPage,
        props.currentPage + 1,
        '...',
        totalPages.value
      );
    }
  }

  return pages;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};

const goToPrevious = () => goToPage(props.currentPage - 1);
const goToNext = () => goToPage(props.currentPage + 1);
const goToFirst = () => goToPage(1);
const goToLast = () => goToPage(totalPages.value);
</script>

<template>
  <div class="flex items-center justify-between border-t !border-gray-200 !bg-white px-6 py-4">
    <!-- Left side - Item range -->
    <div class="text-sm !text-gray-700">
      <span v-if="totalItems === 0">No entries</span>
      <span v-else> {{ startItem }}-{{ endItem }} of {{ totalItems }} </span>
    </div>

    <!-- Right side - Pagination controls -->
    <div class="flex items-center space-x-1">
      <!-- First page -->
      <Button
        v-if="showFirstLast"
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        class="!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50 disabled:!cursor-not-allowed disabled:!opacity-50"
        @click="goToFirst"
      >
        <Icon name="lucide:chevrons-left" :size="16" />
      </Button>

      <!-- Previous page -->
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        class="!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50 disabled:!cursor-not-allowed disabled:!opacity-50"
        @click="goToPrevious"
      >
        <Icon name="lucide:chevron-left" :size="16" />
      </Button>

      <!-- Page numbers -->
      <template v-for="page in visiblePages" :key="page">
        <Button
          v-if="typeof page === 'number'"
          :variant="page === currentPage ? 'default' : 'outline'"
          size="sm"
          :class="
            page === currentPage
              ? '!border-gray-900 !bg-gray-900 !text-white'
              : '!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50 disabled:!cursor-not-allowed disabled:!opacity-50'
          "
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
        <span v-else class="px-2 !text-gray-500">{{ page }}</span>
      </template>

      <!-- Next page -->
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        class="!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50 disabled:!cursor-not-allowed disabled:!opacity-50"
        @click="goToNext"
      >
        <Icon name="lucide:chevron-right" :size="16" />
      </Button>

      <!-- Last page -->
      <Button
        v-if="showFirstLast"
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        class="!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50 disabled:!cursor-not-allowed disabled:!opacity-50"
        @click="goToLast"
      >
        <Icon name="lucide:chevrons-right" :size="16" />
      </Button>
    </div>
  </div>
</template>
