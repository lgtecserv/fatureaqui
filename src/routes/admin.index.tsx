import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, UserPlus, Activity, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      // 1. Total Companies
      const { count: totalCompanies } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      // 2. New Companies this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newCompanies } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      // 3. MRR Calculation
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("plan_type, status")
        .eq("status", "active")
        .eq("plan_type", "pro");

      const activeProCount = subscriptions?.length || 0;
      const mrr = activeProCount * 499.00;

      // 4. System Status (simple ping)
      const { error } = await supabase.from("companies").select("id").limit(1);
      
      return {
        totalCompanies: totalCompanies || 0,
        newCompanies: newCompanies || 0,
        mrr,
        systemStatus: error ? "Degradado" : "Operacional"
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Métricas em tempo real do ecossistema FatureAqui.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR Total</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(metrics?.mrr || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Assinaturas Pro: {(metrics?.mrr || 0) / 499}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Empresas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{metrics?.totalCompanies || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registadas no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Novos Registos (Mês)</CardTitle>
              <UserPlus className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{metrics?.newCompanies || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Desde o início do mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status do Sistema</CardTitle>
              <Activity className={metrics?.systemStatus === "Operacional" ? "h-4 w-4 text-emerald-500" : "h-4 w-4 text-red-500"} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metrics?.systemStatus === "Operacional" ? "text-emerald-600" : "text-red-600"}`}>
                {metrics?.systemStatus}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Conexão à Base de Dados</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
