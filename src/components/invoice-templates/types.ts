import type { Company, DocumentType, DocumentItemFormState } from "@/types";
import type { InvoiceLanguage } from "@/lib/invoice-translations";

export interface TemplateProps {
  language?: InvoiceLanguage;
  company: Company | null;
  client: any;
  documentData: {
    type: DocumentType;
    date: string;
    reference_invoice?: string;
    reference_date?: string;
    reason?: string;
    origin?: string;
    destination?: string;
    driver?: string;
    vehicle_plate?: string;
    observations?: string;
    number?: string;
  };
  items: DocumentItemFormState[];
  calculations: {
    subtotal: number;
    totalDiscount: number;
    totalIva: number;
    totalIspc: number;
    total: number;
  };
  hasIva?: boolean;
  ivaRate: number;
  hasIspc?: boolean;
  ispcRate?: number;
  id?: string;
}
