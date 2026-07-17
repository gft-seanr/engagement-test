export const DEFAULT_REGISTER_ALERT: AlertMap<RegisterErrorCode> = {
  InvalidReferenceNo: {
    type: 'error',
    title: 'Invalid Promo Code',
    description: 'The promo code you entered is invalid. Please check and try again.',
  },
  AlreadyRegisteredUsername: {
    type: 'error',
    title: "You're already registered!",
    description: 'The promo code you entered is already registered. Please check and try again.',
  },
  AlreadyRegisteredReferenceNo: {
    type: 'error',
    title: "You're already registered!",
    description: 'The promo code you entered is already registered. Please check and try again.',
  },
  AccountPending: {
    type: 'error',
    title: 'Registration Pending',
    description: 'This account has already been registered, but is currently pending approval.',
  },
  Successful: {
    type: 'success',
    title: 'Registration Successful',
    description: 'You have successfully registered with the promo code.',
  },
};

export const DEFAULT_REGISTER_RESEND_ALERT: AlertMap<RegisterErrorCode> = {
  ...DEFAULT_REGISTER_ALERT,
  Successful: {
    type: 'success',
    title: 'Verification Code Sent',
    description: 'A new verification code has been successfully sent.',
  },
};

export const DEFAULT_REGISTER_OTP_ALERT: AlertMap<RegisterOtpErrorCode> = {
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
    title: 'Register Successful',
    description: 'You have successfully registered.',
  },
};
