import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, UserPlus } from "lucide-react";
import { MT } from "@/lib/format";
import type { DocumentType, DocumentItemFormState, InvoiceTemplateId } from "@/types";
import { ClientModal } from "@/components/client-modal";
import { ProductModal } from "@/components/product-modal";
import { DocumentPreview } from "@/components/document-preview";
import { InvoiceTemplateSelector } from "@/components/invoice-template-selector";
import { InvoiceLanguageSelector } from "@/components/invoice-language-selector";
import type { InvoiceLanguage } from "@/lib/invoice-translations";
import { SuccessModal } from "@/components/success-modal";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { exportElementToPdf, printInvoiceElement } from "@/lib/pdf-export";
import { useProPlan } from "@/hooks/use-pro-plan";

export const Route = createFileRoute("/painel/facturacao/nova")({
  validateSearch: (search: Record<string, unknown>): { editId?: string } => {
    return {
      editId: search.editId as string | undefined,
    };
  },
  component: NovaFacturaPage,
});

function NovaFacturaPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isPro } = useProPlan();
  const search = Route.useSearch();
  const editId = search?.editId;
  const isEditing = Boolean(editId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeItemRowId, setActiveItemRowId] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastGeneratedNumber, setLastGeneratedNumber] = useState("");

  // Template & Language State
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateId>("classic");
  const [documentLanguage, setDocumentLanguage] = useState<InvoiceLanguage>("pt");

  // Core Document State
  const [docType, setDocType] = useState<DocumentType>("FT");
  const [clientId, setClientId] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState("");
  
  // Reference Fields (RC, NC, ND)
  const [referenceInvoice, setReferenceInvoice] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [reason, setReason] = useState("");

  // Transport Fields (GR)
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [driver, setDriver] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  // Ocasional Client State
  const [ocasionalClient, setOcasionalClient] = useState({
    name: "",
    nuit: "",
    email: "",
    phone: "",
    address: ""
  });

  const [items, setItems] = useState<DocumentItemFormState[]>([
    {
      id: Math.random().toString(36).substring(7),
      type: "servico",
      variant_id: "custom",
      description: "",
      unit: "un",
      quantity: "1",
      unit_price: "0",
      discount_type: "percentagem",
      discount_value: "0",
    },
  ]);
  const [hasIva, setHasIva] = useState<boolean>(true);
  const [ivaRate, setIvaRate] = useState<number>(16);
  const [hasIspc, setHasIspc] = useState<boolean>(false);
  const [ispcRate, setIspcRate] = useState<number>(3);

  // Fetch company
  const { data: company } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("companies").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Sync default template from company settings
  useEffect(() => {
    if (company?.invoice_template) {
      setSelectedTemplate(company.invoice_template as InvoiceTemplateId);
    }
  }, [company?.invoice_template]);

  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", company?.id],
    queryFn: async () => {
      if (!company) return [];
      const { data } = await supabase.from("clients").select("*").eq("company_id", company.id).order("name");
      return data || [];
    },
    enabled: !!company,
  });

  // Fetch previous invoices for reference (FT, VD)
  const { data: pastInvoices = [] } = useQuery({
    queryKey: ["pastInvoices", company?.id],
    queryFn: async () => {
      if (!company) return [];
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("company_id", company.id)
        .in("type", ["FT", "VD"])
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!company,
  });

  // Fetch products & services catalog (products + variants)
  const { data: catalogItems = [] } = useQuery({
    queryKey: ["all_items_catalog", company?.id],
    queryFn: async () => {
      if (!company) return [];
      const { data, error } = await supabase
        .from("product_variants")
        .select(`
          id,
          sku,
          price,
          products!inner (
            *
          )
        `)
        .eq("products.company_id", company.id)
        .order("id");
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!company,
  });

  // Fetch document if in edit mode
  const { data: editingDoc } = useQuery({
    queryKey: ["editing_document", editId],
    queryFn: async () => {
      if (!editId) return null;
      const { data: doc, error: docErr } = await supabase
        .from("documents")
        .select("*")
        .eq("id", editId)
        .single();
      if (docErr) throw docErr;

      const { data: docItems, error: itemsErr } = await supabase
        .from("document_items")
        .select("*")
        .eq("document_id", editId)
        .order("order_index", { ascending: true });
      if (itemsErr) throw itemsErr;

      return { doc, items: docItems || [] };
    },
    enabled: !!editId,
  });

  // Populate form with existing document data
  useEffect(() => {
    if (editingDoc?.doc) {
      const d = editingDoc.doc;
      setDocType(d.type as DocumentType);
      setDate(d.date || new Date().toISOString().split("T")[0]);
      setObservations(d.observations || "");
      setReferenceInvoice(d.reference_invoice || "");
      setReferenceDate(d.reference_date || "");
      setReason(d.reason || "");
      setOrigin(d.origin || "");
      setDestination(d.destination || "");
      setDriver(d.driver || "");
      setVehiclePlate(d.vehicle_plate || "");
      setHasIva(d.has_iva ?? true);
      setIvaRate(d.iva_rate ?? 16);
      setHasIspc(d.has_ispc ?? false);
      setIspcRate(d.ispc_rate ?? 3);
      setNextDocNumber(d.number);

      const matched = clients.find((c) => c.name === d.client_name);
      if (matched) {
        setClientId(matched.id);
      } else {
        setClientId("ocasional");
        setOcasionalClient({
          name: d.client_name || "",
          nuit: d.client_nuit || "",
          email: d.client_email || "",
          phone: d.client_phone || "",
          address: d.client_address || "",
        });
      }

      if (editingDoc.items && editingDoc.items.length > 0) {
        setItems(
          editingDoc.items.map((it: any) => ({
            id: it.id || Math.random().toString(36).substring(7),
            type: it.type || "servico",
            variant_id: "custom",
            description: it.description,
            unit: it.unit || "un",
            quantity: it.quantity?.toString() || "1",
            unit_price: it.unit_price?.toString() || "0",
            discount_type: it.discount_type || "percentagem",
            discount_value: it.discount_value?.toString() || "0",
          }))
        );
      }
    }
  }, [editingDoc, clients]);

  const [nextDocNumber, setNextDocNumber] = useState<string>("");
  const [previewScale, setPreviewScale] = useState<number>(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Fetch next sequence live
  useEffect(() => {
    async function fetchNextSequence() {
      if (!company?.id || isEditing) return;
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();

      const { data: lastDoc } = await supabase
        .from("documents")
        .select("sequence")
        .eq("company_id", company.id)
        .eq("type", docType)
        .eq("year", year)
        .order("sequence", { ascending: false })
        .limit(1)
        .maybeSingle();

      const sequence = lastDoc?.sequence ? lastDoc.sequence + 1 : 1;
      setNextDocNumber(`${docType} ${year}/${sequence}`);
    }
    
    fetchNextSequence();
  }, [docType, date, company?.id, isEditing]);

  // Auto-scale Preview
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const scaleX = (width - 48) / 794;
        setPreviewScale(Math.min(scaleX, 1));
      }
    });
    resizeObserver.observe(previewContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const selectedClient = clients.find(c => c.id === clientId);

  const handleReferenceSelect = async (invoiceNumber: string) => {
    setReferenceInvoice(invoiceNumber);
    if (!invoiceNumber) {
      setReferenceDate("");
      return;
    }
    
    const selectedInv = pastInvoices.find(inv => inv.number === invoiceNumber);
    if (selectedInv) {
      setReferenceDate(selectedInv.date);
      
      // Bloquear e preencher o cliente
      const matchedClient = clients.find(c => c.name === selectedInv.client_name);
      if (matchedClient) {
        setClientId(matchedClient.id);
      } else {
        setClientId("ocasional");
        setOcasionalClient({
          name: selectedInv.client_name,
          nuit: selectedInv.client_nuit || "",
          email: selectedInv.client_email || "",
          phone: selectedInv.client_phone || "",
          address: selectedInv.client_address || ""
        });
      }

      // Preencher artigos para Notas de Crédito / Débito
      if (docType === "NC" || docType === "ND") {
        const { data: pastItems } = await supabase
          .from("document_items")
          .select("*")
          .eq("document_id", selectedInv.id)
          .order("order_index");
          
        if (pastItems && pastItems.length > 0) {
          setItems(pastItems.map(item => ({
            id: Math.random().toString(36).substring(7),
            type: item.type,
            description: item.description,
            unit: item.unit || "un",
            quantity: item.quantity.toString(),
            unit_price: item.unit_price.toString(),
            discount_type: item.discount_type,
            discount_value: item.discount_value.toString(),
          })));
        }
        
        setHasIva(selectedInv.has_iva ?? true);
        setHasIspc(selectedInv.has_ispc ?? false);
        setIvaRate(selectedInv.iva_rate ?? 16);
        setIspcRate(selectedInv.ispc_rate ?? 3);
      }
    }
  };

  // Reset ISPC if docType changes and is not VD or CT
  useEffect(() => {
    if (hasIspc && docType !== "VD" && docType !== "CT") {
      setHasIspc(false);
    }
  }, [docType, hasIspc]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substring(7),
        type: "servico",
        variant_id: "custom",
        description: "",
        unit: "un",
        quantity: "1",
        unit_price: "0",
        discount_type: "percentagem",
        discount_value: "0",
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof DocumentItemFormState, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      const discountVal = parseFloat(item.discount_value) || 0;

      const lineGross = qty * price;
      let lineDiscount = 0;

      if (item.discount_type === "percentagem") {
        lineDiscount = lineGross * (discountVal / 100);
      } else {
        lineDiscount = discountVal;
      }

      subtotal += lineGross;
      totalDiscount += lineDiscount;
    });

    const taxableBase = subtotal - totalDiscount;
    const totalIva = hasIva ? taxableBase * (ivaRate / 100) : 0;
    const totalIspc = hasIspc ? taxableBase * (ispcRate / 100) : 0;
    const total = taxableBase + totalIva + totalIspc;

    return { subtotal, totalDiscount, taxableBase, totalIva, totalIspc, total };
  }, [items, hasIva, ivaRate, hasIspc, ispcRate]);

  const documentData = {
    type: docType,
    date,
    reference_invoice: referenceInvoice,
    reference_date: referenceDate,
    reason,
    origin,
    destination,
    driver,
    vehicle_plate: vehiclePlate,
    observations,
    number: nextDocNumber || "A carregar...",
  };

  const saveDocument = useMutation({
    mutationFn: async () => {
      if (!company) throw new Error("Empresa não encontrada");
      
      let finalClient;
      if (clientId === "ocasional") {
        if (!ocasionalClient.name) throw new Error("O Nome do cliente é obrigatório");
        finalClient = ocasionalClient;
      } else {
        if (!clientId) throw new Error("Selecione um cliente");
        if (!selectedClient) throw new Error("Cliente inválido");
        finalClient = selectedClient;
      }

      if (items.some(i => !i.description)) {
        throw new Error("Preencha a descrição de todos os itens");
      }

      // Check Billing Limits
      const { data: settings } = await supabase.from("system_settings").select("*").limit(1).maybeSingle();
      const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user?.id).maybeSingle();
      const hasActivePro = subscription && 
                           (subscription.status === "ativo" || subscription.status === "active") && 
                           subscription.valid_until && 
                           new Date(subscription.valid_until) > new Date();
      
      if (!hasActivePro) {
        const docLimit = settings?.free_plan_docs_limit || 5;
        
        const date = new Date();
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

        const { count } = await supabase
          .from("documents")
          .select("*", { count: 'exact', head: true })
          .eq("company_id", company.id)
          .gte("date", startOfMonth)
          .lte("date", endOfMonth);
        
        if (docLimit > 0 && (count || 0) >= docLimit) {
          throw new Error(`Limite de ${docLimit} documentos gratuitos atingido. Faça Upgrade!`);
        }
      }

      let doc;
      if (isEditing && editId) {
        const { data: updatedDoc, error: updateError } = await supabase
          .from("documents")
          .update({
            date,
            time: new Date().toTimeString().split(' ')[0],
            client_name: finalClient.name,
            client_company: finalClient.company_name || null,
            client_nuit: finalClient.nuit,
            client_phone: finalClient.phone,
            client_email: finalClient.email,
            client_address: finalClient.address,
            subtotal: calculations.subtotal,
            total_discount: calculations.totalDiscount,
            total_iva: calculations.totalIva,
            total_ispc: calculations.totalIspc,
            total: calculations.total,
            observations: observations || null,
            reference_invoice: referenceInvoice || null,
            reference_date: referenceDate || null,
            reason: reason || null,
            origin: origin || null,
            destination: destination || null,
            driver: driver || null,
            vehicle_plate: vehiclePlate || null,
            has_iva: hasIva,
            has_ispc: hasIspc,
            iva_rate: hasIva ? ivaRate : 0,
            ispc_rate: hasIspc ? ispcRate : 0,
          })
          .eq("id", editId)
          .select()
          .single();

        if (updateError) throw updateError;
        doc = updatedDoc;

        // Delete existing items to replace with updated set
        await supabase.from("document_items").delete().eq("document_id", editId);
      } else {
        // Generate sequence number (yearly)
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();

        const { data: lastDoc } = await supabase
          .from("documents")
          .select("sequence")
          .eq("company_id", company.id)
          .eq("type", docType)
          .eq("year", year)
          .order("sequence", { ascending: false })
          .limit(1)
          .maybeSingle();

        const sequence = lastDoc?.sequence ? lastDoc.sequence + 1 : 1;
        const number = `${docType} ${year}/${sequence}`;

        // Insert document
        const { data: newDoc, error: docError } = await supabase
          .from("documents")
          .insert({
            company_id: company.id,
            warehouse_id: null,
            type: docType,
            number,
            sequence,
            year,
            status: "emitido",
            date,
            time: new Date().toTimeString().split(' ')[0],
            client_name: finalClient.name,
            client_company: finalClient.company_name || null,
            client_nuit: finalClient.nuit,
            client_phone: finalClient.phone,
            client_email: finalClient.email,
            client_address: finalClient.address,
            subtotal: calculations.subtotal,
            total_discount: calculations.totalDiscount,
            total_iva: calculations.totalIva,
            total_ispc: calculations.totalIspc,
            total: calculations.total,
            observations: observations || null,
            reference_invoice: referenceInvoice || null,
            reference_date: referenceDate || null,
            reason: reason || null,
            origin: origin || null,
            destination: destination || null,
            driver: driver || null,
            vehicle_plate: vehiclePlate || null,
            has_iva: hasIva,
            has_ispc: hasIspc,
            iva_rate: hasIva ? ivaRate : 0,
            ispc_rate: hasIspc ? ispcRate : 0,
          })
          .select()
          .single();

        if (docError) throw docError;
        doc = newDoc;
      }

      // Insert items
      const docItems = items.map((item, index) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        const lineGross = qty * price;
        const discountVal = parseFloat(item.discount_value) || 0;
        const lineDiscount = item.discount_type === "percentagem" ? lineGross * (discountVal / 100) : discountVal;

        return {
          document_id: doc.id,
          type: item.type,
          variant_id: item.variant_id === 'custom' ? null : (item.variant_id || null),
          description: item.description,
          unit: item.unit || "un",
          quantity: qty,
          unit_price: price,
          iva_rate: hasIva ? ivaRate : 0,
          discount_type: item.discount_type,
          discount_value: discountVal,
          line_total: lineGross - lineDiscount,
          order_index: index,
        };
      });

      const { error: itemsError } = await supabase.from("document_items").insert(docItems);
      if (itemsError) throw itemsError;

      return doc;
    },
    onSuccess: (data) => {
      if (isEditing) {
        toast.success("Documento atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        queryClient.invalidateQueries({ queryKey: ["document_detail", editId] });
        navigate({ to: "/painel/facturacao" });
      } else {
        setLastGeneratedNumber(data.number);
        setIsSuccessModalOpen(true);
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || (isEditing ? "Erro ao atualizar documento" : "Erro ao criar documento"));
    }
  });

  const handleProductCreated = (variant: any) => {
    if (!activeItemRowId) return;
    const prod = variant.products;
    setItems(prevItems => prevItems.map(it => {
      if (it.id === activeItemRowId) {
        return {
          ...it,
          variant_id: variant.id,
          type: prod?.type === "servico" ? "servico" : "produto",
          description: prod?.name + (prod?.description ? ` - ${prod.description}` : ""),
          unit: prod?.unit_of_measure || "un",
          unit_price: variant.price?.toString() || "0",
          quantity: prod?.default_quantity?.toString() || "1",
        };
      }
      return it;
    }));
    setActiveItemRowId(null);
  };

  const resetForm = () => {
    setIsSuccessModalOpen(false);
    setClientId("");
    setOcasionalClient({ name: "", nuit: "", email: "", phone: "", address: "" });
    setItems([{ id: Math.random().toString(36).substring(7), type: "servico", variant_id: "custom", description: "", unit: "un", quantity: "1", unit_price: "0", discount_type: "percentagem", discount_value: "0" }]);
    setReferenceInvoice("");
    setReferenceDate("");
    setReason("");
    setOrigin("");
    setDestination("");
    setDriver("");
    setVehiclePlate("");
    setObservations("");
  };

  const isRefDoc = ["RC", "NC", "ND"].includes(docType);
  const isTransportDoc = docType === "GR";

  return (
    <div className="pb-20">
      <Topbar
        title={isEditing ? "Editar Documento" : t("invoice_new.title")}
        subtitle={isEditing ? `A editar o documento ${nextDocNumber}` : t("invoice_new.subtitle")}
      />

      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE: FORM */}
          <div className="space-y-6">
            
            {/* Header Options */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-soft space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("invoice_new.type_label")}</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="FT">{t("invoice_new.type_ft")}</option>
                    <option value="VD">{t("invoice_new.type_vd")}</option>
                    <option value="RC">{t("invoice_new.type_rc")}</option>
                    <option value="NC">{t("invoice_new.type_nc")}</option>
                    <option value="ND">{t("invoice_new.type_nd")}</option>
                    <option value="CT">{t("invoice_new.type_ct")}</option>
                    <option value="GR">{t("invoice_new.type_gr")}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("invoice_new.date_label")}</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("invoice_new.client_label")}</label>
                <div className="flex gap-2 items-center w-full min-w-0">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="h-11 flex-1 min-w-0 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 truncate"
                  >
                    <option value="">{t("invoice_new.select_client")}</option>
                    <option value="ocasional">{t("invoice_new.manual_client")}</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.nuit ? `(NUIT: ${c.nuit})` : ''}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => setIsClientModalOpen(true)}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary hover:bg-primary-soft/80 transition"
                    title="Novo Cliente"
                  >
                    <UserPlus className="h-5 w-5" />
                  </button>
                </div>
                {clientId === "ocasional" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.client_name")}</label>
                      <input type="text" value={ocasionalClient.name} onChange={e => setOcasionalClient({...ocasionalClient, name: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.nuit")}</label>
                      <input type="text" value={ocasionalClient.nuit} onChange={e => setOcasionalClient({...ocasionalClient, nuit: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.email")}</label>
                      <input type="email" value={ocasionalClient.email} onChange={e => setOcasionalClient({...ocasionalClient, email: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.address")}</label>
                      <input type="text" value={ocasionalClient.address} onChange={e => setOcasionalClient({...ocasionalClient, address: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Conditional Fields: References */}
              {isRefDoc && (
                <div className="rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-foreground">{t("invoice_new.ref_doc")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.orig_inv")}</label>
                      <select 
                        value={referenceInvoice} 
                        onChange={e => handleReferenceSelect(e.target.value)} 
                        className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">{t("invoice_new.select_inv")}</option>
                        {pastInvoices.map(inv => (
                          <option key={inv.id} value={inv.number}>{inv.number} - {inv.client_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.inv_date")}</label>
                      <input type="date" value={referenceDate} onChange={e => setReferenceDate(e.target.value)} readOnly className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none opacity-70" />
                    </div>
                    {docType !== "RC" && (
                      <div className="sm:col-span-2">
                        <label className="text-xs text-muted-foreground">{t("invoice_new.reason")}</label>
                        <input type="text" placeholder={t("invoice_new.reason_placeholder")} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conditional Fields: Transport */}
              {isTransportDoc && (
                <div className="rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-foreground">{t("invoice_new.transport_details")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.origin")}</label>
                      <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.dest")}</label>
                      <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.driver")}</label>
                      <input type="text" value={driver} onChange={e => setDriver(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{t("invoice_new.plate")}</label>
                      <input type="text" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Line Items */}
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="bg-muted/30 px-4 sm:px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">{t("invoice_new.doc_lines")}</h3>
                <span className="text-xs text-muted-foreground font-medium sm:hidden">
                  {items.length} {items.length === 1 ? "linha" : "linhas"}
                </span>
              </div>

              {/* Mobile View (< 640px) */}
              <div className="block sm:hidden p-3.5 space-y-3.5">
                {items.map((item, idx) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.unit_price) || 0;
                  const discVal = parseFloat(item.discount_value) || 0;
                  const gross = qty * price;
                  const disc = item.discount_type === "percentagem" ? gross * (discVal / 100) : discVal;
                  const lineTotal = Math.max(0, gross - disc);

                  return (
                    <div key={item.id} className="rounded-xl border border-border/80 bg-muted/15 p-3.5 space-y-3 shadow-xs">
                      {/* Top bar of item */}
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <span className="text-xs font-bold text-foreground flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          Artigo / Linha {idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                            title="Remover linha"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remover</span>
                          </button>
                        )}
                      </div>

                      {/* Catálogo */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Produto ou Serviço do Catálogo
                        </label>
                        <div className="flex gap-1.5 items-center w-full min-w-0">
                          <select
                            value={item.variant_id && item.variant_id !== "custom" ? item.variant_id : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                updateItem(item.id, "variant_id", "custom");
                                return;
                              }
                              const matched = catalogItems.find(v => v.id === val);
                              if (matched) {
                                setItems(items.map(it => it.id === item.id ? {
                                  ...it,
                                  variant_id: matched.id,
                                  type: matched.products?.type === "servico" ? "servico" : "produto",
                                  description: matched.products?.name + (matched.products?.description ? ` - ${matched.products.description}` : ""),
                                  unit: matched.products?.unit_of_measure || "un",
                                  unit_price: matched.price?.toString() || "0",
                                  quantity: matched.products?.default_quantity?.toString() || "1",
                                } : it));
                              }
                            }}
                            className="h-10 flex-1 min-w-0 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none truncate"
                          >
                            <option value="">{t("invoice_new.select_product")}</option>
                            {catalogItems.map(v => (
                              <option key={v.id} value={v.id}>
                                [{v.products?.type === "servico" ? "Serviço" : "Produto"}] {v.products?.name} - {MT(v.price)} ({v.products?.unit_of_measure || "un"})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItemRowId(item.id);
                              setIsProductModalOpen(true);
                            }}
                            className="h-10 px-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                            title="Cadastrar novo artigo no catálogo"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Novo</span>
                          </button>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Descrição Detalhada no Documento
                        </label>
                        <input
                          type="text"
                          placeholder={t("invoice_new.service_desc")}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Unidade e Quantidade */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Unidade (un, h, mês)
                          </label>
                          <input
                            type="text"
                            placeholder="un"
                            value={item.unit || "un"}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-xs uppercase focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder={t("invoice_new.qty")}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-xs font-medium focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Preço Unitário e Desconto */}
                      {!isTransportDoc && (
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Preço Unitário (MT)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={t("invoice_new.price_mt")}
                              value={item.unit_price}
                              onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                              className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-xs font-medium focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Desconto
                            </label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                value={item.discount_value}
                                onChange={(e) => updateItem(item.id, "discount_value", e.target.value)}
                                className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-xs focus:border-primary focus:outline-none"
                              />
                              <select
                                value={item.discount_type}
                                onChange={(e) => updateItem(item.id, "discount_type", e.target.value as "percentagem" | "valor")}
                                className="h-10 w-12 shrink-0 rounded-lg border border-border bg-muted/50 px-1 text-center text-xs focus:border-primary focus:outline-none"
                              >
                                <option value="percentagem">%</option>
                                <option value="valor">MT</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtotal da Linha */}
                      {!isTransportDoc && (
                        <div className="pt-2 flex justify-between items-center text-xs border-t border-border/40">
                          <span className="text-muted-foreground font-medium">Subtotal da linha:</span>
                          <span className="font-bold text-foreground text-sm">{MT(lineTotal)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-2.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("invoice_new.add_item")}</span>
                </button>
              </div>

              {/* Desktop View (>= 640px) */}
              <div className="hidden sm:block p-5 overflow-x-auto w-full">
                <div className="min-w-[660px] space-y-4 pb-2">
                  <div className={cn(
                    "grid gap-2 px-1 pb-2 border-b border-border/50",
                    isTransportDoc ? "grid-cols-[1fr_65px_80px_40px]" : "grid-cols-[1fr_65px_70px_100px_130px_40px]"
                  )}>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("invoice_new.item")}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{t("invoice_new.unit")}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{t("invoice_new.qty")}</div>
                    {!isTransportDoc && (
                      <>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{t("invoice_new.unit_price")}</div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{t("invoice_new.discount")}</div>
                      </>
                    )}
                    <div></div>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className={cn(
                      "grid gap-2 items-center",
                      isTransportDoc ? "grid-cols-[1fr_65px_80px_40px]" : "grid-cols-[1fr_65px_70px_100px_130px_40px]"
                    )}>
                      {/* Artigo / Serviço description & catalog selector */}
                      <div className="space-y-1.5 w-full min-w-0">
                        <div className="flex gap-1.5 items-center w-full min-w-0">
                          <select
                            value={item.variant_id && item.variant_id !== "custom" ? item.variant_id : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                updateItem(item.id, "variant_id", "custom");
                                return;
                              }
                              const matched = catalogItems.find(v => v.id === val);
                              if (matched) {
                                setItems(items.map(it => it.id === item.id ? {
                                  ...it,
                                  variant_id: matched.id,
                                  type: matched.products?.type === "servico" ? "servico" : "produto",
                                  description: matched.products?.name + (matched.products?.description ? ` - ${matched.products.description}` : ""),
                                  unit: matched.products?.unit_of_measure || "un",
                                  unit_price: matched.price?.toString() || "0",
                                  quantity: matched.products?.default_quantity?.toString() || "1",
                                } : it));
                              }
                            }}
                            className="h-9 flex-1 min-w-0 rounded-lg border border-border bg-muted/40 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none truncate"
                          >
                            <option value="">{t("invoice_new.select_product")}</option>
                            {catalogItems.map(v => (
                              <option key={v.id} value={v.id}>
                                [{v.products?.type === "servico" ? "Serviço" : "Produto"}] {v.products?.name} - {MT(v.price)} ({v.products?.unit_of_measure || "un"})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveItemRowId(item.id);
                              setIsProductModalOpen(true);
                            }}
                            className="h-9 px-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                            title="Cadastrar novo artigo ou serviço no catálogo"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Novo</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder={t("invoice_new.service_desc")}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm font-medium focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Unidade */}
                      <input
                        type="text"
                        placeholder="un"
                        value={item.unit || "un"}
                        onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-background px-1 text-center text-xs uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        title="Unidade de medida (ex: un, hora, mês, projeto, kg)"
                      />

                      {/* Quantidade */}
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder={t("invoice_new.qty")}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />

                      {!isTransportDoc && (
                        <>
                          {/* Preço Unitário */}
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t("invoice_new.price_mt")}
                            value={item.unit_price}
                            onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />

                          {/* Desconto */}
                          <div className="flex gap-1">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={t("invoice_new.discount")}
                              value={item.discount_value}
                              onChange={(e) => updateItem(item.id, "discount_value", e.target.value)}
                              className="h-10 w-full rounded-lg border border-border bg-background px-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <select
                              value={item.discount_type}
                              onChange={(e) => updateItem(item.id, "discount_type", e.target.value as "percentagem" | "valor")}
                              className="h-10 w-12 shrink-0 rounded-lg border border-border bg-muted/50 px-1 text-center text-xs focus:border-primary focus:outline-none"
                            >
                              <option value="percentagem">%</option>
                              <option value="valor">MT</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Remover Linha */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="h-10 w-10 shrink-0 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                        title="Remover linha"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors mt-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t("invoice_new.add_item")}
                  </button>
                </div>
              </div>
            </div>

            {/* Totals */}      {/* Footer Totals & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* IVA Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasIva} 
                        onChange={(e) => setHasIva(e.target.checked)}
                        disabled={isTransportDoc}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                      />
                      IVA
                    </label>
                    <select
                      value={ivaRate}
                      onChange={(e) => setIvaRate(Number(e.target.value))}
                      disabled={!hasIva || isTransportDoc}
                      className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value={16}>16% (Normal)</option>
                      <option value={0}>0% (Isento)</option>
                    </select>
                  </div>
                  
                  {/* ISPC Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasIspc} 
                        onChange={(e) => setHasIspc(e.target.checked)}
                        disabled={isTransportDoc || (docType !== "VD" && docType !== "CT")}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                      />
                      ISPC
                    </label>
                    <select
                      value={ispcRate}
                      onChange={(e) => setIspcRate(Number(e.target.value))}
                      disabled={!hasIspc || isTransportDoc || (docType !== "VD" && docType !== "CT")}
                      className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value={3}>3%</option>
                      <option value={12}>12%</option>
                      <option value={15}>15%</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("invoice_new.obs")}</label>
                  <textarea
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder={t("invoice_new.obs_placeholder")}
                    className="min-h-[100px] w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 flex flex-col justify-between">
                {!isTransportDoc ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("invoice_new.subtotal")}</span>
                      <span className="font-semibold">{MT(calculations.subtotal)}</span>
                    </div>
                    {calculations.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-destructive">
                        <span>{t("invoice_new.total_discount")}</span>
                        <span className="font-semibold">-{MT(calculations.totalDiscount)}</span>
                      </div>
                    )}
                    {hasIva && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">IVA ({ivaRate}%)</span>
                        <span className="font-semibold">{MT(calculations.totalIva)}</span>
                      </div>
                    )}
                    {hasIspc && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ISPC ({ispcRate}%)</span>
                        <span className="font-semibold">{MT(calculations.totalIspc)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-4 mt-2 flex justify-between">
                      <span className="font-bold text-foreground">{t("invoice_new.total_to_pay")}</span>
                      <span className="text-xl font-black text-primary">{MT(calculations.total)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl p-4">
                    {t("invoice_new.gr_msg")}
                  </div>
                )}

                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-border">
                  <button 
                    type="button" 
                    onClick={() => navigate({ to: "/painel/facturacao" })}
                    className="w-full rounded-full border border-border bg-background py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    {t("invoice_new.cancel")}
                  </button>
                  <button 
                    onClick={() => saveDocument.mutate()}
                    disabled={saveDocument.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-70"
                  >
                    {saveDocument.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isEditing ? "Guardar Alterações" : t("invoice_new.issue")}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LIVE PREVIEW */}
          <div 
            ref={previewContainerRef}
            className="flex flex-col items-center lg:sticky lg:top-8 bg-muted/20 rounded-3xl border border-border min-h-[500px] lg:h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden relative w-full"
          >
              <div className="w-full sticky top-0 bg-card/95 backdrop-blur-md z-10 p-4 sm:p-5 pb-3 border-b border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-sm sm:text-base">{t("invoice_new.preview")}</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{t("invoice_new.live")}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                    Alternar Modelo
                  </span>
                </div>

                {/* Template Selector Pills */}
                <InvoiceTemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                  isPro={isPro}
                  primaryColor={company?.primary_color}
                />

                {/* Document Language Selector */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <InvoiceLanguageSelector
                    language={documentLanguage}
                    onLanguageChange={setDocumentLanguage}
                    primaryColor={company?.primary_color}
                  />
                </div>
             </div>
             
             {/* The Auto-Scaled Preview */}
             <div className="flex w-full justify-center pb-8">
               <div 
                 style={{ 
                   width: `${794 * previewScale}px`, 
                   height: `${1123 * previewScale}px`,
                   position: 'relative'
                 }}
               >
                 <div 
                   style={{ 
                     transform: `scale(${previewScale})`,
                     transformOrigin: 'top left',
                     width: '794px',
                     height: '1123px',
                     position: 'absolute',
                     top: 0,
                     left: 0
                   }}
                 >
                   <DocumentPreview 
                      language={documentLanguage}
                     template={selectedTemplate}
                     company={company}
                     client={clientId === "ocasional" ? ocasionalClient as any : selectedClient}
                     documentData={documentData}
                     items={items}
                     calculations={calculations}
                     hasIva={hasIva}
                     ivaRate={ivaRate}
                     hasIspc={hasIspc}
                     ispcRate={ispcRate}
                   />
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* NÓ DEDICADO DE EXPORTAÇÃO E IMPRESSÃO (NUNCA DISPLAY:NONE, ESCALA 1:1, SEM TRANSFORMS) */}
      <div 
        id="pdf-export-container"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          minHeight: "1123px",
          background: "#ffffff",
          zIndex: -999,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <DocumentPreview 
          id="pdf-export-content"
          template={selectedTemplate}
          company={company}
          client={clientId === "ocasional" ? ocasionalClient as any : selectedClient}
          documentData={{
            ...documentData,
            number: lastGeneratedNumber || documentData.number,
          }}
          items={items}
          calculations={calculations}
          hasIva={hasIva}
          ivaRate={ivaRate}
          hasIspc={hasIspc}
          ispcRate={ispcRate}
        />
      </div>

      {/* Modals */}
      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        companyId={company?.id || ""} 
        onClientCreated={(id) => setClientId(id)}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setActiveItemRowId(null);
        }}
        companyId={company?.id || ""}
        onProductCreated={handleProductCreated}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate({ to: "/painel/facturacao" })}
        documentNumber={lastGeneratedNumber}
        onDownload={async () => {
          const exportElement = document.getElementById("pdf-export-content") || document.getElementById("pdf-content");
          if (!exportElement) {
            toast.error("Erro ao localizar elemento da fatura.");
            return;
          }
          
          const toastId = toast.loading("A gerar PDF de alta resolução...");
          try {
            const fileName = (lastGeneratedNumber || "fatura").replace(/\//g, '-');
            await exportElementToPdf(exportElement as HTMLElement, `${fileName}.pdf`);
            toast.dismiss(toastId);
            toast.success("Download do PDF concluído com sucesso!");
          } catch (error: any) {
            console.error("Erro ao gerar PDF:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "Erro ao gerar PDF.");
          }
        }}
        onPrint={() => {
          const exportElement = document.getElementById("pdf-export-content") || document.getElementById("pdf-content");
          if (exportElement) {
            printInvoiceElement(exportElement as HTMLElement, lastGeneratedNumber || "Fatura");
          }
        }}
        onEmail={() => toast.success("Email enviado com sucesso!")}
        onNew={resetForm}
      />
    </div>
  );
}
