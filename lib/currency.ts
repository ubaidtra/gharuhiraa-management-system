export function formatCurrency(amount: number): string {
  return `D${amount.toFixed(2)}`;
}

export const CURRENCY_SYMBOL = "D";
export const CURRENCY_CODE = "GMD";
