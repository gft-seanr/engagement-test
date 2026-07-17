import DrawerPreview from '~/admin/components/builder/preview/DrawerPreview.vue';

export const category = 'content';

export const properties = {
  triggerIcon: {
    default: 'lucide:info',
    editor: {
      group: 'Trigger',
      label: 'Trigger Icon',
      type: 'icon-picker',
    },
  },
  triggerText: {
    default: 'Trigger Text',
    editor: {
      group: 'Trigger',
      Label: 'Trigger Text',
      type: 'text',
    },
  },
  sheetTitle: {
    default: 'Sheet Title',
    editor: {
      group: 'Sheet',
      label: 'Sheet Title',
      type: 'text',
    },
  },
  sheetContent: {
    default: 'Sheet Content',
    editor: {
      group: 'Sheet',
      label: 'Sheet Content',
      type: 'textarea',
    },
  },

  linkExternal: {
    default: {
      label: 'External Link',
      destination: 'https://example.com',
      prefixIcon: 'lucide:external-link',
      suffixIcon: '',
    },
    editor: {
      group: 'Sheet',
      label: 'External Link',
      type: 'object',
      children: {
        label: {
          label: 'Label',
          type: 'text',
        },
        destination: {
          label: 'Destination URL',
          type: 'text',
        },
        prefixIcon: {
          label: 'Prefix Icon',
          type: 'icon-picker',
        },
        suffixIcon: {
          label: 'Suffix Icon',
          type: 'icon-picker',
        },
      },
    },
  },
};

export const thumbnail = DrawerPreview;
