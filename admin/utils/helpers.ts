import type { PatchTransactionData, ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { DecisionStatus, ReceiptStatus } from '~/admin/types/receipt-dashboard';
import { STORE_DATA, SPAM_PRODUCTS } from '~/admin/constants/merchants';
/**
 * Maps ReceiptFileItem (editFormData) to PatchTransactionData for API updates
 */
export function mapEditFormDataToPatchData(
  editFormData: ReceiptFileItem,
  id: string,
  statusId: DecisionStatus
): PatchTransactionData {
  return {
    id: id,
    hash: editFormData.id,
    decisionStatusId: statusId, // Set to approved or rejected status
    feedback: editFormData.feedback || '',
    invoiceNumber: editFormData.spamFinderResponse?.invoiceNumber || '',
    storeName: editFormData.spamFinderResponse?.storeName || '',
    storeId: editFormData.spamFinderResponse?.storeId || '',
    receiptDateTime: editFormData.spamFinderResponse?.receiptDateTime || '',
    products: editFormData.spamFinderResponse?.products || '',
  };
}

/**
 * Formats a date string or Date object to a readable format
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

// Helper functions for store mapping
export function getStoreIdByName(storeName: string): string {
  return STORE_DATA[storeName as keyof typeof STORE_DATA] || '';
}

export function getStoreOptions(): Array<{ label: string; value: string }> {
  return Object.keys(STORE_DATA).map((storeName) => ({
    label: storeName,
    value: storeName,
  }));
}

export function getSpamProductOptions(): Array<{ label: string; value: string }> {
  return SPAM_PRODUCTS.map((product) => ({
    label: product,
    value: product,
  }));
}

// Get status display name
export function getStatusDisplayName(statusId: number): string {
  switch (statusId) {
    case ReceiptStatus.Queued:
      return 'Queued';
    case ReceiptStatus.Processed:
      return 'Processed';
    case ReceiptStatus.Failed:
      return 'Failed';
    case ReceiptStatus.ForManualValidation:
      return 'For Manual Validation';
    case ReceiptStatus.ValidationSuccess:
      return 'Validation Success';
    case ReceiptStatus.ValidationFail:
      return 'Validation Fail';
    case ReceiptStatus.ForRetry:
      return 'For Retry';
    default:
      return 'Unknown';
  }
}

// Get status color classes
export function getStatusColorClasses(statusId: number): { bg: string; text: string } {
  switch (statusId) {
    case ReceiptStatus.Queued:
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case ReceiptStatus.Processed:
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case ReceiptStatus.Failed:
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case ReceiptStatus.ForManualValidation:
      return { bg: 'bg-orange-100', text: 'text-orange-800' };
    case ReceiptStatus.ValidationSuccess:
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case ReceiptStatus.ValidationFail:
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case ReceiptStatus.ForRetry:
      return { bg: 'bg-purple-100', text: 'text-purple-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}
