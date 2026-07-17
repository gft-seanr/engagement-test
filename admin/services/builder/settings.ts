export async function checkAffiliate(payload: { subdomain: string; campaignId: string }) {
  const { data } = await http.get(`/api/admin/check-affiliate?subdomain=${payload.subdomain}`, {
    params: {
      campaignId: payload.campaignId,
    },
  });

  return data;
}

export async function getCampaigns(campaignId?: string) {
  const { data } = await http.get('/api/admin/programs/', {
    params: {
      campaignId,
    },
  });

  return data;
}

export async function createCampaign(payload: any) {
  const registration = { scheduleType: 5322, ...payload.registration };
  const redemption = { scheduleType: 5324, ...payload.redemption };

  const bodyData = {
    subdomain: payload.affiliate,
    name: payload.name,
    description: payload.description,
    comment: payload.comment,
    schedules: [registration, redemption],
  };

  const { data } = await http.post(
    `/api/admin/programs/?campaignId=${payload.campaignId}`,
    bodyData
  );

  return data;
}

export async function getSchemaSettings(campaignId: string) {
  const { data } = await http.get(`/api/ui-settings?id=${campaignId}`);

  return data;
}
