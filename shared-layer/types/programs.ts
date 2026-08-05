declare global {
  interface ProgramParams {
    id: string;
    programId?: string;
  }

  interface Program {
    programId: string;
    name: string;
    campaignId: string;
    ordinalPosition: string;
    programTypeId: ProgramTypeId;
    parentProgramId: number;
    description: string;
    programStatusId: string;
    progress: ProgressState;
    isRegistered: boolean;
  }

  interface UserInfo {
    accountNo: string;
    cardType: string;
    last4: string;
    group: string;
  }

  interface ProgramData {
    programs: Program[];
    user: UserInfo;
  }

  interface ProgressState {
    type: ProgressType;
    tier: number;
    current: number;
    target: number;
  }

  // Todo: Add interface for program error
  type ProgramErrorCode = 'ProgramNotFound';

  interface ProgramError extends BaseError<ProgramErrorCode> {}

  interface ProgramResponse extends BaseResponse<ProgramData, ProgramError> {}

  interface ProgramInfoParams {
    id: string;
    programId: string;
  }

  interface ProgramInfoData extends Program {}

  interface ProgramInfoResponse extends BaseResponse<ProgramInfoData, ProgramError> {}

  // Program Config
  type ProgramTypeId = '5305' | '5306'; // Accumulated Spend | Frequency Spend

  type ProgramStatus = 'available' | 'completed' | 'in-progress' | 'expired';

  type RewardType = 'gift' | 'points' | 'cashback'; // 'discount' | 'product';

  interface ProgramColors {
    '--primary': string;
    '--primary-soft': string;
    '--primary-dark': string;
    '--primary-dark-soft': string;
    '--secondary': string;
    '--secondary-soft': string;
    '--secondary-dark': string;
    '--secondary-dark-soft': string;
  }

  // Progress items (flat array, no grouping, [tier1, tier2, ...])
  interface ProgressItem {
    tier: number;
    current: number;
    target: number;
    title?: string;
    description?: string;
    hasRedemption?: boolean;
  }

  type ProgressType = 'count' | 'value';

  type BaseProgress = ProgressItem[]; // [tier1, tier2]

  // Multiple progress items per group { "no": [tier1, tier2], "low": [tier1] }
  type GroupedProgress = Record<string, BaseProgress>;

  type ProgramProgress = BaseProgress | GroupedProgress;

  interface TargetItem {
    targetId: string;
    ordinalPosition: number;
    tier: number;
    name: string;
    description: string;
    progress: ProgressState;
  }

  type BaseTarget = TargetItem[];

  // Reward
  interface RewardItem {
    tier: number;
    type: RewardType;
    value: number;
    denominationId: number;
    merchantId: number;
    rewardName: string;
    rewardDescription?: string;
    rewardImageUrl?: string;
    rewardIconUrl?: string;
    merchantName?: string;
    merchantImageUrl?: string;
    merchantIconUrl?: string;
    targetTitle?: string;
    targetDescription?: string;
    targetImageUrl?: string;
    targetIconUrl?: string;
    claimTitle?: string;
    claimDescription?: string;
    claimIconUrl?: string;
    claimImageUrl?: string;
    cardTypeId?: string;
    programId?: string;
  }

  // Multiple rewards (flat array)
  type BaseReward = RewardItem[];

  // Rewards by group { "visa": [reward1, reward2], "mastercard": [reward3] }
  type GroupedReward = Record<string, BaseReward>;

  type ProgramReward = BaseReward | GroupedReward;

  // Currency
  interface ProgramCurrency {
    prefix: string;
    suffix: string;
  }

  // Label and Unit
  interface ProgramLabel {
    current: string | string[]; // Spend
    target: string | string[]; // Required Spend
    remaining: string | string[]; // Spend to go
  }

  interface ProgramUnit {
    currency: ProgramCurrency;
    label: ProgramLabel;
  }

  interface ProgramDetail {
    title: string;
    description: string;
  }

  /**
   * UI configuration and display settings for a program
   */
  interface ProgramConfig extends Omit<Program, 'progress'> {
    type: ProgramTypeId;
    status: ProgramStatus;

    // Basic Info
    title: string;
    drawerTitle: string;
    description: string;
    shortDescription?: string;

    // Display
    iconUrl: string;
    colors: ProgramColors;

    // Progress & Requirements
    progress: ProgramProgress;
    rewards: ProgramReward;

    // UI Configuration
    unit: ProgramUnit;

    // Additional Content
    details: ProgramDetail[];

    // Component
    component: string;
  }
}
export type {};

// export type {
//   ProgramParams,
//   ProgramResponse,
//   Program,
//   ProgramData,
//   ProgramConfig,
//   RewardType,
//   ProgramColors,
//   ProgramProgress,
// };
