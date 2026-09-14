import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, MapPin, Loader2, Warehouse, Edit, Trash2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { WarehouseModal } from "@/components/warehouse-modal";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/armazens")({
  component: ArmazensPage,
});

function ArmazensPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ["warehouses", user?.id],
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
        .from("warehouses")
        .select("*")
        .eq("company_id", company.id)
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredWarehouses = warehouses.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Topbar
        title="Armazéns e Locais"
        subtitle="Gestão multi-armazém de stock"
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Novo Armazém
          </button>
        }
      />

      <WarehouseModal 
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
            placeholder="Buscar locais..."
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>A carregar locais...</p>
          </div>
        ) : warehouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Warehouse className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">Sem Armazéns</h3>
            <p className="mt-1 text-sm">Não tem locais de stock configurados. Comece por criar a loja sede.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Criar Primeiro Local
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarehouses.map((w) => (
              <div
                key={w.id}
                className={`group relative rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-elevated ${
                  w.is_default ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/40"
                }`}
              >
                {w.is_default && (
                  <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase shadow-sm">
                    Principal
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold ${w.is_default ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Warehouse className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-foreground">{w.name}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{w.location || "Sem morada configurada"}</span>
                    </div>
                  </div>
                </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button 
                    className="text-sm font-semibold text-primary hover:underline"
                    onClick={() => {
                      toast.info("A funcionalidade de visualização de saldo por artigo está a ser desenvolvida.");
                    }}
                  >
                    Ver Artigos
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        toast.info("Edição de armazéns ficará disponível na próxima atualização.");
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {!w.is_default && (
                      <button 
                        onClick={async () => {
                          if (confirm(`Tem a certeza que deseja apagar o armazém "${w.name}"?`)) {
                            const { error } = await supabase.from("warehouses").delete().eq("id", w.id);
                            if (error) {
                              toast.error("Erro ao apagar armazém. Verifique se tem stock associado.");
                            } else {
                              toast.success("Armazém apagado com sucesso.");
                              // Reload data would go here if we extracted useQuery properly, 
                              // but for now a simple reload or invalidate via UI will do.
                              window.location.reload();
                            }
                          }
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
