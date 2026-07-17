declare global {
  type Nullable<T> = T | null;
  type Maybe<T> = T | undefined;

  type ServerErrorCode =
    | 'InternalServerError'
    | 'Unauthorized'
    | 'NetworkUnavailable'
    | 'TooManyAttempts'
    | 'Forbidden';

  type BaseResponse<TData, TError = BaseError<ServerErrorCode>> = {
    isSuccessful: boolean;
    data: Nullable<TData>;
    errors: Nullable<TError[]>;
    timestamp: string;
  };

  type BaseError<TCode> = {
    code: TCode | ServerErrorCode;
    description: string;
  };
}
export type {};
