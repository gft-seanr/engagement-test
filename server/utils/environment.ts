export async function getEnvironmentInfo(event?: any) {
  let host = getHeader(event, 'host');

  const isStaging = host?.includes('localhost') || host?.includes('azurewebsites.net');

  const apiUrls = {
    staging: 'https://recode-engagement-staging.azurewebsites.net/api',
    production: 'https://gateway.gftwy.com/engagement',
  };

  const apiUrl = isStaging ? apiUrls.staging : apiUrls.production;

  return {
    isStaging,
    apiUrl,
    host,
  };
}
