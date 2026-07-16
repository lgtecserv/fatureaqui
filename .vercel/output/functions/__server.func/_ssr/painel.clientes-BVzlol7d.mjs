import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { D as Plus, F as Mail, O as Phone, R as LoaderCircle, S as Search, a as Users } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
import { t as MT } from "./format-CcCWHv7m.mjs";
import { t as ClientModal } from "./client-modal-CnjiXE4R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.clientes-BVzlol7d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function initials(name) {
	return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function ClientesPage() {
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [companyId, setCompanyId] = (0, import_react.useState)("");
	const { data: clients = [], isLoading } = useQuery({
		queryKey: ["clients", user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data: company } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
			if (!company) return [];
			setCompanyId(company.id);
			const { data, error } = await supabase.from("clients").select("*").eq("company_id", company.id).order("name", { ascending: true });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
			title: "Clientes",
			subtitle: "Gestão de clientes e histórico de facturação",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setIsModalOpen(true),
				className: "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo cliente"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientModal, {
			isOpen: isModalOpen,
			onClose: () => setIsModalOpen(false),
			companyId
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "search",
					placeholder: "Buscar por nome, NUIT ou contacto…",
					className: "h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mb-4 h-8 w-8 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A carregar clientes..." })]
			}) : clients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-4 h-10 w-10 opacity-20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-foreground",
						children: "Sem clientes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: "Não encontrou nenhum cliente. Comece por adicionar um."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsModalOpen(true),
						className: "mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar Cliente"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-primary/40 hover:shadow-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-sm font-extrabold text-primary-soft-foreground",
								children: initials(c.name)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate text-base font-bold text-foreground",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 font-mono text-xs text-muted-foreground",
									children: ["NUIT ", c.nuit || "—"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: c.phone || "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: c.email || "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-end justify-between border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Total facturado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-lg font-extrabold tabular text-foreground",
								children: MT(c.total_invoiced || 0)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground",
								children: "Ver"
							})]
						})
					]
				}, c.id))
			})]
		})
	] });
}
//#endregion
export { ClientesPage as component };
