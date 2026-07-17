export const category = 'tracking';

export const properties = {
  title: {
    default: 'Frequency Spend Single By Tier With Dash Steps',
    editor: {
      label: 'Title',
      type: 'text',
    },
  },
  description: {
    default: 'Description for Frequency Spend Single By Tier With Dash Steps',
    editor: {
      label: 'Description',
      type: 'textarea',
    },
  },
  iconUrl: {
    default: 'https://via.placeholder.com/50',
    editor: {
      label: 'Icon URL',
      type: 'text',
    },
  },
  unit: {
    default: {
      prefix: '₱',
      suffix: '',
    },
    editor: {
      type: 'object',
      children: {
        currency: {
          default: {
            prefix: '₱',
            suffix: '',
          },
          editor: {
            type: 'object',
            children: {
              prefix: {
                default: '₱',
                label: 'Currency Prefix',
                type: 'text',
              },
              suffix: {
                default: '',
                label: 'Currency Suffix',
                type: 'text',
              },
            },
          },
        },
        label: {
          default: {},
          editor: {
            type: 'object',
            children: {
              current: {
                default: 'Spend',
                label: 'Current Label',
                type: 'text',
              },
              target: {
                default: 'Required Spend',
                label: 'Target Label',
                type: 'text',
              },
              remaining: {
                default: 'Spend to go',
                label: 'Remaining Label',
                type: 'text',
              },
            },
          },
        },
      },
    },
  },
  rewards: {
    default: [
      {
        tier: 1,
        type: 'gift',
        value: 100,
        denominationId: 1,
        merchantId: 1,
        rewardName: 'Reward for Tier 1',
        rewardDescription: 'Description for reward at Tier 1',
        rewardImageUrl: 'https://via.placeholder.com/100',
        rewardIconUrl: 'https://via.placeholder.com/50',
        merchantName: 'Merchant for Tier 1',
        merchantImageUrl: 'https://via.placeholder.com/100',
        merchantIconUrl: 'https://via.placeholder.com/50',
        targetTitle: 'Target for Tier 1',
        targetDescription: 'Description for target at Tier 1',
        targetImageUrl: 'https://via.placeholder.com/100',
        targetIconUrl: 'https://via.placeholder.com/50',
        claimTitle: 'Claim for Tier 1',
        claimDescription: 'Description for claim at Tier 1',
        claimIconUrl: 'https://via.placeholder.com/50',
        claimImageUrl: 'https://via.placeholder.com/100',
        cardTypeId: 'card-type-1',
        programId: 'program-1',
      },
    ],
    editor: {
      group: 'Rewards',
      label: 'Rewards',
      type: 'array',
      itemSchema: {
        tier: {
          default: 0,
          label: 'Tier',
          type: 'number',
        },
        type: {
          default: 'gift',
          label: 'Reward Type',
          type: 'select',
          options: ['gift', 'points', 'cashback'],
        },
        value: {
          default: 0,
          label: 'Reward Value',
          type: 'number',
        },
        denominationId: {
          default: 0,
          label: 'Denomination ID',
          type: 'number',
        },
        merchantId: {
          default: 0,
          label: 'Merchant ID',
          type: 'number',
        },
        rewardName: {
          default: '',
          label: 'Reward Name',
          type: 'text',
        },
        rewardDescription: {
          default: '',
          label: 'Reward Description',
          type: 'textarea',
        },
        rewardImageUrl: {
          default: '',
          label: 'Reward Image URL',
          type: 'text',
        },
        rewardIconUrl: {
          default: '',
          label: 'Reward Icon URL',
          type: 'text',
        },
        merchantName: {
          default: '',
          label: 'Merchant Name',
          type: 'text',
        },
        merchantImageUrl: {
          default: '',
          label: 'Merchant Image URL',
          type: 'image-uploader',
        },
        merchantIconUrl: {
          default: '',
          label: 'Merchant Icon URL',
          type: 'icon-picker',
        },
        targetTitle: {
          default: '',
          label: 'Target Title',
          type: 'text',
        },
        targetDescription: {
          default: '',
          label: 'Target Description',
          type: 'textarea',
        },
        targetImageUrl: {
          default: '',
          label: 'Target Image URL',
          type: 'image-uploader',
        },
        targetIconUrl: {
          default: '',
          label: 'Target Icon URL',
          type: 'icon-picker',
        },
        claimTitle: {
          default: '',
          label: 'Claim Title',
          type: 'text',
        },
        claimDescription: {
          default: '',
          label: 'Claim Description',
          type: 'textarea',
        },
        claimIconUrl: {
          default: '',
          label: 'Claim Icon URL',
          type: 'icon-picker',
        },
        claimImageUrl: {
          default: '',
          label: 'Claim Image URL',
          type: 'image-uploader',
        },
        cardTypeId: {
          default: '',
          label: 'Card Type ID',
          type: 'text',
        },
        programId: {
          default: '',
          label: 'Program ID',
          type: 'text',
        },
      },
    },
  },
  progress: {
    default: [
      {
        tier: 1,
        current: 30,
        target: 100,
        title: 'Tier 1 Progress',
        description: 'Description for Tier 1 progress',
        hasRedemption: true,
      },
      {
        tier: 2,
        current: 60,
        target: 200,
        title: 'Tier 2 Progress',
        description: 'Description for Tier 2 progress',
        hasRedemption: true,
      },
    ],
    editor: {
      type: 'array',
      label: 'Progress by Tier',
      group: 'Progress',
      itemSchema: {
        tier: {
          default: 0,
          label: 'Tier',
          type: 'number',
        },
        current: {
          default: 0,
          label: 'Current Progress',
          type: 'number',
        },
        target: {
          default: 0,
          label: 'Target Progress',
          type: 'number',
        },
        title: {
          default: '',
          label: 'Progress Title',
          type: 'text',
        },
        description: {
          default: '',
          label: 'Progress Description',
          type: 'textarea',
        },
        hasRedemption: {
          default: false,
          label: 'Has Redemption',
          type: 'boolean',
        },
      },
    },
  },
  statusLabel: {
    default: {},
    editor: {
      type: 'object',
      children: {
        'in-progress': {
          default: 'Reward Locked',
          label: 'In Progress Label',
          type: 'text',
        },
        unclaimed: {
          default: 'Claim Reward',
          label: 'Unclaimed Label',
          type: 'text',
        },
        claimed: {
          default: 'Open Reward',
          label: 'Claimed Label',
          type: 'text',
        },
        expired: {
          default: 'Expired',
          label: 'Expired Label',
          type: 'text',
        },
        completed: {
          default: 'Complete ✓',
          label: 'Completed Label',
          type: 'text',
        },
      },
    },
  },
};
