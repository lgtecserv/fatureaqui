import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { D as Plus, G as Funnel, R as LoaderCircle, S as Search, Z as Download } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
import { t as MT } from "./format-CcCWHv7m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.facturacao.index-Y4Xfs4_U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOCUMENT_TYPES = [
	{
		id: "all",
		label: "Todos"
	},
	{
		id: "VD",
		label: "Venda a Dinheiro"
	},
	{
		id: "FT",
		label: "Fatura"
	},
	{
		id: "RC",
		label: "Recibo"
	},
	{
		id: "NC",
		label: "Nota de Crédito"
	},
	{
		id: "ND",
		label: "Nota de Débito"
	},
	{
		id: "CT",
		label: "Cotação"
	},
	{
		id: "GR",
		label: "Guia de Remessa"
	}
];
function statusStyle(s) {
	const status = s.toLowerCase();
	if (status === "pago") return "bg-primary-soft text-primary-soft-foreground";
	if (status === "pendente") return "bg-warning/15 text-warning-foreground border border-warning/30";
	if (status === "cancelado") return "bg-destructive/10 text-destructive border border-destructive/20";
	return "bg-muted text-muted-foreground";
}
function typeBadgeColor(t) {
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
	const [activeType, setActiveType] = (0, import_react.useState)("all");
	const { data: documents = [], isLoading } = useQuery({
		queryKey: ["documents", user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data: company } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
			if (!company) return [];
			const { data, error } = await supabase.from("documents").select("*").eq("company_id", company.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const todayDateString = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const facturadoHoje = documents.filter((d) => (d.type === "FT" || d.type === "VD") && d.status !== "cancelado" && d.date === todayDateString).reduce((sum, d) => sum + (d.total || 0), 0);
	const facturadoMes = documents.filter((d) => {
		if (!d.date) return false;
		const date = new Date(d.date);
		return (d.type === "FT" || d.type === "VD") && d.status !== "cancelado" && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
	}).reduce((sum, d) => sum + (d.total || 0), 0);
	const pendente = documents.filter((d) => d.type === "FT" && d.status === "pendente").reduce((sum, d) => sum + (d.total || 0), 0);
	const anuladoMes = documents.filter((d) => {
		if (!d.date) return false;
		const date = new Date(d.date);
		return d.status === "cancelado" && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
	}).reduce((sum, d) => sum + (d.total || 0), 0);
	const filtered = activeType === "all" ? documents : documents.filter((d) => d.type === activeType);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
		title: "Documentos",
		subtitle: "Emita e faça a gestão das suas facturas e recibos",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/painel/facturacao/nova",
			className: "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova factura"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
			children: [
				{
					l: "Facturado hoje",
					v: MT(facturadoHoje)
				},
				{
					l: "Facturado mês",
					v: MT(facturadoMes)
				},
				{
					l: "Pendente",
					v: MT(pendente)
				},
				{
					l: "Anulado mês",
					v: MT(anuladoMes)
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: s.l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-lg font-extrabold tabular text-foreground sm:text-xl",
					children: s.v
				})]
			}, s.l))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 border-b border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								placeholder: "Buscar por número, cliente ou NUIT…",
								className: "h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: DOCUMENT_TYPES.map((dt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveType(dt.id),
								className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeType === dt.id ? "bg-primary-soft text-primary-soft-foreground" : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
								children: dt.label
							}, dt.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), " Filtros"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Exportar"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Nº"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Tipo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Cliente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "NUIT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Estado"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-8 text-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A carregar documentos..." })]
							})
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-8 text-center text-muted-foreground",
							children: "Nenhum documento encontrado."
						}) }) : filtered.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `border-t border-border hover:bg-muted/40 ${i % 2 === 1 ? "bg-muted/20" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 font-mono text-xs font-semibold text-foreground",
									children: r.number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${typeBadgeColor(r.type)}`,
										children: r.type
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 font-medium text-foreground",
									children: r.client_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 font-mono text-xs text-muted-foreground",
									children: r.client_nuit || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 text-muted-foreground",
									children: r.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 text-right font-bold tabular text-foreground",
									children: MT(r.total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(r.status)}`,
										children: r.status
									})
								})
							]
						}, r.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"A mostrar ",
						filtered.length,
						" de ",
						documents.length,
						" documentos"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-lg border border-border px-3 py-1.5 font-semibold hover:border-primary/40 disabled:opacity-50",
							children: "Anterior"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground disabled:opacity-50",
							children: "Seguinte"
						})]
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { FacturacaoPage as component };
