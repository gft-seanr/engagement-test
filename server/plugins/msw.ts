import { server } from '~admin/mocks/node';

const STAGING_HOSTNAME = 'gentle-river-06010fb10-admin.centralus.6.azurestaticapps.net';

export default defineNitroPlugin((nitroApp) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isStaging =
    process.env.NITRO_HOST === STAGING_HOSTNAME || process.env.URL?.includes(STAGING_HOSTNAME);

  if (!isDev && !isStaging) {
    console.log('[MSW Server] Skipping - not in dev or staging');
    return;
  }

  console.log('[MSW Server] ✅ Ready (not started — awaiting route activation)');
});
