declare global {
  // Interface for tokens
  interface TokenParams {
    id: string;
    programId?: string;
  }

  // todo: Add interface for token error
  type TokenErrorCode = 'TokenNotFound';

  interface TokenError extends BaseError<TokenErrorCode> {}

  interface Token {
    availableDateTime: string;
    expiryDateTime: string;
    link: string;
    referenceNo: string;
    statusId: TokenStatusId;
    tokenId: string;
    tokenTypeId: number;
    value: number;
    valueType: number;
    tier: number;
  }

  type TokenStatusId = 43 | 44 | 45; // active, redeemed, voided

  interface TokenData {
    tokens: Token[];
    totalCount: number;
  }

  interface TokenResponse extends BaseResponse<TokenData, TokenError> {}

  // Interface for redeeming tokens
  interface RedeemTokenParams {
    id: string;
    voucher?: string;
    email?: string;
    mobile?: string;
    hash?: string;
    programId?: string;
  }

  type RedeemTokenErrorCode =
    | 'AlreadyRedeemed'
    | 'TokenNotFound'
    | 'WeeklyLimitReached'
    | 'DailyLimitReached'
    | 'Expired'
    | 'MODEL_ERROR';

  interface RedeemTokenError extends BaseError<RedeemTokenErrorCode> {}

  interface RedeemTokenData extends Token {}

  interface RedeemTokenResponse extends BaseResponse<RedeemTokenData, RedeemTokenError> {}
}

// Token status constants for use in code
export const TOKEN_STATUS = {
  active: 43,
  redeemed: 44,
  voided: 45,
  expired: 4248,
} as const;

// Helper function to get status name from ID
export function getTokenStatusName(statusId: TokenStatusId): keyof typeof TOKEN_STATUS | undefined {
  return Object.keys(TOKEN_STATUS).find(
    (key) => TOKEN_STATUS[key as keyof typeof TOKEN_STATUS] === statusId
  ) as keyof typeof TOKEN_STATUS | undefined;
}

export type {};
