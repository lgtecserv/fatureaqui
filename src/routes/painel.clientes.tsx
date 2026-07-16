import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Mail, Phone, Loader2, Users } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { MT } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { ClientModal } from "@/components/client-modal";

export const Route = createFileRoute("/painel/clientes")({
  component: ClientesPage,
});


function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function ClientesPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", user?.id],
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
        .from("clients")
        .select("*")
        .eq("company_id", company.id)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <>
      <Topbar
        title="Clientes"
        subtitle="Gestão de clientes e histórico de facturação"
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Novo cliente
          </button>
        }
      />

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        companyId={companyId} 
      />

      <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nome, NUIT ou contacto…"
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>A carregar clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Users className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">Sem clientes</h3>
            <p className="mt-1 text-sm">Não encontrou nenhum cliente. Comece por adicionar um.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Adicionar Cliente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clients.map((c) => (
              <div
                key={c.id}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-primary/40 hover:shadow-elevated"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-sm font-extrabold text-primary-soft-foreground">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-foreground">{c.name}</h3>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      NUIT {c.nuit || "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="truncate">{c.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{c.email || "—"}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Total facturado
                    </div>
                    <div className="mt-0.5 text-lg font-extrabold tabular text-foreground">
                      {MT(c.total_invoiced || 0)}
                    </div>
                  </div>
                  <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
