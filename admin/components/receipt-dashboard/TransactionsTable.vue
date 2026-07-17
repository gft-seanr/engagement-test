<script setup lang="ts">
import { FlagIcon } from 'lucide-vue-next';
import { type ReceiptFileItem, ReceiptStatus } from '~/admin/types/receipt-dashboard';
import { getStatusDisplayName, getStatusColorClasses } from '~/admin/utils/helpers';
import { formatDate } from '~/admin/utils/helpers';
import { useReceiptTransactionsQuery } from '~/admin/composables/queries/useReceiptTransactionsQuery';
import type { LucideIcon } from 'lucide-vue-next';

interface Props {
  campaignId: string;
  selectedId?: string;
  headerIcon?: LucideIcon;
  headerTitle?: string;
  headerDescription?: string;
}

interface Emits {
  (event: 'select-entry', entry: ReceiptFileItem): void;
}

const props = withDefaults(defineProps<Props>(), {
  headerIcon: () => FlagIcon,
  headerTitle: 'SPAM Club Transactions',
  headerDescription: 'List of SPAM Club submissions for manual verification',
});
const emit = defineEmits<Emits>();

const route = useRoute();
const router = useRouter();

// Status filter state - initialize from route query or use defaults
const defaultStatuses = [5128, 5316, 5313];
const selectedStatusFilters = ref<number[]>(
  route.query.statuses ? (route.query.statuses as string).split(',').map(Number) : defaultStatuses
);

// Sync status filters to route query params and reset page to 1
watch(
  selectedStatusFilters,
  (newStatuses) => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        statuses: newStatuses.join(','),
        page: '1', // Reset to first page when filters change
      },
    });
  },
  { deep: true }
);

// Available status options for filtering
const availableStatuses = [
  ReceiptStatus.Queued,
  ReceiptStatus.Processed,
  ReceiptStatus.Failed,
  ReceiptStatus.ForManualValidation,
  ReceiptStatus.ValidationSuccess,
  ReceiptStatus.ValidationFail,
  ReceiptStatus.ForRetry,
];

// Toggle status filter
const toggleStatusFilter = (statusId: number) => {
  const index = selectedStatusFilters.value.indexOf(statusId);
  if (index > -1) {
    // Remove if exists
    selectedStatusFilters.value.splice(index, 1);
  } else {
    // Add if doesn't exist
    selectedStatusFilters.value.push(statusId);
  }
};

// Query for transactions with reactive filters
const { receiptTransactionsResponse, isLoading, isError, errors, refetch } =
  useReceiptTransactionsQuery({
    id: props.campaignId,
    processingStatusIds: selectedStatusFilters.value,
  });

const allSpamEntries = computed(() => receiptTransactionsResponse.value?.fileItems || []);

// Pagination
const itemsPerPage = 25;
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (page: number) => {
    router.push({
      path: route.path,
      query: { ...route.query, page: page.toString() },
    });
  },
});

// Paginated entries
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allSpamEntries.value.slice(start, end);
});

const handleSelectEntry = (entry: ReceiptFileItem) => {
  emit('select-entry', entry);
};

// Auto-select entry from URL query on load
watch(
  allSpamEntries,
  (entries) => {
    const idFromQuery = route.query.id as string;
    if (idFromQuery && entries.length > 0) {
      const entryToSelect = entries.find((entry) => entry.id === idFromQuery);
      if (entryToSelect) {
        handleSelectEntry(entryToSelect);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex h-full w-full flex-col rounded-md border border-gray-200 bg-white">
    <div class="mb-2 flex px-6 pt-6">
      <component :is="props.headerIcon" :size="32" />
      <div class="ml-4 flex flex-col justify-center">
        <h2 class="font-display text-lg font-bold">{{ props.headerTitle }}</h2>
        <p class="text-sm text-gray-500">
          {{ props.headerDescription }}
        </p>
      </div>
    </div>

    <!-- Status Filter Badges -->
    <div class="px-6 pb-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="statusId in availableStatuses"
          :key="statusId"
          @click="toggleStatusFilter(statusId)"
          class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm"
          :class="[
            selectedStatusFilters.includes(statusId)
              ? [
                  getStatusColorClasses(statusId).bg,
                  getStatusColorClasses(statusId).text,
                  'border-transparent',
                ]
              : ['border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'],
          ]"
        >
          {{ getStatusDisplayName(statusId) }}
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div class="w-full px-6">
      <Alert v-if="!isLoading && isError" class="border-red-500 bg-red-100 text-red-500">
        <AlertDescription class="text-red-500">
          {{
            errors?.[0]?.description ||
            'An error occurred while loading transactions. Please try again.'
          }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- Transactions Table -->
    <div class="mt-2 h-full flex-1 overflow-auto">
      <Table class="w-full">
        <TableHeader>
          <TableRow
            class="!border-b !border-gray-200 text-xs font-medium uppercase hover:bg-gray-50"
          >
            <TableHead class="px-6 !text-gray-500">Submission Date</TableHead>
            <TableHead class="px-6 !text-gray-500">Name</TableHead>
            <TableHead class="px-6 !text-gray-500">Contact Number</TableHead>
            <TableHead class="px-6 !text-gray-500">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Loading skeleton rows -->
          <TableRow
            v-if="isLoading"
            v-for="i in 10"
            :key="`loading-${i}`"
            class="animate-pulse !border-b !border-gray-200"
          >
            <TableCell class="px-6">
              <div class="h-4 w-24 rounded bg-gray-200"></div>
            </TableCell>
            <TableCell class="px-6">
              <div class="h-4 w-32 rounded bg-gray-200"></div>
            </TableCell>
            <TableCell class="px-6">
              <div class="h-4 w-28 rounded bg-gray-200"></div>
            </TableCell>
            <TableCell class="px-6">
              <div class="h-5 w-20 rounded-full bg-gray-200"></div>
            </TableCell>
          </TableRow>

          <!-- Actual data rows -->
          <TableRow
            v-else
            v-for="entry in paginatedEntries"
            :key="entry.id"
            class="cursor-pointer !border-b !border-gray-200 transition-all duration-300 ease-in-out"
            :class="{
              'bg-purple-100 font-bold shadow-md hover:bg-purple-100': selectedId === entry.id,
              'hover:bg-gray-50 hover:shadow-sm': selectedId !== entry.id,
            }"
            @click="handleSelectEntry(entry)"
          >
            <TableCell class="max-w-xs truncate px-6">{{
              formatDate(entry.submissionDate)
            }}</TableCell>
            <TableCell class="px-6">{{ entry.name }}</TableCell>
            <TableCell class="px-6">{{ entry.contactNumber }}</TableCell>
            <TableCell class="px-6">
              <span
                class="rounded-full px-2 py-1 text-xs font-medium"
                :class="[
                  getStatusColorClasses(entry.statusId).bg,
                  getStatusColorClasses(entry.statusId).text,
                ]"
              >
                {{ getStatusDisplayName(entry.statusId) }}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <TablePagination
      :current-page="currentPage"
      :total-items="allSpamEntries.length"
      :items-per-page="itemsPerPage"
      @update:current-page="currentPage = $event"
    />
  </div>
</template>
