declare global {
  // Interface for login
  interface LoginParams {
    id: string;
    code: string;
    mobileno?: string;
  }

  // Admin login interface that extends LoginParams
  interface AdminLoginParams extends LoginParams {
    email: string;
    password: string;
    // Add any other admin-specific fields here
  }

  type LoginErrorCode = 'InvalidUserPassword';

  interface LoginError extends BaseError<LoginErrorCode> {}

  interface LoginData {
    verificationToken?: string;
    accessToken?: string;
    email?: string;
    referenceno?: string;
    permission?: string;
  }

  interface LoginResponse extends BaseResponse<LoginData, LoginError> {}

  // Interface for login otp
  interface LoginOtpParams {
    id: string;
    token: string;
    code: string;
  }

  type LoginOtpErrorCode = 'IncorrectToken' | 'IncorrectCode' | 'InvalidToken';

  interface LoginOtpError extends BaseError<LoginOtpErrorCode> {}

  interface LoginOtpData {
    referenceno: string;
    registeredAt: string;
    accessToken: string;
    permission?: string;
  }

  interface LoginOtpResponse extends BaseResponse<LoginOtpData, LoginOtpError> {}

  interface LoginPassParams {
    id: string;
    token?: string;
    parentCampaignId?: string;
  }

  // Interface for logout
  interface LogoutParams {
    id: string;
  }

  type LogoutErrorCode = string; // add any logout-specific error codes here if needed

  interface LogoutError extends BaseError<LogoutErrorCode> {}

  interface LogoutResponse extends BaseResponse<null, LogoutError> {}
}

export type {};
