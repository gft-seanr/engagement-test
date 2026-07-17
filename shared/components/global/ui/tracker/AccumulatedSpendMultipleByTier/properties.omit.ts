import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const category = 'tracking';

export const properties = {
  currentTier: {
    default: 1,
    editor: {
      label: 'Current Tier',
      type: 'number',
      group: 'Progress',
      min: 0,
      step: 1,
      unit: 'Tier',
    },
  },

  reward: {
    default: { link: 'https://example.com/claim' },
    editor: {
      group: 'Rewards',
      label: 'Active Reward Payload',
      type: 'object',
      children: {
        link: {
          label: 'Claim Link',
          type: 'text',
        },
      },
    },
  },
  mappedRewards: {
    default: [
      {
        tier: 1,
        title: 'Bronze Member',
        description: 'Unlock basic perks and 5% discount.',
      },
      {
        tier: 2,
        title: 'Silver Member',
        description: 'Free shipping and 10% discount on all orders.',
      },
      {
        tier: 3,
        title: 'Gold Member',
        description: 'VIP access, concierge service, and 20% off.',
      },
    ],
    editor: {
      group: 'Rewards',
      label: 'Reward Tiers',
      type: 'array',
      itemSchema: {
        tier: {
          type: 'number',
          label: 'Tier Index',
          default: 1,
        },
        title: {
          type: 'text',
          label: 'Title',
          default: 'New Reward',
        },
        description: {
          type: 'textarea',
          label: 'Description',
          default: '',
        },
      },
    },
  },
};

export const thumbnail = CardPreview;
