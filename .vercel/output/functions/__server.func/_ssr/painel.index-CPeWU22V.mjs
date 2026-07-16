import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { D as Plus, J as FileText, R as LoaderCircle, _ as ShieldCheck, a as Users, bt as ArrowUpRight, d as TrendingUp, f as TrendingDown, i as Wallet, st as CircleDot } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
import { n as num, t as MT } from "./format-CcCWHv7m.mjs";
import { t as OnboardingChecklist } from "./onboarding-checklist-gD-a_19J.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.index-CPeWU22V.js
var import_jsx_runtime = require_jsx_runtime();
function statusStyle(s) {
	const status = s.toLowerCase();
	if (status === "pago") return "bg-primary-soft text-primary-soft-foreground";
	if (status === "pendente") return "bg-warning/15 text-warning-foreground border border-warning/30";
	if (status === "cancelado") return "bg-destructive/10 text-destructive border border-destructive/20";
	return "bg-muted text-muted-foreground";
}
function DashboardPage() {
	const { user } = useAuth();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
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
	const currentMonthDocs = documents.filter((d) => {
		if (!d.date) return false;
		const date = new Date(d.date);
		return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
	});
	const facturacaoMes = currentMonthDocs.filter((d) => (d.type === "FT" || d.type === "VD") && d.status !== "cancelado").reduce((sum, d) => sum + (d.total || 0), 0);
	const faturasEmitidas = currentMonthDocs.filter((d) => (d.type === "FT" || d.type === "VD") && d.status !== "cancelado").length;
	const uniqueClients = new Set(currentMonthDocs.map((d) => d.client_name)).size;
	const emDivida = documents.filter((d) => d.type === "FT" && (d.status === "pendente" || d.status === "emitido")).reduce((sum, d) => sum + (d.total || 0), 0);
	const kpis = [
		{
			label: "Facturação do mês",
			value: MT(facturacaoMes),
			delta: 0,
			positive: true,
			icon: Wallet
		},
		{
			label: "Facturas emitidas",
			value: num(faturasEmitidas),
			delta: 0,
			positive: true,
			icon: FileText
		},
		{
			label: "Clientes activos",
			value: num(uniqueClients),
			delta: 0,
			positive: true,
			icon: Users
		},
		{
			label: "Em dívida",
			value: MT(emDivida),
			delta: 0,
			positive: false,
			icon: CircleDot
		}
	];
	const recentInvoices = documents.slice(0, 5);
	const monthlyTotals = new Array(12).fill(0);
	documents.forEach((d) => {
		if (d.date && (d.type === "FT" || d.type === "VD") && d.status !== "cancelado") {
			const date = new Date(d.date);
			if (date.getFullYear() === currentYear) monthlyTotals[date.getMonth()] += (d.total || 0) / 1e3;
		}
	});
	const salesData = [
		"Jan",
		"Fev",
		"Mar",
		"Abr",
		"Mai",
		"Jun",
		"Jul",
		"Ago",
		"Set",
		"Out",
		"Nov",
		"Dez"
	].map((m, index) => ({
		m,
		v: Number(monthlyTotals[index].toFixed(2))
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
		title: "Dashboard",
		subtitle: "Aqui está o resumo do seu negócio hoje",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/painel/facturacao/nova",
			className: "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova factura"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingChecklist, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Certificado pela AT"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground",
						children: "ERP 100% Online"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-xs text-muted-foreground",
						children: "Último envio à AT: hoje às 09:14"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: k.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-2xl font-extrabold tracking-tight text-foreground tabular",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) : k.value
						}),
						!isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1 text-xs font-semibold",
							children: [
								k.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: k.positive ? "text-primary" : "text-destructive",
									children: [
										k.positive ? "+" : "-",
										k.delta,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "vs mês anterior"
								})
							]
						})
					]
				}, k.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-foreground",
						children: "Vendas do ano"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Facturação mensal em milhares de MT"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 rounded-full bg-muted p-1 text-xs font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-full px-3 py-1 text-muted-foreground",
								children: "Semana"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-full px-3 py-1 text-muted-foreground",
								children: "Mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-full bg-card px-3 py-1 text-foreground shadow-soft",
								children: "Ano"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: salesData,
						margin: {
							left: -20,
							right: 8,
							top: 8,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "fillGreen",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--color-primary)",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--color-primary)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "m",
								stroke: "var(--color-muted-foreground)",
								fontSize: 11,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--color-muted-foreground)",
								fontSize: 11,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 12,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "v",
								stroke: "var(--color-primary)",
								strokeWidth: 2.5,
								fill: "url(#fillGreen)"
							})
						]
					}) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-foreground",
						children: "Últimas facturas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Movimento das últimas 24 horas"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
						children: ["Ver tudo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Nº Factura"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Cliente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Valor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Estado"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-5 py-8 text-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A carregar faturas..." })]
							})
						}) }) : recentInvoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-5 py-8 text-center text-muted-foreground",
							children: "Nenhum documento encontrado."
						}) }) : recentInvoices.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 font-mono text-xs font-semibold text-foreground",
									children: r.number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 text-foreground",
									children: r.client_name
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
				})]
			})
		]
	})] });
}
//#endregion
export { DashboardPage as component };
