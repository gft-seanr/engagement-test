import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';
import HeroCenteredPreview from '~/admin/components/builder/preview/HeroCenteredPreview.vue';

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
  icon: {
    default: 'lucide:info',
    editor: {
      group: 'Icon',
      label: 'Icon',
      type: 'icon-picker',
      required: false,
    },
  },
  title: {
    default: 'Sample Heading',
    editor: {
      label: 'Title',
      type: 'text',
    },
  },
  description: {
    default: 'Lorem ipsum dolor sit amet, description text.',
    editor: {
      label: 'Description',
      type: 'textarea',
    },
  },
  iconSize: {
    default: 64,
    editor: {
      group: 'Icon',
      label: 'Icon Size (px)',
      type: 'number',
      min: 16,
      max: 128,
    },
  },
  variant: {
    default: 'info',
    editor: {
      group: 'Icon',
      label: 'Color Variant',
      type: 'select', // Drop Down Type
      options: ['info', 'success', 'warning', 'error'],
    },
  },
  alert: {
    default: {
      type: 'warning',
      title: 'Nested Alert Title',
      description: 'This is an alert.',
    },
    editor: {
      group: 'Alert',
      label: 'Inner Alert Config',
      type: 'object',
      children: {
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

export const thumbnail = HeroCenteredPreview;

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
