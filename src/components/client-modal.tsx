import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onClientCreated?: (clientId: string) => void;
}

export function ClientModal({ isOpen, onClose, companyId, onClientCreated }: ClientModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    nuit: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", company_name: "", nuit: "", email: "", phone: "", address: "" });
    }
  }, [isOpen]);

  const createClient = useMutation({
    mutationFn: async () => {
      if (!formData.name) throw new Error("O nome do cliente é obrigatório");
      
      const { data, error } = await supabase
        .from("clients")
        .insert([{ ...formData, company_id: companyId }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Cliente adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (onClientCreated) onClientCreated(data.id);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar cliente");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Novo Cliente</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Cliente *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome da Empresa</label>
            <input 
              type="text" 
              value={formData.company_name}
              onChange={e => setFormData({ ...formData, company_name: e.target.value })}
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
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted text-muted-foreground"
          >
            Cancelar
          </button>
          <button 
            onClick={() => createClient.mutate()}
            disabled={createClient.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
          >
            {createClient.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
