// ============================================================
// FatureAqui — Formatting Utilities
// ============================================================

import { Currency, CURRENCY_SYMBOLS } from '@/types';

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency: Currency = 'MZN'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} ${symbol}`;
}

/**
 * Format a date string to locale format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format time string
 */
export function formatTime(timeString?: string): string {
  if (!timeString) {
    return new Intl.DateTimeFormat('pt-MZ', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
  return timeString;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('pt-MZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `+258 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Generate a UUID v4
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
