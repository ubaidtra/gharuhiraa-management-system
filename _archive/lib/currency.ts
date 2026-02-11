/**
 * Currency formatting utility
 * Format: Gambian Dalasi (GMD)
 * Symbol: D
 */

export function formatCurrency(amount: number): string {
  return `D${amount.toFixed(2)}`;
}

export const CURRENCY_SYMBOL = "D";
export const CURRENCY_NAME = "Gambian Dalasi";
export const CURRENCY_CODE = "GMD";

