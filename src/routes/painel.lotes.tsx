import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Boxes, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/painel/lotes")({
  component: LotesPage,
});

function LotesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["batches", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (!company) return [];

      const { data, error } = await supabase
        .from("product_batches")
        .select(`
          *,
          product_variants ( sku, products ( name ) ),
          stock_inventory ( quantity, warehouses ( name, type ) )
        `)
        .eq("company_id", company.id)
        .order("expiry_date", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="pb-20">
      <Topbar
        title={t("batches.title")}
        subtitle={t("batches.subtitle")}
      />

      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 space-y-6">
        
        {isLoading ? (
          <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Boxes className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">{t("batches.empty")}</h3>
            <p className="mt-1 text-sm">{t("batches.empty_desc")}</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">{t("batches.table_batch")}</th>
                    <th className="px-6 py-4">{t("batches.table_product")}</th>
                    <th className="px-6 py-4">{t("batches.table_manufacture")}</th>
                    <th className="px-6 py-4">{t("batches.table_expiry")}</th>
                    <th className="px-6 py-4">{t("batches.table_stock")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {batches.map((b: any) => {
                    const daysToExpiry = b.expiry_date ? differenceInDays(new Date(b.expiry_date), new Date()) : null;
                    const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 30 && daysToExpiry > 0;
                    const isExpired = daysToExpiry !== null && daysToExpiry <= 0;

                    return (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {b.batch_number}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{b.product_variants?.products?.name}</div>
                          <div className="text-xs text-muted-foreground">{b.product_variants?.sku}</div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {b.manufacture_date ? format(new Date(b.manufacture_date), "dd/MM/yyyy") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          {b.expiry_date ? (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isExpired ? 'bg-red-100 text-red-700' : isExpiringSoon ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {(isExpired || isExpiringSoon) && <AlertTriangle className="h-3 w-3" />}
                              {format(new Date(b.expiry_date), "dd/MM/yyyy")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {b.stock_inventory?.map((st: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{st.warehouses?.name}:</span>
                                <span className="font-semibold text-foreground">{st.quantity} {t("batches.unit")}</span>
                              </div>
                            ))}
                            {(!b.stock_inventory || b.stock_inventory.length === 0) && (
                              <span className="text-xs text-muted-foreground">{t("batches.no_stock")}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
