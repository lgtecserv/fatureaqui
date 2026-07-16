import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { C as Scale, J as FileText, R as LoaderCircle, W as Globe, _ as ShieldCheck, k as Percent, w as Save } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.configuracoes-1gbTIvK4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function AdminConfiguracoesPage() {
	const queryClient = useQueryClient();
	const [formData, setFormData] = (0, import_react.useState)({
		app_name: "FatureAqui",
		support_email: "",
		support_phone: "",
		free_plan_docs_limit: 5,
		trial_days: 0,
		default_tax_rate: 16,
		currency: "MZN",
		maintenance_mode: false,
		terms_url: "",
		privacy_url: ""
	});
	const { data: settings, isLoading } = useQuery({
		queryKey: ["system-settings-global"],
		queryFn: async () => {
			const { data, error } = await supabase.from("system_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
			if (error && error.code !== "PGRST116") throw error;
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (settings) setFormData({
			app_name: settings.app_name ?? "FatureAqui",
			support_email: settings.support_email ?? "",
			support_phone: settings.support_phone ?? "",
			free_plan_docs_limit: settings.free_plan_docs_limit ?? 5,
			trial_days: settings.trial_days ?? 0,
			default_tax_rate: settings.default_tax_rate ?? 16,
			currency: settings.currency ?? "MZN",
			maintenance_mode: settings.maintenance_mode ?? false,
			terms_url: settings.terms_url ?? "",
			privacy_url: settings.privacy_url ?? ""
		});
	}, [settings]);
	const updateMutation = useMutation({
		mutationFn: async (newData) => {
			const { error } = await supabase.from("system_settings").update({
				...newData,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", "00000000-0000-0000-0000-000000000001");
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["system-settings-global"] });
			toast.success("Configurações globais guardadas com sucesso!");
		},
		onError: () => {
			toast.error("Erro ao guardar. Verifique se executou a migração SQL no Supabase.");
		}
	});
	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "number" ? parseFloat(value) || 0 : value
		}));
	};
	const handleSwitchChange = (checked) => {
		setFormData((prev) => ({
			...prev,
			maintenance_mode: checked
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		updateMutation.mutate(formData);
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[calc(100vh-100px)] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Configurações Globais"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Gerencie informações da plataforma, limites do plano gratuito e segurança."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-8 max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "geral",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-8 bg-slate-100 p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "geral",
								className: "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6",
								children: "Geral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "limites",
								className: "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6",
								children: "Limites & Planos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "faturacao",
								className: "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6",
								children: "Impostos & Moeda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "legal",
								className: "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6",
								children: "Legal & Segurança"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "geral",
						className: "mt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 text-primary" }), "Informações da Plataforma"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Dados públicos que podem aparecer para os clientes das empresas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "app_name",
									children: "Nome da Aplicação"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "app_name",
									name: "app_name",
									value: formData.app_name,
									onChange: handleChange,
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "support_email",
										children: "Email de Suporte"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "support_email",
										name: "support_email",
										type: "email",
										placeholder: "suporte@exemplo.com",
										value: formData.support_email,
										onChange: handleChange
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "support_phone",
										children: "Telefone de Suporte"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "support_phone",
										name: "support_phone",
										placeholder: "+258 8X XXX XXXX",
										value: formData.support_phone,
										onChange: handleChange
									})]
								})]
							})]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "limites",
						className: "mt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-primary" }), "Limites do Plano Gratuito"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Defina os limites para empresas que não têm o plano Pro ativo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2 max-w-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "free_plan_docs_limit",
											children: "Nº Máximo de Documentos / Mês"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "free_plan_docs_limit",
											name: "free_plan_docs_limit",
											type: "number",
											min: "0",
											value: formData.free_plan_docs_limit,
											onChange: handleChange
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Coloque 0 para ilimitado."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "trial_days",
											children: "Dias de Período de Teste (Trial)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "trial_days",
											name: "trial_days",
											type: "number",
											min: "0",
											value: formData.trial_days,
											onChange: handleChange
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Dias de plano Pro gratuitos ao registar."
										})
									]
								})]
							})
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "faturacao",
						className: "mt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-5 w-5 text-primary" }), "Impostos e Moeda Padrão"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Valores base aplicados quando uma nova empresa é criada." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2 max-w-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "default_tax_rate",
										children: "Taxa de IVA Padrão (%)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "default_tax_rate",
										name: "default_tax_rate",
										type: "number",
										step: "0.1",
										min: "0",
										value: formData.default_tax_rate,
										onChange: handleChange
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "currency",
										children: "Moeda Base"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "currency",
										name: "currency",
										value: formData.currency,
										onChange: handleChange,
										placeholder: "MT ou MZN"
									})]
								})]
							})
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "legal",
						className: "mt-0 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-5 w-5 text-primary" }), "Links Legais"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Links para as páginas legais da sua empresa." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "terms_url",
									children: "URL dos Termos de Serviço"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "terms_url",
									name: "terms_url",
									type: "url",
									placeholder: "https://exemplo.com/termos",
									value: formData.terms_url,
									onChange: handleChange
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "privacy_url",
									children: "URL da Política de Privacidade"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "privacy_url",
									name: "privacy_url",
									type: "url",
									placeholder: "https://exemplo.com/privacidade",
									value: formData.privacy_url,
									onChange: handleChange
								})]
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-red-200 bg-red-50/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "flex items-center gap-2 text-red-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" }), "Modo de Segurança / Manutenção"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-red-600/80",
								children: "Bloqueie temporariamente o acesso de todas as empresas ao sistema (para atualizações)."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border border-red-200 bg-white p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-base font-semibold",
										children: "Ativar Modo de Manutenção"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-500",
										children: "O Super Admin continuará a ter acesso, mas as empresas verão uma página de manutenção."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: formData.maintenance_mode,
									onCheckedChange: handleSwitchChange
								})]
							}) })]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end pt-4 border-t border-border mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "lg",
					className: "gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto",
					disabled: updateMutation.isPending,
					children: [updateMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), updateMutation.isPending ? "A Guardar..." : "Guardar Configurações"]
				})
			})]
		})]
	});
}
//#endregion
export { AdminConfiguracoesPage as component };
