export const getMockTokens = (): TokenResponse => ({
  isSuccessful: true,
  errors: null,
  timestamp: new Date().toISOString(),
  data: {
    tokens: [
      {
        tokenId: 'mock_token_1',
        tier: 1,
        statusId: 43,
        link: 'r/mock-token',
        availableDateTime: new Date().toISOString(),
        expiryDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        referenceNo: 'REF-00001',
        tokenTypeId: 1,
        value: 500,
        valueType: 1,
      },
    ],
    totalCount: 1,
  },
});

export const getMockTransactions = () => ({
  isSuccessful: true,
  errors: [],
  timestamp: new Date().toISOString(),

  data: {
    totalCount: 2,
    transactions: [
      {
        description: 'Store Purchase - Manila',
        transactionDateTime: new Date().toISOString(),
        amount: 1500.5,
        referenceNo: 'TXN-00001234',
      },
      {
        description: 'Online Reward Redemption',

        transactionDateTime: new Date(Date.now() - 86400000).toISOString(),
        amount: 500.0,
        referenceNo: 'TXN-00005678',
      },
    ],
  },
});

export const getMockProgramInfo = () => ({
  isSuccessful: true,
  errors: [],
  timestamp: new Date().toISOString(),
  data: {
    id: '1',
    name: 'Mock Campaign',
    description: 'This is a mock campaign for testing purposes.',
    imageUrl: 'https://via.placeholder.com/150',
    iconUrl: 'https://via.placeholder.com/50',
    cardTypeId: 'card-type-1',
  },
});

export const getMockUiSettings = (): SettingsResponse => ({
  isSuccessful: true,
  errors: null,
  timestamp: new Date().toISOString(),
  data: {
    execution: 'client',
    pageHead: {
      title: 'Mock Campaign | Giftaway',
    },
    pages: {},
    theme: {
      colors: {},
    },
    schedule: {
      registration: {
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      redemption: {
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
});

export const getMockProgramInfoQuery = (): ProgramInfoResponse => ({
  isSuccessful: true,
  errors: null,
  timestamp: new Date().toISOString(),
  data: {
    programId: 'prog-123-abc',
    name: 'Mock Frequency Program',
    campaignId: 'mock-campaign',
    ordinalPosition: '1',
    programTypeId: '5306', // Frequency Spend
    parentProgramId: 0,
    description: 'Complete 5 purchases to unlock your reward.',
    programStatusId: 'active',
    // tier: 1 must match the tier in the component's `progress` prop (BaseProgress array)
    // current >= target puts the component in "unclaimed" state (active token at tier 1)
    progress: {
      type: 'count',
      tier: 1,
      current: 5,
      target: 5,
    },
    isRegistered: true,
  },
});
