import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { R as LoaderCircle, Y as Eye, n as X, nt as Clock, pt as Check } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.faturacao-DDjN5pNr.js
var import_jsx_runtime = require_jsx_runtime();
function AdminFaturacaoPage() {
	const queryClient = useQueryClient();
	const { data: pendingRequests, isLoading } = useQuery({
		queryKey: ["pending-subscriptions"],
		queryFn: async () => {
			const { data: subs, error: subsError } = await supabase.from("subscriptions").select("*").eq("status", "pendente");
			if (subsError) throw subsError;
			if (!subs || subs.length === 0) return [];
			const userIds = subs.map((s) => s.user_id);
			const { data: companies, error: compError } = await supabase.from("companies").select("*").in("user_id", userIds);
			if (compError) throw compError;
			return subs.map((sub) => {
				const company = companies?.find((c) => c.user_id === sub.user_id);
				return {
					...sub,
					company
				};
			});
		}
	});
	const approveMutation = useMutation({
		mutationFn: async (id) => {
			const newValidUntil = /* @__PURE__ */ new Date();
			newValidUntil.setDate(newValidUntil.getDate() + 30);
			const { error } = await supabase.from("subscriptions").update({
				status: "ativo",
				plan_type: "pro",
				valid_until: newValidUntil.toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pending-subscriptions"] });
			queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
		}
	});
	const rejectMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("subscriptions").update({
				status: "rejected",
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pending-subscriptions"] });
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[calc(100vh-100px)] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Aprovação de Pagamentos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Verifique os comprovativos enviados e ative o plano Pro (+30 dias)."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
			"Pagamentos Pendentes (",
			pendingRequests?.length || 0,
			")"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Empresas que aguardam validação do comprovativo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: pendingRequests?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-12 text-center text-slate-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mb-4 h-12 w-12 text-slate-300" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-medium text-slate-900",
					children: "Nenhum pagamento pendente"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Todas as solicitações já foram processadas."
				})
			]
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
							children: "Data do Pedido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Comprovativo / Notas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-medium",
							children: "Ações"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-slate-200 bg-white",
					children: pendingRequests?.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-slate-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-4 font-medium text-slate-900",
								children: [req.company?.name || "Empresa Desconhecida", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-slate-500 font-normal",
									children: ["NUIT: ", req.company?.nuit || "N/A"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-4 text-slate-600",
								children: [req.company?.email, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500",
									children: req.company?.phone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-4 text-slate-600",
								children: new Date(req.updated_at).toLocaleDateString("pt-PT", {
									day: "2-digit",
									month: "long",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [req.receipt_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: req.receipt_url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1.5 text-primary hover:underline font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), "Ver Ficheiro"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "Sem ficheiro"
									}), req.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 rounded-md bg-amber-50 p-2 text-xs text-amber-800 border border-amber-100",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Nota:"
											}),
											" ",
											req.notes
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-red-600 hover:bg-red-50 hover:text-red-700",
										onClick: () => rejectMutation.mutate(req.id),
										disabled: rejectMutation.isPending || approveMutation.isPending,
										children: [rejectMutation.isPending && rejectMutation.variables === req.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1.5 h-4 w-4" }), "Rejeitar"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "bg-emerald-600 hover:bg-emerald-700 text-white",
										onClick: () => approveMutation.mutate(req.id),
										disabled: approveMutation.isPending || rejectMutation.isPending,
										children: [approveMutation.isPending && approveMutation.variables === req.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 h-4 w-4" }), "Aprovar Pagamento"]
									})]
								})
							})
						]
					}, req.id))
				})]
			})
		}) })] })]
	});
}
//#endregion
export { AdminFaturacaoPage as component };
