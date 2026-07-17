import SpendCountPreview from '~/admin/components/builder/preview/SpendCountPreview.vue';

export const category = 'widgets';

export const properties = {
  title: {
    default: 'Spend Count',
    editor: {
      type: 'text',
      label: 'Title',
    },
  },
  description: {
    default: 'Description',
    editor: {
      type: 'textarea',
      label: 'Description',
    },
  },
  iconUrl: {
    default: 'lucide:credit-card',
    editor: {
      group: 'Icon',
      type: 'icon-picker',
      label: 'Icon',
    },
  },
  amountCurrency: {
    default: 'P',
    editor: {
      group: 'Amount',
      type: 'text',
      label: 'Amount Currency',
    },
  },
  amountDescription: {
    default: 'Total Spend',
    editor: {
      group: 'Amount',
      type: 'textarea',
      label: 'Amount Description',
    },
  },
};

export const thumbnail = SpendCountPreview;

export const padding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
