export const DEFAULT_SUBMISSION_ALERTS: AlertMap<SubmitInformationErrorCode> = {
  FileTooBig: {
    type: 'error',
    title: 'File Too Big',
    description: 'The file you uploaded is too big. Please upload a smaller file.',
  },
  InvalidFileType: {
    type: 'error',
    title: 'Invalid File Type',
    description: 'The file type you uploaded is not supported. Please upload a valid file.',
  },
  Successful: {
    type: 'success',
    title: 'Submission Successful',
    description: 'Your submission has been successfully processed.',
  },
};
