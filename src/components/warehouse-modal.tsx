import { useState, useEffect } from "react";
import { Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export function WarehouseModal({ isOpen, onClose, companyId }: WarehouseModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "armazem",
    is_default: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", location: "", type: "armazem", is_default: false });
    }
  }, [isOpen]);

  const createWarehouse = useMutation({
    mutationFn: async () => {
      if (!formData.name) throw new Error("O nome do armazém é obrigatório");
      
      const { data, error } = await supabase
        .from("warehouses")
        .insert([{ ...formData, company_id: companyId }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Armazém adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar armazém");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Novo Armazém / Local</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Local (Ex: Loja Sede) *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de Espaço</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="armazem">Armazém (Retaguarda / Depósito)</option>
              <option value="loja">Loja (Frente de Loja / Venda direta)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Morada / Detalhes de Localização</label>
            <textarea 
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="mt-1.5 h-20 w-full rounded-xl border border-border bg-background p-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input 
              type="checkbox" 
              id="is_default"
              checked={formData.is_default}
              onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_default" className="text-sm font-medium text-foreground cursor-pointer">
              Definir como Armazém Principal
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted text-muted-foreground"
          >
            Cancelar
          </button>
          <button 
            onClick={() => createWarehouse.mutate()}
            disabled={createWarehouse.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
          >
            {createWarehouse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Gravar Armazém
          </button>
        </div>
      </div>
    </div>
  );
}
