// ============================================================
// FatureAqui — Document Number Generation
// ============================================================

import { DocumentType, DOCUMENT_TYPE_PREFIXES } from '@/types';

/**
 * Generate document number from type, year, and sequence
 * Format: VD 2026/000001
 */
export function generateDocumentNumber(
  type: DocumentType,
  year: number,
  sequence: number
): string {
  const prefix = DOCUMENT_TYPE_PREFIXES[type];
  const paddedSequence = String(sequence).padStart(6, '0');
  return `${prefix} ${year}/${paddedSequence}`;
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
