import { type HTMLAttributes } from 'vue';

declare global {
  // Common
  type NestedClasses<T> = {
    [K in keyof T]?: T[K] extends object ? NestedClasses<T[K]> : HTMLAttributes['class'];
  };

  // Alert
  interface Alert {
    type: 'error' | 'success' | 'warning' | 'info';
    icon?: string;
    iconSize?: number;
    title?: string;
    description?: string;
  }

  type Successful = 'Successful';

  type AlertMap<T extends string> = Record<T, Alert> & Record<Successful, Alert>;

  // Link External
  interface LinkExternalProps {
    label: string;
    destination: string;
    prefixIcon?: string;
    suffixIcon?: string;
  }

  interface LinkExternalClasses extends NestedClasses<LinkExternalProps> {
    outer?: HTMLAttributes['class'];
  }

  interface LinkExternalPropsWithClasses extends LinkExternalProps {
    classes?: LinkExternalClasses;
  }

  // Sheet Markdown
  interface SheetMarkdownProps {
    triggerText?: string;
    triggerIcon?: string;
    sheetTitle?: string;
    sheetContent: string;
    linkExternal?: LinkExternalPropsWithClasses;
  }

  interface SheetMarkdownClasses extends NestedClasses<SheetMarkdownProps> {
    outer?: HTMLAttributes['class'];
    wrapper?: HTMLAttributes['class'];
  }

  interface SheetMarkdownPropsWithClasses extends SheetMarkdownProps {
    classes?: SheetMarkdownClasses;
  }

  //Transaction Table
  interface TransactionTableProps {
    title?: string;
    description?: string;
    hasTotal?: boolean;
    itemsPerPage?: number;
    emptyMessage?: string;
    additionalReference?: keyof Transaction;
    sortDateBy?: 'asc' | 'desc';
  }
}
export type {};
