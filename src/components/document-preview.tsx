import type { Company, DocumentType, DocumentItemFormState, InvoiceTemplateId } from "@/types";
import type { InvoiceLanguage } from "@/lib/invoice-translations";
import { TemplateClassic } from "./invoice-templates/template-classic";
import { TemplateCorporate } from "./invoice-templates/template-corporate";
import { TemplateModern } from "./invoice-templates/template-modern";
import { TemplateGeometric } from "./invoice-templates/template-geometric";
import { TemplateBoutique } from "./invoice-templates/template-boutique";

export interface DocumentPreviewProps {
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
  template?: InvoiceTemplateId;
}

export function DocumentPreview(props: DocumentPreviewProps) {
  const activeTemplate: InvoiceTemplateId = props.template || props.company?.invoice_template || "classic";

  switch (activeTemplate) {
    case "corporate":
      return <TemplateCorporate {...props} />;
    case "modern":
      return <TemplateModern {...props} />;
    case "geometric":
      return <TemplateGeometric {...props} />;
    case "boutique":
      return <TemplateBoutique {...props} />;
    case "classic":
    default:
      return <TemplateClassic {...props} />;
  }
}
