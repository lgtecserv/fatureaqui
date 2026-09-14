import { useState, useEffect } from "react";
import { Loader2, X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

interface PurchaseItem {
  variant_id: string;
  quantity: number;
  unit_cost: number;
}

export function PurchaseModal({ isOpen, onClose, companyId }: PurchaseModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    supplier_id: "",
    destination_warehouse_id: "",
    order_number: "",
    notes: "",
  });
  
  const [items, setItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ supplier_id: "", destination_warehouse_id: "", order_number: "", notes: "" });
      setItems([]);
    }
  }, [isOpen]);

  // Fetch Suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("suppliers").select("id, name").eq("company_id", companyId);
      return data || [];
    },
    enabled: isOpen && !!companyId,
  });

  // Fetch Warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("warehouses").select("id, name").eq("company_id", companyId).eq("is_active", true);
      return data || [];
    },
    enabled: isOpen && !!companyId,
  });

  // Fetch Products/Variants
  const { data: variants = [] } = useQuery({
    queryKey: ["variants_for_purchase", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select(`
          id, 
          sku,
          price,
          products!inner ( name, company_id )
        `)
        .eq("products.company_id", companyId);
      if (error) throw error;
      return data || [];
    },
    enabled: isOpen && !!companyId,
  });

  const addItem = () => {
    setItems([...items, { variant_id: "", quantity: 1, unit_cost: 0 }]);
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

  const createPurchase = useMutation({
    mutationFn: async () => {
      if (!formData.supplier_id) throw new Error("Selecione um fornecedor");
      if (!formData.destination_warehouse_id) throw new Error("Selecione um armazém de destino");
      if (items.length === 0) throw new Error("Adicione pelo menos um produto");
      if (items.some(i => !i.variant_id || i.quantity <= 0 || i.unit_cost < 0)) {
        throw new Error("Verifique os produtos e quantidades (não podem ser 0)");
      }
      
      // 1. Create Purchase Order (Draft)
      const { data: po, error: poError } = await supabase
        .from("purchase_orders")
        .insert([{ 
          company_id: companyId,
          supplier_id: formData.supplier_id,
          destination_warehouse_id: formData.destination_warehouse_id,
          order_number: formData.order_number || `PO-${Date.now()}`,
          notes: formData.notes,
          total_amount: totalAmount,
          status: 'draft'
        }])
        .select()
        .single();
        
      if (poError) throw poError;

      // 2. Create Items
      const itemsToInsert = items.map(item => ({
        purchase_order_id: po.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total_price: item.quantity * item.unit_cost
      }));

      const { error: itemsError } = await supabase.from("purchase_order_items").insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // 3. Process receipt immediately (trigger stock increment) via RPC
      const { error: rpcError } = await supabase.rpc('process_purchase_order_receipt', {
        p_purchase_order_id: po.id
      });
      
      if (rpcError) {
        console.error("RPC Error:", rpcError);
        throw new Error("Compra registada, mas houve um erro ao atualizar o stock.");
      }

      return po;
    },
    onSuccess: () => {
      toast.success("Compra registada e stock atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchase_orders"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao registar compra");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Registar Nova Compra (Entrada de Stock)</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fornecedor *</label>
            <select 
              value={formData.supplier_id}
              onChange={e => setFormData({ ...formData, supplier_id: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Selecione um fornecedor...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Armazém de Destino *</label>
            <select 
              value={formData.destination_warehouse_id}
              onChange={e => setFormData({ ...formData, destination_warehouse_id: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Selecione um armazém...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nº da Fatura/Recibo (Opcional)</label>
            <input 
              type="text" 
              value={formData.order_number}
              onChange={e => setFormData({ ...formData, order_number: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações</label>
            <input 
              type="text" 
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none" 
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Produtos Recebidos</h3>
          <button 
            onClick={addItem}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Plus className="h-4 w-4" /> Adicionar Produto
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
              <div className="flex-1">
                <select 
                  value={item.variant_id}
                  onChange={e => updateItem(index, 'variant_id', e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Selecionar artigo...</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.products?.name} {v.sku ? `(${v.sku})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <input 
                  type="number" 
                  min="0.01" step="0.01"
                  placeholder="Qtd"
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                />
              </div>
              <div className="w-32">
                <input 
                  type="number" 
                  min="0" step="0.01"
                  placeholder="Custo Unit."
                  value={item.unit_cost}
                  onChange={e => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => removeItem(index)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
              Nenhum produto adicionado à compra.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-muted-foreground">
            Total da Compra: <span className="text-lg font-bold text-foreground ml-2">{totalAmount.toFixed(2)} MT</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted text-muted-foreground"
            >
              Cancelar
            </button>
            <button 
              onClick={() => createPurchase.mutate()}
              disabled={createPurchase.isPending || items.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {createPurchase.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Finalizar e Somar Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
