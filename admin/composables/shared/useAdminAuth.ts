import { useAppConfig, navigateTo } from '#imports';

export function useAdminAuth(currentProjectId: string) {
  const appConfig = useAppConfig();

  const projectConfig = appConfig.engagementAdmin.campaigns.find(
    (p: any) => p.id?.toLowerCase() === currentProjectId?.toLowerCase()
  );

  const handleLoginSuccess = (loginData: any) => {
    if (!projectConfig) {
      alert('Invalid campaign ID');
      return;
    }

    const authConfig = projectConfig.auth;

    const targetRoute = authConfig.onLoginRedirect.replace('{{id}}', currentProjectId);

    navigateTo(targetRoute);
  };

  function getResolvedRoute() {
    if (!projectConfig || !projectConfig.to) return `/admin/${currentProjectId}`;
    return projectConfig.to.replace('{{id}}', projectConfig.id);
  }

  const handleVerifySuccess = (verifyData: any) => {
    const targetRoute = getResolvedRoute();

    navigateTo(targetRoute);
  };

  return { projectConfig, handleLoginSuccess, handleVerifySuccess };
}
