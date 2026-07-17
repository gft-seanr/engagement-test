import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';
import CarouselPreview from '~/admin/components/builder/preview/CarouselPreview.vue';

export const category = 'media';

export const properties = {
  items: {
    default: [
      {
        id: 'item-1',
        title: 'Item 1',
        description: 'Description for Item 1',
      },
      {
        id: 'item-2',
        title: 'Item 2',
        description: 'Description for Item 2',
      },
    ],
    editor: {
      group: 'Carousel Items',
      type: 'array',
      label: 'Items List',
      itemSchema: {
        type: {
          label: 'Alert Type',
          type: 'select',
          options: ['info', 'success', 'warning', 'error'],
        },
        id: {
          label: 'ID',
          type: 'text',
          default: '',
        },
        title: {
          label: 'Title',
          type: 'text',
          default: '',
        },
        description: {
          label: 'Description',
          type: 'textarea',
          default: '',
        },
        details: {
          label: 'Details',
          type: 'textarea',
          default: '',
        },
        footer: {
          label: 'Footer',
          type: 'textarea',
          default: '',
        },
      },
    },
  },
  dialog: {
    default: {
      title: 'Dialog Title',
      description: 'This is the dialog description.',
      tabs: [
        { id: 'tab-1', title: 'Tab 1' },
        { id: 'tab-2', title: 'Tab 2' },
      ],
    },
    editor: {
      group: 'Dialog Configuration',
      label: 'Dialog Content',
      type: 'object',
      children: {
        title: { label: 'Dialog Title', type: 'text', default: 'Dialog Title' },
        description: {
          label: 'Dialog Description',
          type: 'textarea',
          default: 'This is the dialog description.',
        },
        tabs: {
          label: 'Dialog Tabs',
          type: 'array',
          itemSchema: {
            id: { label: 'Tab ID', type: 'text', default: 'tab-1' },
            title: { label: 'Tab Title', type: 'text', default: 'Tab 1' },
          },
        },
      },
    },
  },
};

export const thumbnail = CarouselPreview;

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
