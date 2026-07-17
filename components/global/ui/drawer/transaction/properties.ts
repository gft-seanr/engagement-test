import DrawerPreview from '~admin/components/builder/preview/DrawerPreview.vue';

export const category = 'widgets';

export const properties = {
  title: {
    default: 'Drawer Title',
    editor: {
      label: 'Title',
      type: 'text',
    },
  },
  description: {
    default: 'This is a description for the drawer.',
    editor: {
      label: 'Description',
      type: 'textarea',
    },
  },
  label: {
    default: 'Open Drawer',
    editor: {
      label: 'Button Label',
      type: 'text',
    },
  },
  prefixIcon: {
    default: 'lucide:menu',
    editor: {
      group: 'Icons',
      label: 'Prefix Icon',
      type: 'icon-picker',
    },
  },
  suffixIcon: {
    default: '',
    editor: {
      group: 'Icons',
      label: 'Suffix Icon',
      type: 'icon-picker',
    },
  },
};

export const thumbnail = DrawerPreview;
