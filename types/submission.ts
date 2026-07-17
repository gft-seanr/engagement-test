declare global {
  interface SubmitInformationParams {
    id: string;
    [key: string]: any;
  }

  // Todo
  type SubmitInformationErrorCode = 'FileTooBig' | 'InvalidFileType';

  interface SubmitInformationError extends BaseError<SubmitInformationErrorCode> {}

  interface SubmitInformationData {}

  interface SubmitInformationResponse
    extends BaseResponse<SubmitInformationData, SubmitInformationError> {}
}

export type {};
