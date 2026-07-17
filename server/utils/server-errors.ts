import type { BaseError, ServerErrorCode } from '~/shared/types/globals';

// Server-side error responses
export const serverErrors = {
  Unauthorized: {
    code: 'Unauthorized',
    description: 'Your session has expired. Please log in again.',
  },
  InternalServerError: {
    code: 'InternalServerError',
    description: 'Something went wrong. Please try again later.',
  },
  NetworkUnavailable: {
    code: 'NetworkUnavailable',
    description: 'Connection failed. Please check your internet and try again.',
  },
  Forbidden: {
    code: 'Forbidden',
    description: 'You do not have permission to access this resource.',
  },
  TooManyAttempts: {
    code: 'TooManyAttempts',
    description: 'Too many attempts. Please try again later.',
  },
} as const;

// Helper function to create error response
export function createErrorResponse<T>(error: BaseError<ServerErrorCode>): T {
  return {
    isSuccessful: false,
    data: null,
    errors: [error],
    timestamp: new Date().toISOString(),
  } as T;
}
