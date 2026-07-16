import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Wallet,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CircleDot,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Topbar } from "@/components/topbar";
import { MT, num } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Document } from "@/types";
import { Loader2 } from "lucide-react";

import { OnboardingChecklist } from "@/components/onboarding-checklist";

export const Route = createFileRoute("/painel/")({
  component: DashboardPage,
});



function statusStyle(s: string) {
  const status = s.toLowerCase();
  if (status === "pago") return "bg-primary-soft text-primary-soft-foreground";
  if (status === "pendente") return "bg-warning/15 text-warning-foreground border border-warning/30";
  if (status === "cancelado") return "bg-destructive/10 text-destructive border border-destructive/20";
  return "bg-muted text-muted-foreground";
}

function DashboardPage() {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (!company) return [];

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!user,
  });

  // Calculate KPIs
  const currentMonthDocs = documents.filter((d) => {
    if (!d.date) return false;
    const date = new Date(d.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const facturacaoMes = currentMonthDocs
    .filter(d => (d.type === 'FT' || d.type === 'VD') && d.status !== 'cancelado')
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const faturasEmitidas = currentMonthDocs
    .filter(d => (d.type === 'FT' || d.type === 'VD') && d.status !== 'cancelado')
    .length;

  const uniqueClients = new Set(currentMonthDocs.map(d => d.client_name)).size;

  const emDivida = documents
    .filter(d => d.type === 'FT' && (d.status === 'pendente' || d.status === 'emitido'))
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const kpis = [
    { label: "Facturação do mês", value: MT(facturacaoMes), delta: 0, positive: true, icon: Wallet },
    { label: "Facturas emitidas", value: num(faturasEmitidas), delta: 0, positive: true, icon: FileText },
    { label: "Clientes activos", value: num(uniqueClients), delta: 0, positive: true, icon: Users },
    { label: "Em dívida", value: MT(emDivida), delta: 0, positive: false, icon: CircleDot },
  ];

  const recentInvoices = documents.slice(0, 5);

  const monthlyTotals = new Array(12).fill(0);
  documents.forEach(d => {
    if (d.date && (d.type === 'FT' || d.type === 'VD') && d.status !== 'cancelado') {
      const date = new Date(d.date);
      if (date.getFullYear() === currentYear) {
        monthlyTotals[date.getMonth()] += (d.total || 0) / 1000; // In thousands
      }
    }
  });

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const salesData = months.map((m, index) => ({
    m,
    v: Number(monthlyTotals[index].toFixed(2)),
  }));

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Aqui está o resumo do seu negócio hoje"
        actions={
          <Link
            to="/painel/facturacao/nova"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Nova factura
          </Link>
        }
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
        <OnboardingChecklist />

        {/* Banda superior estilo Mozeconomia */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Certificado pela AT
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
            ERP 100% Online
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            Último envio à AT: hoje às 09:14
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </span>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <k.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-extrabold tracking-tight text-foreground tabular">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : k.value}
              </div>
              {!isLoading && (
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
                  {k.positive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={k.positive ? "text-primary" : "text-destructive"}>
                    {k.positive ? "+" : "-"}
                    {k.delta}%
                  </span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              )}
            </div>
          ))}
        </div>


        {/* Gráfico de vendas */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Vendas do ano</h3>
                <p className="text-xs text-muted-foreground">Facturação mensal em milhares de MT</p>
              </div>
              <div className="flex gap-1 rounded-full bg-muted p-1 text-xs font-semibold">
                <button className="rounded-full px-3 py-1 text-muted-foreground">Semana</button>
                <button className="rounded-full px-3 py-1 text-muted-foreground">Mês</button>
                <button className="rounded-full bg-card px-3 py-1 text-foreground shadow-soft">
                  Ano
                </button>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <AreaChart data={salesData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="m"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#fillGreen)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Últimas facturas */}
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-base font-bold text-foreground">Últimas facturas</h3>
              <p className="text-xs text-muted-foreground">Movimento das últimas 24 horas</p>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Ver tudo <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Nº Factura</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3 text-right">Valor</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>A carregar faturas...</span>
                      </div>
                    </td>
                  </tr>
                ) : recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      Nenhum documento encontrado.
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-foreground">
                        {r.number}
                      </td>
                      <td className="px-5 py-3.5 text-foreground">{r.client_name}</td>
                      <td className="px-5 py-3.5 text-right font-bold tabular text-foreground">
                        {MT(r.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(
                            r.status,
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
