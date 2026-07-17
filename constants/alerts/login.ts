export const DEFAULT_LOGIN_ALERT: AlertMap<LoginErrorCode> = {
  InvalidUserPassword: {
    type: 'error',
    title: 'Invalid Promo Code',
    description: 'The promo code you entered is incorrect. Please try again.',
  },
  Successful: {
    type: 'success',
    title: 'Verification Code Sent',
    description: 'A new verification code has been successfully sent.',
  },
};

export const DEFAULT_LOGIN_OTP_ALERT: AlertMap<LoginOtpErrorCode> = {
  IncorrectToken: {
    type: 'error',
    description: 'The verification code you entered is incorrect. Please try again.',
  },
  IncorrectCode: {
    type: 'error',
    description: 'The verification code you entered is incorrect. Please try again.',
  },
  InvalidToken: {
    type: 'error',
    description:
      'The verification code you entered has expired. Please request a new code and try again',
  },
  Successful: {
    type: 'success',
    title: 'Login Successful',
    description: 'You have successfully logged in.',
  },
};
