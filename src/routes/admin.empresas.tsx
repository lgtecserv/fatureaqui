import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Search, Building2, CircleAlert, FileText, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/empresas")({
  component: AdminEmpresasPage,
});

function AdminEmpresasPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const { data: comps, error: compError } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (compError) throw compError;
      if (!comps || comps.length === 0) return [];

      const adminEmails = ["lgtecserv@gmail.com", "lgtecserv.com@gmail.com"];
      const filteredComps = comps.filter(c => !adminEmails.includes(c.email));
      
      if (filteredComps.length === 0) return [];

      const userIds = filteredComps.map(c => c.user_id);

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .in("user_id", userIds);

      if (subsError) throw subsError;

      const { data: settings } = await supabase
        .from("system_settings")
        .select("trial_days")
        .limit(1)
        .single();
      const trialDays = settings?.trial_days || 30;

      // Buscar métricas de atividade em paralelo para todas as empresas
      const metricsPromises = filteredComps.map(async (comp) => {
        const [docsRes, prodsRes, clientsRes] = await Promise.all([
          supabase.from('documents').select('id', { count: 'exact', head: true }).eq('company_id', comp.id),
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('company_id', comp.id),
          supabase.from('clients').select('id', { count: 'exact', head: true }).eq('company_id', comp.id)
        ]);

        return {
          company_id: comp.id,
          docsCount: docsRes.count || 0,
          prodsCount: prodsRes.count || 0,
          clientsCount: clientsRes.count || 0
        };
      });

      const metrics = await Promise.all(metricsPromises);

      return filteredComps.map(comp => {
        const subscription = subs?.find(s => s.user_id === comp.user_id);
        const metric = metrics.find(m => m.company_id === comp.id);
        return {
          ...comp,
          subscription,
          trialDays,
          metrics: metric
        };
      });
    }
  });

  const filteredCompanies = companies?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nuit.includes(searchTerm) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateExpiration = (comp: any) => {
    const isPro = comp.subscription?.plan_type === 'pro' && comp.subscription?.status === 'ativo';
    if (isPro && comp.subscription?.valid_until) {
      return new Date(comp.subscription.valid_until);
    }
    // Free plan expiration
    const created = new Date(comp.created_at);
    created.setDate(created.getDate() + (comp.trialDays || 30));
    return created;
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("admin.mgmt_companies")}</h1>
          <p className="text-slate-500 mt-1">{t("admin.mgmt_companies_sub")}</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder={t("admin.search_companies")} 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.registered_companies", { count: companies?.length || 0 })}</CardTitle>
          <CardDescription>{t("admin.registered_companies_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Building2 className="mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-medium text-slate-900">{t("admin.no_companies_found")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("admin.company")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.contact")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.activity")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.current_plan")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.valid_until")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredCompanies?.map((comp) => {
                    const expirationDate = calculateExpiration(comp);
                    const isProActive = comp.subscription?.plan_type === 'pro' && comp.subscription?.status === 'ativo';
                    const expired = expirationDate < new Date();
                    const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={comp.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white overflow-hidden">
                              {comp.logo_url ? (
                                <img src={comp.logo_url} alt={comp.name} className="h-full w-full object-contain" />
                              ) : (
                                <Building2 className="h-5 w-5 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <div>{comp.name}</div>
                              <div className="text-xs text-slate-500 font-normal">NUIT: {comp.nuit || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>{comp.email}</div>
                          <div className="text-xs text-slate-500">{comp.phone}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1" title={t("admin.docs_issued")}>
                              <FileText className="h-3.5 w-3.5 text-slate-400" />
                              <strong className="text-slate-900">{comp.metrics?.docsCount || 0}</strong>
                            </div>
                            <div className="flex items-center gap-1" title={t("admin.clients_reg")}>
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <strong className="text-slate-900">{comp.metrics?.clientsCount || 0}</strong>
                            </div>
                            <div className="flex items-center gap-1" title={t("admin.prods_created")}>
                              <Package className="h-3.5 w-3.5 text-slate-400" />
                              <strong className="text-slate-900">{comp.metrics?.prodsCount || 0}</strong>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {isProActive ? (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                              Pro
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Free / Trial
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <span className={expired ? "text-red-600 font-medium flex items-center gap-1.5" : "text-emerald-600 font-medium"}>
                            {expired && <CircleAlert className="h-3.5 w-3.5" />}
                            {expirationDate.toLocaleDateString("pt-PT")}
                            {!expired && <span className="text-xs text-slate-400 ml-1">({daysLeft}d)</span>}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {comp.subscription?.status === 'pending' ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                              {t("admin.awaiting_payment")}
                            </span>
                          ) : expired ? (
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                              {isProActive ? t("admin.expired_cut") : t("admin.trial_expired")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              {t("admin.active")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
