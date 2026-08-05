declare global {
  interface RegisterParams {
    id: string;
    campaignId?: string;
    code: string;
    l4?: string;
    mobileno?: string;
    programId: string;
  }

  type RegisterErrorCode =
    | 'InvalidReferenceNo'
    | 'AlreadyRegisteredUsername'
    | 'AlreadyRegisteredReferenceNo'
    | 'AccountPending';

  interface RegisterError extends BaseError<RegisterErrorCode> {}

  interface RegisterData {
    registeredAt: string;
    referenceno: string;
    verificationToken?: string;
  }

  interface RegisterResponse extends BaseResponse<RegisterData, RegisterError> {}

  type RegisterOtpErrorCode = 'IncorrectToken' | 'IncorrectCode' | 'InvalidToken';
  interface RegisterOtpError extends BaseError<RegisterOtpErrorCode> {}
  interface RegisterOtpParams {
    id: string;
    mobileno: string;
    token: string;
    otp: string;
  }
  interface RegisterOtpData {
    referenceno: string;
    registeredAt: string;
  }
  interface RegisterOtpResponse extends BaseResponse<RegisterOtpData, RegisterOtpError> {}
}

export type {};
