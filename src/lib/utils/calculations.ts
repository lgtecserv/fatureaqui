// ============================================================
// FatureAqui — Calculation Utilities
// ============================================================

import { DocumentItemFormState, DiscountType } from '@/types';

const IVA_RATE = 0.16; // 16% fixed

/**
 * Calculate line total for a document item
 */
export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  discountType: DiscountType,
  discountValue: number
): { baseAmount: number; discountAmount: number; ivaAmount: number; lineTotal: number } {
  const baseAmount = quantity * unitPrice;

  let discountAmount = 0;
  if (discountType === 'percentagem') {
    discountAmount = baseAmount * (discountValue / 100);
  } else {
    discountAmount = discountValue;
  }

  const afterDiscount = baseAmount - discountAmount;
  const ivaAmount = afterDiscount * IVA_RATE;
  const lineTotal = afterDiscount + ivaAmount;

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    ivaAmount: Math.round(ivaAmount * 100) / 100,
    lineTotal: Math.round(lineTotal * 100) / 100,
  };
}

/**
 * Calculate document totals from all items
 */
export function calculateDocumentTotals(items: DocumentItemFormState[]): {
  subtotal: number;
  totalDiscount: number;
  totalIva: number;
  total: number;
} {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalIva = 0;

  for (const item of items) {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    const discountVal = parseFloat(item.discount_value) || 0;

    const result = calculateLineTotal(qty, price, item.discount_type, discountVal);
    subtotal += result.baseAmount;
    totalDiscount += result.discountAmount;
    totalIva += result.ivaAmount;
  }

  const total = subtotal - totalDiscount + totalIva;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    totalIva: Math.round(totalIva * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate change for VD (Venda a Dinheiro)
 */
export function calculateChange(amountReceived: number, total: number): number {
  return Math.round((amountReceived - total) * 100) / 100;
}

/**
 * Get item line total from form state
 */
export function getItemLineTotal(item: DocumentItemFormState): number {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.unit_price) || 0;
  const discountVal = parseFloat(item.discount_value) || 0;

  const result = calculateLineTotal(qty, price, item.discount_type, discountVal);
  return result.lineTotal;
}
