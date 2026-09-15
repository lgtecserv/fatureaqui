import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Mail, Phone, Loader2, Truck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { SupplierModal } from "@/components/supplier-modal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/painel/fornecedores")({
  component: FornecedoresPage,
});

function initials(name: string) {
  if (!name) return "FN";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function FornecedoresPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers", user?.id],
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
        .from("suppliers")
        .select("*")
        .eq("company_id", company.id)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.nuit && s.nuit.includes(searchQuery))
  );

  return (
    <>
      <Topbar
        title={t("suppliers.title")}
        subtitle={t("suppliers.subtitle")}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> {t("suppliers.new_supplier")}
          </button>
        }
      />

      <SupplierModal 
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
            placeholder={t("suppliers.search")}
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>{t("suppliers.loading")}</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Truck className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">{t("suppliers.empty")}</h3>
            <p className="mt-1 text-sm">{t("suppliers.empty_desc")}</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> {t("suppliers.add")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSuppliers.map((s) => (
              <div
                key={s.id}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-primary/40 hover:shadow-elevated"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-100 text-sm font-extrabold text-orange-700">
                    {initials(s.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-foreground">{s.name}</h3>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      NUIT {s.nuit || "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="truncate">{s.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{s.email || "—"}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {t("suppliers.location")}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-foreground">
                      {s.city ? `${s.city}${s.province ? `, ${s.province}` : ''}` : '—'}
                    </div>
                  </div>
                  <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    {t("suppliers.view_profile")}
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
