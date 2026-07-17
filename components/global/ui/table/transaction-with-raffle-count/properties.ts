import TablePreview from '~/admin/components/builder/preview/TablePreview.vue';

export const category = 'widgets';

export const properties = {
  title: {
    default: 'Transactions',
    editor: {
      type: 'text',
      label: 'Title',
    },
  },
  description: {
    default: 'Description',
    editor: {
      type: 'text',
      label: 'Description',
    },
  },
  emptyMessage: {
    default: 'You have no transactions yet.',
    editor: {
      type: 'textarea',
      label: 'Empty Message',
    },
  },
  itemsPerPage: {
    default: 10,
    editor: {
      type: 'number',
      label: 'Items Per Page',
      unit: 'items',
    },
  },
  additionalReference: {
    default: '',
    editor: {
      type: 'text',
      label: 'Additional Reference',
    },
  },
  raffleCountUnit: {
    default: ['ticket', 'tickets'],

    editor: {
      group: 'Content',
      label: 'Raffle Count Units',
      type: 'array',
      itemSchema: {
        type: 'text',
        label: 'Unit Name (e.g., ticket)',
        default: '',
      },
    },
  },
};

export const thumbnail = TablePreview;
