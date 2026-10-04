import { capitalize, discountPercent, formatPrice } from './format';

describe('format utils', () => {
  it('formats prices as USD', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50');
  });

  it('capitalizes the first letter', () => {
    expect(capitalize('women')).toBe('Women');
    expect(capitalize('')).toBe('');
  });

  it('calculates discount percentages', () => {
    expect(discountPercent(150, 135)).toBe(10);
    expect(discountPercent(100, 100)).toBe(0);
    expect(discountPercent(0, 0)).toBe(0);
  });
});
