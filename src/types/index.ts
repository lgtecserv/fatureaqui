// ============================================================
// FatureAqui — TypeScript Type Definitions
// ============================================================

// Document Types
export type DocumentType = 'VD' | 'FT' | 'RC' | 'NC' | 'ND' | 'CT' | 'GR';

export type DocumentStatus = 'rascunho' | 'emitido' | 'pago' | 'pendente' | 'cancelado';

export type ItemType = 'produto' | 'servico';

export type DiscountType = 'percentagem' | 'valor';

export type PaymentMethod = 'numerario' | 'mpesa' | 'emola' | 'transferencia';

export type Currency = 'MZN' | 'USD' | 'EUR' | 'ZAR';

export type Language = 'pt' | 'en';

export type Theme = 'light' | 'dark';

// Document type labels
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  VD: 'Venda a Dinheiro',
  FT: 'Fatura',
  RC: 'Recibo',
  NC: 'Nota de Crédito',
  ND: 'Nota de Débito',
  CT: 'Cotação',
  GR: 'Guia de Remessa',
};

export const DOCUMENT_TYPE_PREFIXES: Record<DocumentType, string> = {
  VD: 'VD',
  FT: 'FT',
  RC: 'RC',
  NC: 'NC',
  ND: 'ND',
  CT: 'CT',
  GR: 'GR',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  numerario: 'Numerário',
  mpesa: 'M-Pesa',
  emola: 'e-Mola',
  transferencia: 'Transferência Bancária',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  MZN: 'MZN - Metical Moçambicano',
  USD: 'USD - Dólar Americano',
  EUR: 'EUR - Euro',
  ZAR: 'ZAR - Rand Sul-Africano',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  MZN: 'MT',
  USD: '$',
  EUR: '€',
  ZAR: 'R',
};

// Company
export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  nuit: string;
  address: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  website: string | null;
  primary_color: string;
  secondary_color: string;
  signature_url: string | null;
  stamp_url: string | null;
  currency: Currency;
  created_at: string;
  updated_at: string;
}

// Document Item
export interface DocumentItem {
  id: string;
  document_id?: string;
  type: ItemType;
  description: string;
  quantity: number;
  unit_price: number;
  iva_rate: number;
  discount_type: DiscountType;
  discount_value: number;
  line_total: number;
  order_index: number;
}

// Document
export interface Document {
  id: string;
  company_id: string;
  type: DocumentType;
  number: string;
  sequence: number;
  year: number;
  status: DocumentStatus;
  date: string;
  time: string;
  // Client
  client_name: string;
  client_company: string | null;
  client_nuit: string;
  client_phone: string;
  client_email: string;
  client_address: string;
  // Totals
  subtotal: number;
  total_discount: number;
  total_iva: number;
  total: number;
  // Common
  observations: string | null;
  payment_terms: string | null;
  payment_method: PaymentMethod | null;
  // VD specific
  amount_received: number | null;
  change: number | null;
  // FT specific
  due_date: string | null;
  payment_deadline: string | null;
  expected_payment: string | null;
  // RC specific
  invoice_number: string | null;
  invoice_date: string | null;
  amount_paid: number | null;
  payment_date: string | null;
  // NC/ND specific
  reference_invoice: string | null;
  reference_date: string | null;
  reason: string | null;
  adjustment_value: number | null;
  // CT specific
  validity: string | null;
  delivery_deadline: string | null;
  commercial_terms: string | null;
  // GR specific
  origin: string | null;
  destination: string | null;
  driver: string | null;
  vehicle_plate: string | null;
  expected_delivery: string | null;
  // Meta
  created_at: string;
  updated_at: string;
  // Relations
  items?: DocumentItem[];
}

// Document Counter
export interface DocumentCounter {
  id: string;
  company_id: string;
  doc_type: DocumentType;
  year: number;
  last_sequence: number;
}

// Form state for creating/editing a document
export interface DocumentFormState {
  type: DocumentType;
  client_name: string;
  client_company: string;
  client_nuit: string;
  client_phone: string;
  client_email: string;
  client_address: string;
  items: DocumentItemFormState[];
  observations: string;
  payment_terms: string;
  payment_method: PaymentMethod | '';
  // VD
  amount_received: string;
  // FT
  due_date: string;
  payment_deadline: string;
  expected_payment: string;
  // RC
  invoice_number: string;
  invoice_date: string;
  amount_paid: string;
  payment_date: string;
  // NC/ND
  reference_invoice: string;
  reference_date: string;
  reason: string;
  adjustment_value: string;
  // CT
  validity: string;
  delivery_deadline: string;
  commercial_terms: string;
  // GR
  origin: string;
  destination: string;
  driver: string;
  vehicle_plate: string;
  expected_delivery: string;
}

export interface DocumentItemFormState {
  id: string;
  type: ItemType;
  description: string;
  quantity: string;
  unit_price: string;
  discount_type: DiscountType;
  discount_value: string;
}

// Dashboard stats
export interface DashboardStats {
  total_documents: number;
  documents_by_type: Record<DocumentType, number>;
  pending_invoices: number;
  monthly_total: number;
  recent_documents: Document[];
  monthly_data: { month: string; total: number }[];
}
