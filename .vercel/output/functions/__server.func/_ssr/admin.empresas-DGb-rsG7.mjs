import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { R as LoaderCircle, S as Search, gt as Building2, ut as CircleAlert } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.empresas-DGb-rsG7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminEmpresasPage() {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const { data: companies, isLoading } = useQuery({
		queryKey: ["admin-companies"],
		queryFn: async () => {
			const { data: comps, error: compError } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
			if (compError) throw compError;
			if (!comps || comps.length === 0) return [];
			const userIds = comps.map((c) => c.user_id);
			const { data: subs, error: subsError } = await supabase.from("subscriptions").select("*").in("user_id", userIds);
			if (subsError) throw subsError;
			return comps.map((comp) => {
				const subscription = subs?.find((s) => s.user_id === comp.user_id);
				return {
					...comp,
					subscription
				};
			});
		}
	});
	const filteredCompanies = companies?.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.nuit.includes(searchTerm) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));
	const isExpired = (validUntil) => {
		if (!validUntil) return false;
		return new Date(validUntil) < /* @__PURE__ */ new Date();
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[calc(100vh-100px)] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Gestão de Empresas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Controlo de inquilinos e estado das subscrições."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full sm:w-72",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Procurar por nome, NUIT ou email...",
					className: "pl-9 bg-white",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
			"Empresas Registadas (",
			companies?.length || 0,
			")"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Lista de todas as empresas que utilizam o FatureAqui." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: filteredCompanies?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-12 text-center text-slate-500",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mb-4 h-12 w-12 text-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium text-slate-900",
				children: "Nenhuma empresa encontrada"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 text-slate-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Empresa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Contacto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Plano Atual"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Válido Até (30 Dias)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-slate-200 bg-white",
					children: filteredCompanies?.map((comp) => {
						const expired = isExpired(comp.subscription?.valid_until);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 font-medium text-slate-900",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white overflow-hidden",
											children: comp.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: comp.logo_url,
												alt: comp.name,
												className: "h-full w-full object-contain"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-slate-300" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: comp.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-slate-500 font-normal",
											children: ["NUIT: ", comp.nuit || "N/A"]
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-4 text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: comp.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-500",
										children: comp.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4",
									children: comp.subscription?.plan_type === "pro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10",
										children: "Pro"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10",
										children: "Free / Trial"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 text-slate-600",
									children: comp.subscription?.valid_until ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: expired ? "text-red-600 font-medium flex items-center gap-1.5" : "",
										children: [expired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), new Date(comp.subscription.valid_until).toLocaleDateString("pt-PT")]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "Sem data"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4",
									children: comp.subscription?.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
										children: "Aguardando Pagamento"
									}) : expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10",
										children: "Expirado (Cortado)"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
										children: "Ativo"
									})
								})
							]
						}, comp.id);
					})
				})]
			})
		}) })] })]
	});
}
//#endregion
export { AdminEmpresasPage as component };
