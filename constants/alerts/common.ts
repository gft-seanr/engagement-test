export const GENERAL_ALERT: AlertMap<ServerErrorCode> = {
  InternalServerError: {
    type: 'error',
    description: 'Something went wrong. Please try again later.',
  },
  NetworkUnavailable: {
    type: 'error',
    description: 'Connection failed. Please check your internet and try again.',
  },
  Unauthorized: {
    type: 'error',
    description: 'Your session has expired. Please log in again.',
  },
  Forbidden: {
    type: 'error',
    title: 'Access Denied',
    description:
      "You don't have permission to access this content. Please check your account or contact support if needed.",
  },
  TooManyAttempts: {
    type: 'error',
    description: 'Too many attempts. Please try again later.',
  },
  Successful: {
    type: 'success',
    title: 'Successful',
    description: 'The operation was completed successfully.',
  },
};
