declare global {
  interface TransactionParams {
    id: string;
    size?: number;
    programId?: string;
  }

  //todo: Add interface for transaction error
  type TransactionErrorCode = 'TransactionNotFound';

  interface TransactionError extends BaseError<TransactionErrorCode> {}

  interface Transaction {
    transactionID: string;
    referenceNo: string;
    transactionDateTime: string;
    description: string;
    amount: number;
    raffleEntries: number;
    tier: number;
    spendType: string;
  }

  interface TransactionData {
    totalCount: string;
    transactions: Transaction[];
  }

  interface TransactionResponse extends BaseResponse<TransactionData, TransactionError> {}
}

export type {};
