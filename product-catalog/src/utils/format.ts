const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value: number): string => currency.format(value);

export const capitalize = (text: string): string =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/** Percentage saved between the original and the discounted price (rounded). */
export function discountPercent(original: number, discounted: number): number {
  if (!original || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}
