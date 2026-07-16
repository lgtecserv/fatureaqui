import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as CreditCard, Ct as Activity, G as Funnel, R as LoaderCircle, S as Search, b as Settings2, gt as Building2, ht as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as format, t as pt } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.logs-g_t-UfB9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogsPage() {
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const { data: logs, isLoading } = useQuery({
		queryKey: ["system-logs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("system_logs").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		refetchInterval: 3e4
	});
	const getLogIcon = (eventType) => {
		if (eventType.includes("company")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
		});
		if (eventType.includes("subscription")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
		});
		if (eventType.includes("settings")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 ring-8 ring-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-5 w-5" })
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-8 ring-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" })
		});
	};
	const getLogTitle = (eventType) => {
		switch (eventType) {
			case "company_registered": return "Nova Empresa";
			case "subscription_requested": return "Pedido de Subscrição";
			case "subscription_approved": return "Subscrição Aprovada";
			case "subscription_cancelled": return "Subscrição Expirada";
			case "settings_updated": return "Configurações Alteradas";
			default: return "Evento de Sistema";
		}
	};
	const filteredLogs = logs?.filter((log) => {
		const matchesFilter = filterType === "all" || log.event_type.includes(filterType);
		const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesFilter && matchesSearch;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8 h-screen flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Histórico de Atividade"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Registo de auditoria e logs do sistema global (Gerado Automaticamente)."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 w-full sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("all"),
							className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
							children: "Todos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("company"),
							className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === "company" ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
							children: "Adesões"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("subscription"),
							className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === "subscription" ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
							children: "Subscrições"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilterType("settings"),
							className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === "settings" ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
							children: "Configurações"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Pesquisar nos logs...",
						className: "h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value)
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-4 sm:p-8",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
				}) : filteredLogs?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-slate-900",
							children: "Sem registos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-slate-500",
							children: "Ainda não existem eventos no sistema que correspondam à sua pesquisa. Os logs são criados automaticamente pela base de dados."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flow-root max-w-4xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						role: "list",
						className: "-mb-8",
						children: filteredLogs?.map((log, logIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative pb-8",
							children: [logIdx !== filteredLogs.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200",
								"aria-hidden": "true"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-start space-x-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative px-1",
									children: getLogIcon(log.event_type)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0 flex-1 py-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm text-slate-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-900",
												children: getLogTitle(log.event_type)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "whitespace-nowrap flex items-center gap-1.5 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3 w-3" }), format(new Date(log.created_at), "dd MMM yyyy 'às' HH:mm", { locale: pt })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-700 mt-2 bg-slate-50/80 p-3 rounded-lg border border-slate-100 leading-relaxed",
											children: log.description
										})]
									})
								})]
							})]
						}) }, log.id))
					})
				})
			})]
		})]
	});
}
//#endregion
export { AdminLogsPage as component };
