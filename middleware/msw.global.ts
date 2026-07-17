export default defineNuxtRouteMiddleware((to, from) => {
  const entering = to.path.includes('/campaign-builder');
  const leaving = from.path?.includes('/campaign-builder') && !entering;

  if (entering || leaving) {
    $fetch('/api/__msw', { method: 'POST', body: { enable: entering } });
  }
});
