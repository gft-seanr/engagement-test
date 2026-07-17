declare global {
  interface TargetParams {
    programId: string;
  }

  interface Target {
    targetId: string;
    programId: string;
    name: string;
    ordinalPosition: string;
    description: string;
  }

  interface TargetData {
    targets: Target[];
    totalCount: number;
  }

  // Todo: Add interface for target error
  type TargetErrorCode = 'TargetNotFound';

  interface TargetError extends BaseError<TargetErrorCode> {}

  interface TargetResponse extends BaseResponse<TargetData, TargetError> {}
}

export type {};
