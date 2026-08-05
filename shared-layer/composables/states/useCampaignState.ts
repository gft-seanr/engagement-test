export function useCampaignState() {
  return useState('campaign', () => ({
    id: '',
    programId: '',
    isRedemptionOpen: false,
    isRedemptionClosed: false,
    isRegistrationOpen: false,
    isRegistrationClosed: false,
    isUnderMaintenance: false,
  }));
}
