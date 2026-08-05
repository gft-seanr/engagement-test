import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const properties = {
  programId: {
    default: '',
    editor: {
      label: 'Program ID',
      type: 'text',
    },
  },
  unit: {
    default: {
      currency: 'PHP',
      label: {
        current: 'Spend',
        target: 'Required Spend',
        remaining: 'Spend to go',
      },
    },
  },
  editor: {
    label: 'Progress Unit',
    type: 'object',
    children: {
      currency: { type: 'text', label: 'Currency' },
      label: {
        type: 'object',
        label: 'Label',
        children: {
          current: { type: 'text', label: 'Current Label' },
          target: { type: 'text', label: 'Target Label' },
          remaining: { type: 'text', label: 'Remaining Label' },
        },
      },
    },
  },
  progress: {
    default: {
      groupId: 1,
      target: 100,
    },
    editor: {
      group: 'Progress',
      label: 'Progress Config',
      type: 'object',
      children: {
        groupId: { type: 'number', label: 'Progress Group ID' },
        target: { type: 'number', label: 'Target Value' },
      },
    },
  },
  rewards: {
    default: {
      groupId: 1,
      name: 'Reward Name',
    },
    editor: {
      group: 'Rewards',
      label: 'Reward Config',
      type: 'object',
      children: {
        groupId: { type: 'number', label: 'Reward Group ID' },
        name: { type: 'text', label: 'Display Name' },
      },
    },
  },
  actionLabel: {
    default: {
      'in-progress': 'Locked',
      unclaimed: 'Claim Now',
      claimed: 'Completed',
      expired: 'Ended',
    },
    editor: {
      group: 'Button Labels',
      label: 'Button Labels',
      type: 'object',
      children: {
        'in-progress': { type: 'text', label: 'In Progress Label' },
        unclaimed: { type: 'text', label: 'Unclaimed Label' },
        claimed: { type: 'text', label: 'Claimed Label' },
        expired: { type: 'text', label: 'Expired Label' },
      },
    },
  },
};

export const thumbnail = CardPreview;
