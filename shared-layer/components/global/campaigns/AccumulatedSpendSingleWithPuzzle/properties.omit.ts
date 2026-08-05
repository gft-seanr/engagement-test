// Select:
//  By Group = Set key +
//  Plain = Array of reward items
export const properties = {
  rewards: {
    default: {},
    editor: {},
  },
  puzzleItems: {
    default: {
      url: '',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      order: 0,
      isVisible: true,
    },
    editor: {
      group: 'Puzzle',
      label: 'Puzzle Items',
      type: 'array',
      itemSchema: {
        url: {
          label: 'Image URL',
          type: 'string',
        },
        width: {
          label: 'Width',
          type: 'number',
        },
        height: {
          label: 'Height',
          type: 'number',
        },
        x: {
          label: 'X Position',
          type: 'number',
        },
        y: {
          label: 'Y Position',
          type: 'number',
        },
        order: {
          label: 'Order',
          type: 'number',
        },
        isVisible: {
          label: 'Is Visible',
          type: 'boolean',
        },
      },
    },
  },
  emptyPuzzleItem: {
    default: '',
    editor: {
      group: 'Puzzle',
      label: 'Empty Puzzle Item',
      type: 'string',
    },
  },
  completePuzzleUrl: {
    default: '',
    editor: {
      group: 'Puzzle',
      label: 'Complete Puzzle URL',
      type: 'string',
    },
  },
};

//   rewards: Record<string, Record<string, RewardItem>>;

//   interface RewardItem {
//     tier: number;
//     type: RewardType;
//     value: number;
//     denominationId: number;
//     merchantId: number;
//     rewardName: string;
//     rewardDescription?: string;
//     rewardImageUrl?: string;
//     rewardIconUrl?: string;
//     merchantName?: string;
//     merchantImageUrl?: string;
//     merchantIconUrl?: string;
//     targetTitle?: string;
//     targetDescription?: string;
//     targetImageUrl?: string;
//     targetIconUrl?: string;
//     claimTitle?: string;
//     claimDescription?: string;
//     claimIconUrl?: string;
//     claimImageUrl?: string;
//     cardTypeId?: string;
//     programId?: string;
//   }
