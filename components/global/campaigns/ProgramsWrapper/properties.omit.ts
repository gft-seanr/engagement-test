// Work In Progress

export const properties = {
  alert: {
    default: {
      map: {},
    },
    editor: {
      group: 'Alert',
      label: 'Alert',
      type: 'alert-map',
    },
  },
  programs: {
    default: [],
    editor: {
      group: 'Programs',
      label: 'Programs',
      type: 'array',
      itemSchema: {
        type: {
          label: 'Program Type',
          type: 'number',
        },
        status: {
          label: 'Program Status',
          type: 'select',
          default: 'available',
          options: ['available', 'completed', 'in-progress', 'expired'],
        },
        title: {
          label: 'Program Title',
          type: 'text',
        },
        drawerTitle: {
          label: 'Drawer Title',
          type: 'text',
        },
        description: {
          label: 'Program Description',
          type: 'text',
        },
        iconUrl: {
          label: 'Icon URL',
          type: 'text',
        },
        progress: {},
      },
    },
  },
};
