import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DocumentPreview } from "@/components/document-preview";
import { exportElementToPdf, printInvoiceElement } from "@/lib/pdf-export";
import { Download, Printer, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/types";

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  company: Company | null;
}

export function InvoiceViewModal({ isOpen, onClose, documentId, company }: InvoiceViewModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["document_detail", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (docError) throw docError;

      const { data: items, error: itemsError } = await supabase
        .from("document_items")
        .select("*")
        .eq("document_id", documentId)
        .order("order_index", { ascending: true });

      if (itemsError) throw itemsError;

      return { doc, items: items || [] };
    },
    enabled: !!documentId && isOpen,
  });

  if (!isOpen || !documentId) return null;

  const doc = data?.doc;
  const items = data?.items || [];

  const handleDownload = async () => {
    const el = document.getElementById("modal-pdf-content");
    if (!el) {
      toast.error("Elemento para PDF não encontrado");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("A gerar PDF em alta resolução...");
    try {
      const fileName = (doc?.number || "fatura").replace(/\//g, "-");
      await exportElementToPdf(el, `${fileName}.pdf`);
      toast.dismiss(toastId);
      toast.success("Download do PDF concluído com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error(err.message || "Erro ao gerar PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("modal-pdf-content");
    if (el) {
      printInvoiceElement(el, doc?.number || "Fatura");
    }
  };

  const documentData = {
    type: doc?.type || "FT",
    date: doc?.date || "",
    number: doc?.number || "",
    reference_invoice: doc?.reference_invoice || undefined,
    reference_date: doc?.reference_date || undefined,
    reason: doc?.reason || undefined,
    origin: doc?.origin || undefined,
    destination: doc?.destination || undefined,
    driver: doc?.driver || undefined,
    vehicle_plate: doc?.vehicle_plate || undefined,
    observations: doc?.observations || undefined,
  };

  const clientData = {
    name: doc?.client_name || "Consumidor Final",
    company_name: doc?.client_company || undefined,
    nuit: doc?.client_nuit || "",
    phone: doc?.client_phone || "",
    email: doc?.client_email || "",
    address: doc?.client_address || "",
  };

  const formattedItems = items.map((item: any) => ({
    id: item.id,
    type: item.type || "produto",
    description: item.description,
    quantity: item.quantity?.toString() || "1",
    unit_price: item.unit_price?.toString() || "0",
    discount_type: item.discount_type || "percentagem",
    discount_value: item.discount_value?.toString() || "0",
  }));

  const calculations = {
    subtotal: doc?.subtotal || 0,
    totalDiscount: doc?.total_discount || 0,
    totalIva: doc?.total_iva || 0,
    totalIspc: doc?.total_ispc || 0,
    total: doc?.total || 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:px-6">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <span>{doc?.number || "A carregar documento..."}</span>
              {doc?.type && (
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  {doc.type}
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {doc?.date ? `Emitido em ${doc.date} para ${doc.client_name}` : "A carregar dados..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isLoading}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:bg-muted transition disabled:opacity-50"
              title="Imprimir Documento"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || isExporting}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              title="Baixar em PDF"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>Baixar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/20 flex justify-center items-start">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">A carregar detalhes da fatura...</p>
            </div>
          ) : (
            <div className="scale-90 sm:scale-100 origin-top shadow-xl rounded-lg overflow-hidden bg-white">
              <DocumentPreview
                id="modal-pdf-content"
                company={company}
                client={clientData}
                documentData={documentData}
                items={formattedItems}
                calculations={calculations}
                hasIva={doc?.has_iva ?? true}
                ivaRate={doc?.iva_rate ?? 16}
                hasIspc={doc?.has_ispc ?? false}
                ispcRate={doc?.ispc_rate ?? 3}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
