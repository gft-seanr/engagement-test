export default defineAppConfig({
  engagementAdmin: {
    campaigns: [
      {
        id: '6052E148-F9DD-4254-9441-FCC7E765A247',
        name: 'Engagement Admin',
        to: '/admin/{{id}}/ge-admin/', // Where to go after onLoginRedirect
        auth: {
          tokenKey: 'otpAccessToken', // Will be checked if exists in store for middleware
          onLoginRedirect: '/admin/{{id}}/verify', // Needs OTP first after login
        },
        projects: [
          {
            id: 1,
            name: 'Campaign Builder',
            description:
              'For building campaigns using a visual editor, which generates JSON in the background',
            to: '/admin/{{id}}/ge-admin/campaign-builder',
            thumbnail: '/builder.png',
            navigations: {
              General: [
                {
                  id: 'dashboard',
                  label: 'Dashboard',
                  icon: 'gauge',
                  to: '/admin/{{id}}/ge-admin/campaign-builder',
                },
              ],
            },
          },
          {
            id: 2,
            name: 'Campaign JSON Editor',
            description: 'For editing campaigns purely using JSON',
            to: '/admin/{{id}}/ge-admin/campaign-editor',
            thumbnail: '/editor.png',
          },
          // {
          //   id: 3,
          //   name: 'UnionBank Promo Wallet Parser',
          //   description: 'For parsing UnionBank promo wallet excel sheet',
          //   to: '/admin/{{id}}/ge-admin/ub-promo-wallet-parser',
          //   thumbnail: '/builder.png',
          // },
        ],
        routePrefix: '/ge-admin', // Folder for this campaign
      },
      {
        id: 'ddd407cc-69ae-48eb-a5e7-e8c3dc7e3c1e',
        name: 'Spam Admin',
        to: '/admin/{{id}}/spam-club/dashboard', // Final destination
        auth: {
          tokenKey: 'otpAccessToken',
          onLoginRedirect: '/admin/{{id}}/verify', // Needs OTP first after login
        },
        projects: [],
        routePrefix: '/spam-club',
      },
    ],
  },
});
