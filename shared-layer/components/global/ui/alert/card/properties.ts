import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const category = 'alerts';

export const properties = {
  state: {
    root: true,
    default: '',
    editor: {
      label: 'State',
      type: 'state-select',
    },
  },
  alerts: {
    default: [
      {
        type: 'warning',
        title: 'Nested Alert Title',
        description: 'This is an alert inside the card.',
      },
    ],
    editor: {
      group: 'Alerts',
      label: 'Alerts List',
      type: 'array',
      // itemSchema represents the fields for ONE object inside the array
      itemSchema: {
        type: {
          label: 'Alert Type',
          type: 'select',
          default: 'warning',
          options: ['info', 'success', 'warning', 'error'],
        },
        title: {
          label: 'Alert Title',
          type: 'text',
          default: '',
        },
        description: {
          label: 'Alert Description',
          type: 'textarea',
          default: '',
        },
      },
    },
  },
};

export const thumbnail = CardPreview;

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
