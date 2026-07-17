// Campaign ID to landing page mapping
export const CAMPAIGN_LANDING_PAGES = {
  'ddd407cc-69ae-48eb-a5e7-e8c3dc7e3c1e': '/spam-club/dashboard',
  // Add more campaign IDs and their corresponding landing pages here
} as const;

// Get the landing page for a campaign ID
export function getLandingPageByCampaignId(campaignId: string): string | null {
  return CAMPAIGN_LANDING_PAGES[campaignId as keyof typeof CAMPAIGN_LANDING_PAGES] || null;
}

// Get the full route for a campaign ID (including the campaign ID parameter)
export function getFullRouteByCampaignId(campaignId: string): string | null {
  const landingPage = getLandingPageByCampaignId(campaignId);
  if (!landingPage) return null;

  return `/admin/${campaignId}${landingPage}`;
}
