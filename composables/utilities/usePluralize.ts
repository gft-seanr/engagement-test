// A simple utility to pluralize a word based on a count.
// if unit is an array, the first element is singular and the second is the plural
// providing plural form is good for irregular plurals like "person" -> "people" or "Spend to Go" -> "Spends to Go"
export function usePluralize(count: MaybeRef, unit: MaybeRef<string | string[]>) {
  function pluralize(count: number, unit: string | string[]) {
    if (!unit || (Array.isArray(unit) && unit.length === 0)) {
      return '';
    }

    let singular: string;
    let plural: string | undefined;

    if (Array.isArray(unit)) {
      [singular, plural] = unit;
    } else {
      singular = unit || '';
      plural = '';
    }

    if (!count || count === 1) {
      return singular;
    }

    // If plural form is provided, use it
    if (plural) {
      return plural;
    }

    // Rules
    if (singular.endsWith('y')) {
      return singular.slice(0, -1) + 'ies'; // grocery → groceries
    }

    if (singular.endsWith('s') || singular.endsWith('sh') || singular.endsWith('ch')) {
      return singular + 'es'; // bus → buses
    }

    return singular + 's'; // transaction → transactions
  }

  const value = computed(() => pluralize(unref(count), unref(unit)));

  return value;
}
