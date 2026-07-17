// Status enum for spam club submissions
export enum ReceiptStatus {
  Queued = 5128,
  Processed = 5129,
  Failed = 5130,
  ForManualValidation = 5313,
  ValidationSuccess = 5314,
  ValidationFail = 5315,
  ForRetry = 5316,
}

// Enum for handling approval/rejection decisions
export enum DecisionStatus {
  APPROVE = 5314, // ValidationSuccess
  REJECT = 5315, // ValidationFail
}

export interface SpamProduct {
  name: string; // Revert back to original field name
  quantity: number;
}

export interface SpamFinderResponse {
  invoiceNumber: Nullable<string>;
  storeName: string;
  storeId: string;
  receiptDateTime: string; // Revert back to original field name
  total: number; // Keep original field name but derive from products
  products: SpamProduct[]; // Revert back to original field name
}

export interface ReceiptFileItem {
  id: string;
  name: string;
  contactNumber: string;
  statusId: number;
  images: string[];
  spamFinderResponse: SpamFinderResponse;
  submissionDate: string;
  feedback: Nullable<string>;
}

export interface ReceiptTransactionsData extends TransactionData {
  fileItems: ReceiptFileItem[];
}

export type ReceiptTransactionsResponse = BaseResponse<ReceiptTransactionsData>;

export interface PatchTransactionData {
  id: string;
  hash: string;
  decisionStatusId: number;
  feedback: Nullable<string>;
  invoiceNumber: Nullable<string>;
  storeName: Nullable<string>;
  storeId: Nullable<string>;
  receiptDateTime: Nullable<string>;
  products: Nullable<SpamProduct[]>;
}

export interface ReceiptTransactionsRequest {
  id?: string;
  processingStatusIds?: number[];
}

export interface TransactionsExtendRequest {
  id: string;
  hash: string;
}

export interface TransactionsExtendData {
  id: string;
  signedUrls: string[];
  expiresIn: number;
}

export type TransactionsExtendResponse = BaseResponse<TransactionsExtendData>;
