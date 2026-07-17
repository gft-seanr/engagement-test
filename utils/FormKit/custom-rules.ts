import { type FormKitNode } from '@formkit/core';

const isEmpty = (value: any): boolean => {
  return (
    value == null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const isFile = (input: any): input is File => 'File' in window && input instanceof File;

function formatFileSize(
  size: number,
  units: string[] = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  delimiter: string = ''
) {
  const threshold = 1024;
  size = size * threshold;
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return Number((size / Math.pow(threshold, i)).toFixed(2)) + delimiter + units[i];
}

interface FileObject {
  file: File;
}

export const size = ({ value: files }: FormKitNode, paramSize: number = 5000): boolean => {
  if (isEmpty(files)) {
    return true;
  }

  if (isNaN(paramSize)) {
    return false;
  }

  const nSize = paramSize * 1024;

  if (!Array.isArray(files)) {
    if (isFile(files)) {
      return files.size <= nSize || files.size === 0 || files.size === undefined;
    }
    return false;
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].file.size > nSize || files[i].file.size == 0 || files[i].file.size == undefined) {
      return false;
    }
  }
  return true;
};

interface ValidationMessageContext {
  node: { value: FileObject[] };
  args: [number];
}

export const sizeValidationMessage = ({ node: { value }, args }: ValidationMessageContext) => {
  let files = value;
  for (let i = 0; i < files.length; i++) {
    if (!isFile(files[i].file)) {
      return `It looks like the file you are trying to upload has been moved or renamed after you selected it. It is necessary to reselect.`;
    }
  }
  return `The file size must not exceed ${formatFileSize(args[0])}.`;
};
