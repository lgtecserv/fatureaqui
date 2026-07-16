import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as CreditCard, Ct as Activity, R as LoaderCircle, gt as Building2, s as UserPlus } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-TPblqGAT.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboardPage() {
	const { data: metrics, isLoading } = useQuery({
		queryKey: ["admin-metrics"],
		queryFn: async () => {
			const { count: totalCompanies } = await supabase.from("companies").select("*", {
				count: "exact",
				head: true
			});
			const startOfMonth = /* @__PURE__ */ new Date();
			startOfMonth.setDate(1);
			startOfMonth.setHours(0, 0, 0, 0);
			const { count: newCompanies } = await supabase.from("companies").select("*", {
				count: "exact",
				head: true
			}).gte("created_at", startOfMonth.toISOString());
			const { data: subscriptions } = await supabase.from("subscriptions").select("plan_type, status").eq("status", "active").eq("plan_type", "pro");
			const mrr = (subscriptions?.length || 0) * 499;
			const { error } = await supabase.from("companies").select("id").limit(1);
			return {
				totalCompanies: totalCompanies || 0,
				newCompanies: newCompanies || 0,
				mrr,
				systemStatus: error ? "Degradado" : "Operacional"
			};
		},
		refetchInterval: 3e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Visão Geral"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Métricas em tempo real do ecossistema FatureAqui."
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-64 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-medium text-muted-foreground",
						children: "MRR Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-bold text-slate-900",
					children: new Intl.NumberFormat("pt-MZ", {
						style: "currency",
						currency: "MZN"
					}).format(metrics?.mrr || 0)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: ["Assinaturas Pro: ", (metrics?.mrr || 0) / 499]
				})] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-medium text-muted-foreground",
						children: "Empresas Ativas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-bold text-slate-900",
					children: metrics?.totalCompanies || 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Registadas no sistema"
				})] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-medium text-muted-foreground",
						children: "Novos Registos (Mês)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 text-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-bold text-slate-900",
					children: metrics?.newCompanies || 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Desde o início do mês"
				})] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-medium text-muted-foreground",
						children: "Status do Sistema"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: metrics?.systemStatus === "Operacional" ? "h-4 w-4 text-emerald-500" : "h-4 w-4 text-red-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `text-2xl font-bold ${metrics?.systemStatus === "Operacional" ? "text-emerald-600" : "text-red-600"}`,
					children: metrics?.systemStatus
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Conexão à Base de Dados"
				})] })] })
			]
		})]
	});
}
//#endregion
export { AdminDashboardPage as component };
