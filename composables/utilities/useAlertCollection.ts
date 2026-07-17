export function useAlertCollection(...alertRefs: ComputedRef<Alert[]>[]) {
  const combinedAlerts = computed(() => {
    const allAlerts: Alert[] = [];

    for (const alertRef of alertRefs) {
      if (alertRef.value?.length) {
        allAlerts.push(...alertRef.value);
      }
    }

    return allAlerts.length > 0 ? allAlerts : [GENERAL_ALERT['InternalServerError']];
  });

  const hasAlerts = computed(() => {
    return alertRefs.some((alertRef) => alertRef.value?.length > 0);
  });

  return {
    alerts: combinedAlerts,
    hasAlerts,
  };
}
