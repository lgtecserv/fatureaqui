import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Check, X, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/faturacao")({
  component: AdminFaturacaoPage,
});

function AdminFaturacaoPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ["pending-subscriptions"],
    queryFn: async () => {
      // Fetch pending subscriptions
      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("status", "pendente");

      if (subsError) throw subsError;
      if (!subs || subs.length === 0) return [];

      // Extract user_ids
      const userIds = subs.map(s => s.user_id);

      // Fetch companies for these users
      const { data: companies, error: compError } = await supabase
        .from("companies")
        .select("*")
        .in("user_id", userIds);

      if (compError) throw compError;

      // Merge data
      return subs.map(sub => {
        const company = companies?.find(c => c.user_id === sub.user_id);
        return {
          ...sub,
          company
        };
      });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // Calculate new date: 30 days from now
      const newValidUntil = new Date();
      newValidUntil.setDate(newValidUntil.getDate() + 30);

      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status: "ativo", 
          plan_type: "pro",
          valid_until: newValidUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status: "rejected",
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-subscriptions"] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("admin.billing_approval")}</h1>
          <p className="text-slate-500 mt-1">{t("admin.billing_approval_sub")}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.pending_payments", { count: pendingRequests?.length || 0 })}</CardTitle>
          <CardDescription>{t("admin.pending_payments_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Clock className="mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-medium text-slate-900">{t("admin.no_pending_payments")}</p>
              <p className="text-sm">{t("admin.all_processed")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("admin.company")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.contact")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.req_date")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.receipt_notes")}</th>
                    <th className="px-4 py-3 text-right font-medium">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {pendingRequests?.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {req.company?.name || t("admin.unknown_company")}
                        <div className="text-xs text-slate-500 font-normal">NUIT: {req.company?.nuit || "N/A"}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {req.company?.email}
                        <div className="text-xs text-slate-500">{req.company?.phone}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {new Date(req.updated_at).toLocaleDateString("pt-PT", {
                          day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {req.receipt_url ? (
                            <a 
                              href={req.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                            >
                              <Eye className="h-4 w-4" />
                              {t("admin.view_file")}
                            </a>
                          ) : (
                            <span className="text-slate-400">{t("admin.no_file")}</span>
                          )}
                          {req.notes && (
                            <div className="mt-1 rounded-md bg-amber-50 p-2 text-xs text-amber-800 border border-amber-100">
                              <span className="font-semibold">{t("admin.note")}</span> {req.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => rejectMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                          >
                            {rejectMutation.isPending && rejectMutation.variables === req.id ? (
                              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                              <X className="mr-1.5 h-4 w-4" />
                            )}
                            {t("admin.reject")}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => approveMutation.mutate(req.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            {approveMutation.isPending && approveMutation.variables === req.id ? (
                              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="mr-1.5 h-4 w-4" />
                            )}
                            {t("admin.approve_payment")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
