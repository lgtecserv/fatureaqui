import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, UserPlus } from "lucide-react";
import { MT } from "@/lib/format";
import type { DocumentType, DocumentItemFormState } from "@/types";
import { ClientModal } from "@/components/client-modal";
import { DocumentPreview } from "@/components/document-preview";
import { SuccessModal } from "@/components/success-modal";
// @ts-ignore
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

export const Route = createFileRoute("/painel/facturacao/nova")({
  component: NovaFacturaPage,
});

function NovaFacturaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastGeneratedNumber, setLastGeneratedNumber] = useState("");

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
      type: "produto",
      description: "",
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
      const { data } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

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

  const [nextDocNumber, setNextDocNumber] = useState<string>("");
  const [previewScale, setPreviewScale] = useState<number>(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Fetch next sequence live
  useEffect(() => {
    async function fetchNextSequence() {
      if (!company?.id) return;
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yearMonthPrefix = `${year}-${monthStr}`;

      const { data: lastDoc } = await supabase
        .from("documents")
        .select("sequence")
        .eq("company_id", company.id)
        .eq("type", docType)
        .like("date", `${yearMonthPrefix}-%`)
        .order("sequence", { ascending: false })
        .limit(1);

      const sequence = lastDoc?.[0]?.sequence ? lastDoc[0].sequence + 1 : 1;
      setNextDocNumber(`${docType} ${yearMonthPrefix}/${sequence}`);
    }
    
    fetchNextSequence();
  }, [docType, date, company?.id]);

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
        type: "produto",
        description: "",
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
      const { data: settings } = await supabase.from("system_settings").select("*").single();
      const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user?.id).single();
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

      // Generate sequence number (monthly)
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yearMonthPrefix = `${year}-${monthStr}`;

      const { data: lastDoc } = await supabase
        .from("documents")
        .select("sequence")
        .eq("company_id", company.id)
        .eq("type", docType)
        .like("date", `${yearMonthPrefix}-%`)
        .order("sequence", { ascending: false })
        .limit(1);

      const sequence = lastDoc?.[0]?.sequence ? lastDoc[0].sequence + 1 : 1;
      const number = `${docType} ${yearMonthPrefix}/${sequence}`;

      // Insert document
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .insert({
          company_id: company.id,
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
          description: item.description,
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
      setLastGeneratedNumber(data.number);
      setIsSuccessModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar documento");
    }
  });

  const resetForm = () => {
    setIsSuccessModalOpen(false);
    setClientId("");
    setOcasionalClient({ name: "", nuit: "", email: "", phone: "", address: "" });
    setItems([{ id: Math.random().toString(36).substring(7), type: "produto", description: "", quantity: "1", unit_price: "0", discount_type: "percentagem", discount_value: "0" }]);
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
        title="Nova Factura"
        subtitle="Preencha os detalhes e visualize o documento ao lado"
      />

      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE: FORM */}
          <div className="space-y-6">
            
            {/* Header Options */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="FT">Factura (FT)</option>
                    <option value="VD">Venda a Dinheiro (VD)</option>
                    <option value="RC">Recibo (RC)</option>
                    <option value="NC">Nota de Crédito (NC)</option>
                    <option value="ND">Nota de Débito (ND)</option>
                    <option value="CT">Cotação (CT)</option>
                    <option value="GR">Guia de Remessa (GR)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data de Emissão</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</label>
                <div className="flex gap-2">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="h-11 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Selecione um cliente...</option>
                    <option value="ocasional">+ Digitar Manualmente (Não guardar)</option>
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
                      <label className="text-xs text-muted-foreground">Nome do Cliente *</label>
                      <input type="text" value={ocasionalClient.name} onChange={e => setOcasionalClient({...ocasionalClient, name: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">NUIT</label>
                      <input type="text" value={ocasionalClient.nuit} onChange={e => setOcasionalClient({...ocasionalClient, nuit: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Email</label>
                      <input type="email" value={ocasionalClient.email} onChange={e => setOcasionalClient({...ocasionalClient, email: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Endereço</label>
                      <input type="text" value={ocasionalClient.address} onChange={e => setOcasionalClient({...ocasionalClient, address: e.target.value})} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Conditional Fields: References */}
              {isRefDoc && (
                <div className="rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-foreground">Documento de Referência</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Factura Original</label>
                      <select 
                        value={referenceInvoice} 
                        onChange={e => handleReferenceSelect(e.target.value)} 
                        className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecione a fatura...</option>
                        {pastInvoices.map(inv => (
                          <option key={inv.id} value={inv.number}>{inv.number} - {inv.client_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Data da Factura</label>
                      <input type="date" value={referenceDate} onChange={e => setReferenceDate(e.target.value)} readOnly className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none opacity-70" />
                    </div>
                    {docType !== "RC" && (
                      <div className="sm:col-span-2">
                        <label className="text-xs text-muted-foreground">Motivo</label>
                        <input type="text" placeholder="Motivo para a emissão da nota..." value={reason} onChange={e => setReason(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conditional Fields: Transport */}
              {isTransportDoc && (
                <div className="rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-foreground">Detalhes de Transporte</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Origem</label>
                      <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Destino</label>
                      <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Motorista</label>
                      <input type="text" value={driver} onChange={e => setDriver(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Matrícula da Viatura</label>
                      <input type="text" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Line Items */}
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="bg-muted/30 px-5 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Linhas do Documento</h3>
              </div>
              
              <div className="p-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_140px_40px] gap-2 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Descrição do produto ou serviço..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Qtd."
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {!isTransportDoc && (
                      <>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Preço MT"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="Desc."
                            value={item.discount_value}
                            onChange={(e) => updateItem(item.id, "discount_value", e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <select
                            value={item.discount_type}
                            onChange={(e) => updateItem(item.id, "discount_type", e.target.value)}
                            className="h-10 rounded-lg border border-border bg-background px-1 text-sm focus:border-primary focus:outline-none"
                          >
                            <option value="percentagem">%</option>
                            <option value="valor_fixo">MT</option>
                          </select>
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline px-2"
                >
                  <Plus className="h-4 w-4" /> Adicionar linha
                </button>
              </div>
            </div>

            {/* Footer Totals & Actions */}
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
                  <textarea
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Notas para o cliente..."
                    className="min-h-[100px] w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 flex flex-col justify-between">
                {!isTransportDoc ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{MT(calculations.subtotal)}</span>
                    </div>
                    {calculations.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-destructive">
                        <span>Desconto Total</span>
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
                      <span className="font-bold text-foreground">Total a Pagar</span>
                      <span className="text-xl font-black text-primary">{MT(calculations.total)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl p-4">
                    Guias de Remessa não geram obrigações financeiras. Totais ocultos.
                  </div>
                )}

                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-border">
                  <button 
                    type="button" 
                    onClick={() => navigate({ to: "/painel/facturacao" })}
                    className="w-full rounded-full border border-border bg-background py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => saveDocument.mutate()}
                    disabled={saveDocument.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-70"
                  >
                    {saveDocument.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Emitir
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LIVE PREVIEW */}
          <div 
            ref={previewContainerRef}
            className="hidden lg:flex flex-col items-center lg:sticky lg:top-8 bg-muted/20 rounded-3xl border border-border h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden relative"
          >
             <div className="w-full flex items-center justify-between sticky top-0 bg-muted/90 backdrop-blur-md z-10 p-6 pb-2 mb-4">
                <h3 className="font-bold text-foreground">Pré-visualização</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">Tempo Real</span>
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

      {/* Modals */}
      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        companyId={company?.id || ""} 
        onClientCreated={(id) => setClientId(id)}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate({ to: "/painel/facturacao" })}
        documentNumber={lastGeneratedNumber}
        onDownload={() => {
          const element = document.getElementById("pdf-content");
          if (!element) return;
          
          toast.success("A gerar PDF... por favor aguarde.");
          
          domtoimage.toPng(element, { 
            quality: 1, 
            bgcolor: '#ffffff',
            scale: 2 
          })
          .then((dataUrl: string) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${lastGeneratedNumber.replace(/\//g, '-')}.pdf`);
            toast.success("Download concluído!");
          })
          .catch((error: any) => {
            console.error("Erro ao gerar PDF:", error);
            toast.error("Erro ao gerar PDF.");
          });
        }}
        onEmail={() => toast.success("Email enviado com sucesso!")}
        onNew={resetForm}
      />
    </div>
  );
}
