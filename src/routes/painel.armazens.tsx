import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, MapPin, Loader2, Warehouse, Edit, Trash2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { WarehouseModal } from "@/components/warehouse-modal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/painel/armazens")({
  component: ArmazensPage,
});

function ArmazensPage() {
  const { t } = useTranslation();
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
        title={t("warehouses.title")}
        subtitle={t("warehouses.subtitle")}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> {t("warehouses.new_warehouse")}
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
            placeholder={t("warehouses.search")}
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>{t("warehouses.loading")}</p>
          </div>
        ) : warehouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Warehouse className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">{t("warehouses.empty")}</h3>
            <p className="mt-1 text-sm">{t("warehouses.empty_desc")}</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> {t("warehouses.create_first")}
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
                    {t("warehouses.main")}
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
                      <span className="truncate">{w.location || t("warehouses.no_address")}</span>
                    </div>
                  </div>
                </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button 
                    className="text-sm font-semibold text-primary hover:underline"
                    onClick={() => {
                      toast.info(t("warehouses.view_items_dev"));
                    }}
                  >
                    {t("warehouses.view_items")}
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        toast.info(t("warehouses.edit_dev"));
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {!w.is_default && (
                      <button 
                        onClick={async () => {
                          if (confirm(t("warehouses.delete_confirm", { name: w.name }))) {
                            const { error } = await supabase.from("warehouses").delete().eq("id", w.id);
                            if (error) {
                              toast.error(t("warehouses.delete_error"));
                            } else {
                              toast.success(t("warehouses.delete_success"));
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
