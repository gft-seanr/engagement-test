/**
 * Centralized list of  components that need to be preloaded
 * for offline functionality and improved performance
 */

const alertComponents = [
  'AlertCard',
  'AlertHeroCentered',
  // Add other alert components as needed
];

export function preloadAlertComponents() {
  preloadComponents(alertComponents);

  return {
    alertComponents,
  };
}
