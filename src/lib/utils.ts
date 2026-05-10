import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | undefined | null, currency = 'USD') {
  const numericPrice = typeof price === 'number' ? price : parseFloat(String(price || 0));
  const safePrice = isNaN(numericPrice) ? 0 : numericPrice;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(safePrice);
}

export function calculatePercentage(partial: number, total: number): number {
  if (!total || isNaN(total) || isNaN(partial)) return 0;
  return (partial / total) * 100;
}

export function safeNumber(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}
