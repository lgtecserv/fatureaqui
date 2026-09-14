import { useState, useEffect } from "react";
import { Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  initialData?: any;
}

export function ProductModal({ isOpen, onClose, companyId, initialData }: ProductModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "produto",
    price: "",
    sku: "",
  });

  const [initialStocks, setInitialStocks] = useState<Record<string, { quantity: string; batch_number: string }>>({});

  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("warehouses").select("*").eq("company_id", companyId).eq("is_active", true);
      return data || [];
    },
    enabled: isOpen && !!companyId,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          type: initialData.type || "produto",
          price: initialData.product_variants?.[0]?.price?.toString() || "",
          sku: initialData.product_variants?.[0]?.sku || "",
        });
      } else {
        setFormData({ name: "", description: "", type: "produto", price: "", sku: "" });
      }
      setInitialStocks({});
    }
  }, [isOpen, initialData]);

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!formData.name) throw new Error("O nome do artigo é obrigatório");
      if (!formData.price) throw new Error("O preço base é obrigatório");
      
      // 1. Criar ou Atualizar o produto pai
      let productId = initialData?.id;
      
      if (initialData) {
        const { error: productError } = await supabase
          .from("products")
          .update({ 
            name: formData.name, 
            description: formData.description,
            type: formData.type,
          })
          .eq("id", initialData.id);
          
        if (productError) throw productError;
      } else {
        const { data: product, error: productError } = await supabase
          .from("products")
          .insert([{ 
            name: formData.name, 
            description: formData.description,
            type: formData.type,
            company_id: companyId,
            has_variants: false
          }])
          .select()
          .single();
          
        if (productError) throw productError;
        productId = product.id;
      }

      // 2. Criar a variante principal com Auto-SKU se vazio
      let finalSku = formData.sku;
      if (!finalSku) {
        finalSku = `ART-${Math.floor(10000 + Math.random() * 90000)}`;
      }

      const variantId = initialData?.product_variants?.[0]?.id;

      if (variantId) {
        const { error: variantError } = await supabase
          .from("product_variants")
          .update({
            sku: finalSku,
            price: parseFloat(formData.price),
          })
          .eq("id", variantId);

        if (variantError) throw variantError;
      } else {
        const { data: variant, error: variantError } = await supabase
          .from("product_variants")
          .insert([{
            product_id: productId,
            sku: finalSku,
            price: parseFloat(formData.price),
          }])
          .select()
          .single();

        if (variantError) throw variantError;
        
        // Use variant.id for stock logic if needed below
        if (!variantId && formData.type === "produto" && !initialData) {
          for (const [warehouseId, stock] of Object.entries(initialStocks)) {
            const qty = parseFloat(stock.quantity);
            if (qty > 0) {
              let batchId = null;
              
              if (stock.batch_number) {
                const { data: batch, error: batchErr } = await supabase
                  .from("product_batches")
                  .insert([{
                    company_id: companyId,
                    variant_id: variant.id,
                    batch_number: stock.batch_number,
                    manufacture_date: new Date().toISOString().split('T')[0],
                  }])
                  .select()
                  .single();
                  
                if (batchErr) throw batchErr;
                batchId = batch.id;
              }

              await supabase.from("stock_inventory").insert([{
                company_id: companyId,
                warehouse_id: warehouseId,
                variant_id: variant.id,
                batch_id: batchId,
                quantity: qty
              }]);

              await supabase.from("stock_movements").insert([{
                company_id: companyId,
                variant_id: variant.id,
                batch_id: batchId,
                to_warehouse_id: warehouseId,
                type: 'IN',
                quantity: qty,
                reference_doc_type: 'initial_stock'
              }]);
            }
          }
        }
      }

      return true;
    },
    onSuccess: () => {
      toast.success(initialData ? "Artigo atualizado com sucesso!" : "Artigo adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao guardar artigo");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">{initialData ? 'Editar Artigo' : 'Novo Artigo'}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Artigo *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição (Opcional)</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="mt-1.5 h-20 w-full rounded-xl border border-border bg-background p-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="produto">Produto</option>
                <option value="servico">Serviço</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Referência / SKU</label>
              <input 
                type="text" 
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço de Venda (MZN) *</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          {!initialData && formData.type === "produto" && warehouses.length > 0 && (
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Stock Inicial</h3>
              {warehouses.map(w => (
                <div key={w.id} className="grid grid-cols-2 gap-4 items-end bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="col-span-2">
                    <span className="text-xs font-semibold text-foreground">{w.name} <span className="text-muted-foreground font-normal">({w.type === 'loja' ? 'Loja' : 'Armazém'})</span></span>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Qtd Inicial</label>
                    <input 
                      type="number"
                      min="0"
                      value={initialStocks[w.id]?.quantity || ""}
                      onChange={e => setInitialStocks({ ...initialStocks, [w.id]: { ...initialStocks[w.id], quantity: e.target.value } })}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Lote (Opcional)</label>
                    <input 
                      type="text"
                      placeholder="Ex: LOTE-001"
                      value={initialStocks[w.id]?.batch_number || ""}
                      onChange={e => setInitialStocks({ ...initialStocks, [w.id]: { ...initialStocks[w.id], batch_number: e.target.value } })}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Simple alert about variants for Phase 1 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 mt-2">
            <p className="text-xs text-blue-700">
              <span className="font-semibold block mb-1">Nota sobre Variações</span>
              Para já está a criar a versão base do produto. A gestão de cores e tamanhos poderá ser configurada após gravar, no detalhe do produto.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 shrink-0 pt-2">
          <button 
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted text-muted-foreground"
          >
            Cancelar
          </button>
          <button 
            disabled={createProduct.isPending}
            onClick={() => createProduct.mutate()}
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createProduct.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> A guardar...</>
            ) : (
              <>{initialData ? 'Atualizar Artigo' : 'Adicionar Artigo'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
