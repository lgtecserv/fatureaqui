import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Filter, Download, Search, Loader2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { MT } from "@/lib/format";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Document } from "@/types";

export const Route = createFileRoute("/painel/facturacao/")({
  component: FacturacaoPage,
});

const DOCUMENT_TYPES = [
  { id: "all", label: "Todos" },
  { id: "VD", label: "Venda a Dinheiro" },
  { id: "FT", label: "Fatura" },
  { id: "RC", label: "Recibo" },
  { id: "NC", label: "Nota de Crédito" },
  { id: "ND", label: "Nota de Débito" },
  { id: "CT", label: "Cotação" },
  { id: "GR", label: "Guia de Remessa" },
] as const;



function statusStyle(s: string) {
  const status = s.toLowerCase();
  if (status === "pago") return "bg-primary-soft text-primary-soft-foreground";
  if (status === "pendente") return "bg-warning/15 text-warning-foreground border border-warning/30";
  if (status === "cancelado") return "bg-destructive/10 text-destructive border border-destructive/20";
  return "bg-muted text-muted-foreground";
}

function typeBadgeColor(t: string) {
  switch (t) {
    case "FT": return "bg-primary-soft text-primary-soft-foreground";
    case "VD": return "bg-amber/15 text-amber-foreground";
    case "RC": return "bg-primary/10 text-primary";
    case "NC": return "bg-destructive/10 text-destructive";
    case "ND": return "bg-warning/15 text-warning-foreground";
    case "CT": return "bg-muted text-muted-foreground";
    case "GR": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

function FacturacaoPage() {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState("all");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get company first
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

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const todayDateString = new Date().toISOString().split('T')[0];

  const facturadoHoje = documents
    .filter(d => (d.type === 'FT' || d.type === 'VD') && d.status !== 'cancelado' && d.date === todayDateString)
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const facturadoMes = documents
    .filter(d => {
      if (!d.date) return false;
      const date = new Date(d.date);
      return (d.type === 'FT' || d.type === 'VD') && d.status !== 'cancelado' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const pendente = documents
    .filter(d => d.type === 'FT' && d.status === 'pendente')
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const anuladoMes = documents
    .filter(d => {
      if (!d.date) return false;
      const date = new Date(d.date);
      return d.status === 'cancelado' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + (d.total || 0), 0);

  const filtered = activeType === "all"
    ? documents
    : documents.filter((d) => d.type === activeType);

  return (
    <>
      <Topbar
        title="Documentos"
        subtitle="Emita e faça a gestão das suas facturas e recibos"
        actions={
          <Link
            to="/painel/facturacao/nova"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Nova factura
          </Link>
        }
      />

      <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { l: "Facturado hoje", v: MT(facturadoHoje) },
            { l: "Facturado mês", v: MT(facturadoMes) },
            { l: "Pendente", v: MT(pendente) },
            { l: "Anulado mês", v: MT(anuladoMes) },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.l}
              </div>
              <div className="mt-2 text-lg font-extrabold tabular text-foreground sm:text-xl">
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar por número, cliente ou NUIT…"
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DOCUMENT_TYPES.map((dt) => (
                <button
                  key={dt.id}
                  onClick={() => setActiveType(dt.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeType === dt.id
                      ? "bg-primary-soft text-primary-soft-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {dt.label}
                </button>
              ))}
            </div>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/40">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/40">
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Nº</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">NUIT</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>A carregar documentos...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                      Nenhum documento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-t border-border hover:bg-muted/40 ${
                        i % 2 === 1 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-foreground">
                        {r.number}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${typeBadgeColor(r.type)}`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{r.client_name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.client_nuit || "—"}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{r.date}</td>
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

          <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
            <span>A mostrar {filtered.length} de {documents.length} documentos</span>
            <div className="flex gap-1">
              <button className="rounded-lg border border-border px-3 py-1.5 font-semibold hover:border-primary/40 disabled:opacity-50">
                Anterior
              </button>
              <button className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground disabled:opacity-50">
                Seguinte
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
