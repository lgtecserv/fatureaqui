import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Loader2, ShoppingCart, Eye, Edit } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { MT } from "@/lib/format";
import { PurchaseModal } from "@/components/purchase-modal";

export const Route = createFileRoute("/painel/compras")({
  component: ComprasPage,
});

function ComprasPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");

  const { data: purchaseOrders = [], isLoading } = useQuery({
    queryKey: ["purchase_orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (!company) return [];
      setCompanyId(company.id);

      const { data, error } = await supabase
        .from("purchase_orders")
        .select(`
          *,
          suppliers ( name ),
          warehouses ( name )
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredOrders = purchaseOrders.filter(po => 
    po.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.suppliers?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft': return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Rascunho</span>;
      case 'sent': return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">Enviada</span>;
      case 'received': return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">Recebida (Stock)</span>;
      case 'cancelled': return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Cancelada</span>;
      default: return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{status}</span>;
    }
  };

  return (
    <>
      <Topbar
        title="Notas de Encomenda"
        subtitle="Gestão de compras a fornecedores e receção de mercadoria"
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Registar Compra
          </button>
        }
      />
      <PurchaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        companyId={companyId} 
      />

      <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número ou fornecedor..."
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>A carregar encomendas...</p>
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <ShoppingCart className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">Sem Encomendas</h3>
            <p className="mt-1 text-sm">Não há registo de compras a fornecedores.</p>
            <button className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95">
              <Plus className="h-4 w-4" /> Registar Compra
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Data / Número</th>
                    <th className="px-6 py-4">Fornecedor</th>
                    <th className="px-6 py-4">Armazém Destino</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{po.order_number || "Sem nº"}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{new Date(po.order_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {po.suppliers?.name || "Fornecedor Removido"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {po.warehouses?.name || "Não definido"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(po.status)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        {MT(po.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          {po.status === 'draft' && (
                            <button className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
