import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { $ as CreditCard, R as LoaderCircle, gt as Building2, l as Upload, lt as CircleCheckBig, nt as Clock, xt as ArrowRight, yt as Banknote } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.assinatura-GNBYGvqN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssinaturaPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const uploadSectionRef = (0, import_react.useRef)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)("");
	const { data: settings } = useQuery({
		queryKey: ["system-settings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("system_settings").select("*").limit(1).single();
			if (error && error.code !== "PGRST116") throw error;
			return data;
		}
	});
	const { data: subscription, isLoading: isSubLoading } = useQuery({
		queryKey: ["subscription", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
			return data;
		},
		enabled: !!user
	});
	const submitReceipt = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Não autenticado");
			if (!file) throw new Error("Selecione um comprovativo primeiro");
			const fileExt = file.name.split(".").pop();
			const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `${user.id}/${fileName}`;
			const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file);
			if (uploadError) throw new Error("Erro ao fazer upload do ficheiro");
			const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(filePath);
			const { error: dbError } = await supabase.from("subscriptions").upsert({
				user_id: user.id,
				plan_type: "pro",
				status: "pendente",
				receipt_url: publicUrl,
				notes: notes || null,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "user_id" });
			if (dbError) throw dbError;
			return true;
		},
		onSuccess: () => {
			toast.success("Comprovativo enviado com sucesso! Aguarde aprovação.");
			setFile(null);
			setNotes("");
			queryClient.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err) => {
			toast.error(err.message || "Erro ao enviar comprovativo.");
		}
	});
	const now = /* @__PURE__ */ new Date();
	const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
	const isExpired = validUntil ? now > validUntil : false;
	const isPro = (subscription?.status === "ativo" || subscription?.status === "active") && !isExpired;
	const isPending = subscription?.status === "pendente";
	const daysLeft = isPro && validUntil ? Math.ceil((validUntil.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)) : 0;
	const canRenew = isPro && daysLeft <= 5;
	const plans = [{
		name: "Gratuito",
		price: "0 MT",
		features: [
			settings?.free_plan_docs_limit === 0 ? "Documentos ilimitados" : `${settings?.free_plan_docs_limit || 5} documentos/mês`,
			"1 tipo de documento",
			"Suporte por email"
		],
		current: !isPro && !isPending
	}, {
		name: "Pro",
		price: settings?.pro_price ? `${new Intl.NumberFormat("pt-MZ").format(settings.pro_price)} MT/mês` : "1.500 MT/mês",
		features: [
			"Documentos ilimitados",
			"Todos os 7 tipos de documento",
			"Geração de PDF",
			"Suporte prioritário",
			"Múltiplos utilizadores"
		],
		current: isPro,
		recommended: !isPro
	}];
	const scrollToUpload = () => {
		uploadSectionRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
		title: "Assinatura",
		subtitle: "Gerencie o seu plano de subscrição"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-3 rounded-2xl border p-5 shadow-soft ${isPending ? "border-amber-200 bg-amber-50" : "border-border bg-card"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isPending ? "bg-amber-100 text-amber-600" : "bg-primary-soft text-primary-soft-foreground"}`,
					children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground",
						children: ["Plano actual: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: isPending ? "text-amber-700" : "text-primary",
							children: isPro ? "Pro" : "Gratuito"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Status:",
							" ",
							isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 font-semibold text-amber-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " Pendente de Aprovação"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), " Activo"]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative rounded-2xl border bg-card p-6 shadow-soft transition ${plan.recommended ? "border-primary shadow-elevated" : "border-border"}`,
					children: [
						plan.recommended && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground",
							children: "Recomendado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-extrabold text-foreground",
							children: plan.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-extrabold tabular text-foreground",
							children: plan.price
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: plan.features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 shrink-0 text-primary" }), f]
							}, i))
						}),
						plan.name === "Pro" && !isPro && !isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: scrollToUpload,
							className: "mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-95 transition",
							children: ["Fazer upgrade ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						}),
						plan.name === "Pro" && canRenew && !isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: scrollToUpload,
							className: "mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-primary-soft text-primary-soft-foreground text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition",
							children: [
								"Renovar Plano (",
								daysLeft,
								" dias restantes) ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
							]
						}),
						plan.current && !canRenew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "mt-6 flex h-11 w-full items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-muted-foreground transition",
							disabled: true,
							children: isPro && plan.name === "Pro" ? `Plano actual (${daysLeft} dias)` : "Plano actual"
						})
					]
				}, plan.name))
			}),
			(!isPro || canRenew) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: uploadSectionRef,
				className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden mt-8 scroll-mt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-50 p-6 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-foreground mb-4",
						children: "Instruções de Pagamento"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 sm:grid-cols-2 md:grid-cols-3",
						children: [
							(settings?.mpesa_number || settings?.mpesa_name) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 rounded-lg bg-red-100 p-2 text-red-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-slate-900",
									children: "M-Pesa"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 space-y-1 text-sm text-slate-600",
									children: [settings.mpesa_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Número: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.mpesa_number
									})] }), settings.mpesa_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Nome: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.mpesa_name
									})] })]
								})] })]
							}),
							(settings?.emola_number || settings?.emola_name) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 rounded-lg bg-orange-100 p-2 text-orange-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-slate-900",
									children: "e-Mola"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 space-y-1 text-sm text-slate-600",
									children: [settings.emola_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Número: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.emola_number
									})] }), settings.emola_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Nome: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.emola_name
									})] })]
								})] })]
							}),
							(settings?.bank_account || settings?.bank_nib) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-slate-900",
									children: settings.bank_name || "Transferência Bancária"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 space-y-1 text-sm text-slate-600",
									children: [settings.bank_account && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Conta: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.bank_account
									})] }), settings.bank_nib && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["NIB: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-900",
										children: settings.bank_nib
									})] })]
								})] })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6",
					children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-8 text-center bg-amber-50 rounded-xl border border-amber-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-8 w-8" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-slate-900",
								children: "Comprovativo em Análise"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-md text-slate-600",
								children: "Recebemos o seu comprovativo e estamos a verificar o pagamento. A sua conta Pro será ativada brevemente."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground",
								children: "Enviar comprovativo de pagamento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Após efectuar o pagamento, envie o comprovativo para activar o plano Pro."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-semibold text-slate-700",
										children: "Comprovativo (PDF, JPG, PNG)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-slate-50 px-6 py-4 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary hover:bg-primary-soft/10 w-full",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }),
												file ? file.name : "Clique para anexar ficheiro",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/png, image/jpeg, application/pdf",
													className: "sr-only",
													onChange: (e) => setFile(e.target.files?.[0] || null)
												})
											]
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-semibold text-slate-700",
										children: "Notas Adicionais (Opcional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										placeholder: "Ex: Pagamento feito a partir do número 84...",
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										className: "w-full h-[60px] rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 border-t border-border flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => submitReceipt.mutate(),
									disabled: submitReceipt.isPending || !file,
									className: "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition",
									children: submitReceipt.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Enviar para Aprovação"
								})
							})
						]
					})
				})]
			})
		]
	})] });
}
//#endregion
export { AssinaturaPage as component };
