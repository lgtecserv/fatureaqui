import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSupplierCreated?: (supplierId: string) => void;
}

export function SupplierModal({ isOpen, onClose, companyId, onSupplierCreated }: SupplierModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    nuit: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", nuit: "", email: "", phone: "", address: "", city: "", province: "", notes: "" });
    }
  }, [isOpen]);

  const createSupplier = useMutation({
    mutationFn: async () => {
      if (!formData.name) throw new Error("O nome do fornecedor é obrigatório");
      
      const { data, error } = await supabase
        .from("suppliers")
        .insert([{ ...formData, company_id: companyId }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Fornecedor adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      if (onSupplierCreated) onSupplierCreated(data.id);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar fornecedor");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Novo Fornecedor</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome da Empresa / Fornecedor *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">NUIT</label>
              <input 
                type="text" 
                value={formData.nuit}
                onChange={e => setFormData({ ...formData, nuit: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Endereço</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cidade</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Província</label>
              <input 
                type="text" 
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
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
            onClick={() => createSupplier.mutate()}
            disabled={createSupplier.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
          >
            {createSupplier.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar Fornecedor
          </button>
        </div>
      </div>
    </div>
  );
}
