import { useState, useEffect } from "react";
import { Loader2, X, Sparkles, Tag, Layers, DollarSign, Hash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  initialData?: any;
  onProductCreated?: (product: any) => void;
}

const COMMON_UNITS = [
  { value: "un", label: "Unidade (un)" },
  { value: "hora", label: "Hora (h)" },
  { value: "dia", label: "Dia" },
  { value: "mes", label: "Mês" },
  { value: "projeto", label: "Projeto" },
  { value: "servico", label: "Serviço" },
  { value: "pacote", label: "Pacote" },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "metro", label: "Metro (m)" },
  { value: "litro", label: "Litro (L)" },
  { value: "outro", label: "Outro..." },
];

export function ProductModal({ isOpen, onClose, companyId, initialData, onProductCreated }: ProductModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "servico", // default to servico or produto
    unit_of_measure: "un",
    custom_unit: "",
    price: "",
    default_quantity: "1",
    sku: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const uom = initialData.unit_of_measure || "un";
        const isCommonUnit = COMMON_UNITS.some(u => u.value === uom);
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          type: initialData.type || "produto",
          unit_of_measure: isCommonUnit ? uom : "outro",
          custom_unit: isCommonUnit ? "" : uom,
          price: initialData.product_variants?.[0]?.price?.toString() || "",
          default_quantity: initialData.default_quantity?.toString() || "1",
          sku: initialData.product_variants?.[0]?.sku || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          type: "servico",
          unit_of_measure: "un",
          custom_unit: "",
          price: "",
          default_quantity: "1",
          sku: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const saveProduct = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("ID da empresa não informado");
      if (!formData.name.trim()) throw new Error("O nome do artigo ou serviço é obrigatório");
      if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
        throw new Error("O preço unitário é obrigatório");
      }

      const finalUnit = formData.unit_of_measure === "outro"
        ? (formData.custom_unit.trim() || "un")
        : formData.unit_of_measure;

      let finalSku = formData.sku.trim();
      if (!finalSku) {
        const prefix = formData.type === "servico" ? "SRV" : "ART";
        finalSku = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
      }

      const defaultQty = parseFloat(formData.default_quantity) || 1;
      const unitPrice = parseFloat(formData.price);

      let productId = initialData?.id;
      let createdVariant: any = null;

      if (initialData) {
        // Atualizar produto existente
        const updatePayload: any = {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          unit_of_measure: finalUnit,
        };

        const { error: prodErr } = await supabase
          .from("products")
          .update({ ...updatePayload, default_quantity: defaultQty })
          .eq("id", initialData.id);

        if (prodErr && prodErr.message?.includes("default_quantity")) {
          const retry = await supabase.from("products").update(updatePayload).eq("id", initialData.id);
          if (retry.error) throw retry.error;
        } else if (prodErr) {
          throw prodErr;
        }

        // Atualizar variante de preço
        const variantId = initialData.product_variants?.[0]?.id;
        if (variantId) {
          const { data: updatedVariant, error: varErr } = await supabase
            .from("product_variants")
            .update({
              sku: finalSku,
              price: unitPrice,
            })
            .eq("id", variantId)
            .select("*, products(name, type, unit_of_measure, description)")
            .single();

          if (varErr) throw varErr;
          createdVariant = updatedVariant;
        }
      } else {
        // Inserir novo produto
        const insertPayload: any = {
          company_id: companyId,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          unit_of_measure: finalUnit,
          has_variants: false,
        };

        let newProd: any;
        const { data: createdData, error: prodErr } = await supabase
          .from("products")
          .insert([{ ...insertPayload, default_quantity: defaultQty }])
          .select()
          .single();

        if (prodErr && prodErr.message?.includes("default_quantity")) {
          const retry = await supabase
            .from("products")
            .insert([insertPayload])
            .select()
            .single();
          if (retry.error) throw retry.error;
          newProd = retry.data;
        } else if (prodErr) {
          throw prodErr;
        } else {
          newProd = createdData;
        }

        productId = newProd.id;

        // Inserir variante padrão de preço
        const { data: newVariant, error: varErr } = await supabase
          .from("product_variants")
          .insert([{
            product_id: productId,
            sku: finalSku,
            price: unitPrice,
          }])
          .select("*, products(name, type, unit_of_measure, description)")
          .single();

        if (varErr) throw varErr;
        createdVariant = newVariant;
      }

      return { productId, variant: createdVariant };
    },
    onSuccess: (data) => {
      toast.success(initialData ? "Atualizado com sucesso!" : "Artigo/Serviço adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["variants_with_stock"] });
      queryClient.invalidateQueries({ queryKey: ["all_items_catalog"] });
      
      if (onProductCreated && data.variant) {
        onProductCreated(data.variant);
      }
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao gravar artigo/serviço");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {initialData ? "Editar Artigo ou Serviço" : "Novo Artigo ou Serviço"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Registe o que vende ou presta para faturar rapidamente
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="rounded-full p-2 hover:bg-muted text-muted-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 overflow-y-auto py-5 pr-1">
          
          {/* Categoria / Tipo Toggle */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Categoria / Tipo *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "servico" })}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  formData.type === "servico"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Serviço (ex: Criação de Web, Consultoria)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "produto" })}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  formData.type === "produto"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Produto (ex: Equipamento, Material)
              </button>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Nome do Artigo ou Serviço *
            </label>
            <input 
              type="text" 
              required
              placeholder={formData.type === "servico" ? "Ex: Manutenção de Computadores, Criação de Website..." : "Ex: Computador Portátil, Ar-condicionado 12.000 BTU..."}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          
          {/* Descrição */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Descrição Detalhada (Opcional)
            </label>
            <textarea 
              rows={2}
              placeholder="Descreva detalhes que podem aparecer na fatura ou cotação..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            />
          </div>

          {/* Grid: Preço & Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Preço Unitário (MZN) *
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 pr-12 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                  MT
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Unidade de Medida
              </label>
              <select
                value={formData.unit_of_measure}
                onChange={e => setFormData({ ...formData, unit_of_measure: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {COMMON_UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Se escolher "Outro" na unidade */}
          {formData.unit_of_measure === "outro" && (
            <div className="animate-in fade-in duration-150">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Especifique a Unidade Personalizada
              </label>
              <input 
                type="text" 
                placeholder="Ex: consulta, sessão, palete, viagem..."
                value={formData.custom_unit}
                onChange={e => setFormData({ ...formData, custom_unit: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          )}

          {/* Grid: Quantidade Padrão & Código / SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Quantidade Padrão (Opcional)
              </label>
              <input 
                type="number"
                step="0.01"
                min="0.01"
                placeholder="1"
                value={formData.default_quantity}
                onChange={e => setFormData({ ...formData, default_quantity: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Código / Ref. Interna (Opcional)
              </label>
              <input 
                type="text" 
                placeholder="Ex: SRV-001, PRD-102..."
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted text-muted-foreground transition"
          >
            Cancelar
          </button>
          <button 
            type="button"
            disabled={saveProduct.isPending}
            onClick={() => saveProduct.mutate()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 disabled:opacity-50"
          >
            {saveProduct.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> A guardar...</>
            ) : (
              <>{initialData ? "Atualizar" : "Gravar Artigo/Serviço"}</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
