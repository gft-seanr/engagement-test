/**
 * Formats a number to a shorter representation with k/M suffixes
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string (e.g., "500k", "1.2M")
 */
export function useShortNumberFormat() {
  const formatToShortNumber = (value: number | string, decimals: number = 0): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '0';

    // Handle negative numbers
    const isNegative = num < 0;
    const absoluteNum = Math.abs(num);

    let result: string;

    if (absoluteNum >= 1_000_000) {
      // Million
      result = (absoluteNum / 1_000_000).toFixed(decimals) + 'M';
    } else if (absoluteNum >= 1_000) {
      // Thousand
      result = (absoluteNum / 1_000).toFixed(decimals) + 'k';
    } else {
      // Less than 1000, return as is
      result = absoluteNum.toFixed(decimals);
    }

    // Remove unnecessary trailing zeros after decimal
    if (decimals > 0) {
      result = result.replace(/\.?0+$/, '');
    }

    return isNegative ? '-' + result : result;
  };

  const computedShortNumber = (value: Ref<number> | ComputedRef<number>, decimals: number = 0) => {
    return computed(() => formatToShortNumber(value.value, decimals));
  };

  return {
    formatToShortNumber,
    computedShortNumber,
  };
}
