export const DEFAULT_REDEEM_ALERT: AlertMap<RedeemTokenErrorCode> = {
  AlreadyRedeemed: {
    type: 'error',
    title: 'Already Redeemed',
    description:
      'The promo code you entered has already been redeemed. Please check the code and try again.',
  },
  TokenNotFound: {
    type: 'error',
    title: 'Redemption Unsuccessful',
    description: 'Please double check the promo code and try again.',
  },
  WeeklyLimitReached: {
    type: 'error',
    title: 'Weekly Redemption Limit Reached',
    description:
      "You've reached the maximum number of redemptions allowed this week. Please try again next week.",
  },
  DailyLimitReached: {
    type: 'error',
    title: 'Daily Redemption Limit Reached',
    description:
      "You've reached the maximum number of redemptions allowed today. Please try again tomorrow.",
  },
  Expired: {
    type: 'error',
    title: 'Promo Code Expired',
    description: 'This promo code is no longer valid.',
  },
  Successful: {
    type: 'success',
    title: 'Redemption Successful',
    description: 'Your promo code has been successfully redeemed.',
  },
  MODEL_ERROR: {
    type: 'error',
    title: 'Model Error',
    description: 'Something went wrong. Please try again later.',
  },
};
