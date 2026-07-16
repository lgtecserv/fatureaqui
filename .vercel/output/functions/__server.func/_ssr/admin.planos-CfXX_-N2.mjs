import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { $ as CreditCard, R as LoaderCircle, gt as Building2, w as Save, yt as Banknote } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.planos-CfXX_-N2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPlanosPage() {
	const queryClient = useQueryClient();
	const [formData, setFormData] = (0, import_react.useState)({
		pro_price: 499,
		mpesa_number: "",
		mpesa_name: "",
		emola_number: "",
		emola_name: "",
		bank_nib: "",
		bank_name: "",
		bank_account: ""
	});
	const { data: settings, isLoading } = useQuery({
		queryKey: ["system-settings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("system_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
			if (error && error.code !== "PGRST116") throw error;
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (settings) setFormData({
			pro_price: settings.pro_price || 499,
			mpesa_number: settings.mpesa_number || "",
			mpesa_name: settings.mpesa_name || "",
			emola_number: settings.emola_number || "",
			emola_name: settings.emola_name || "",
			bank_nib: settings.bank_nib || "",
			bank_name: settings.bank_name || "",
			bank_account: settings.bank_account || ""
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
			queryClient.invalidateQueries({ queryKey: ["system-settings"] });
			toast.success("Configurações atualizadas com sucesso!");
		},
		onError: () => {
			toast.error("Erro ao atualizar as configurações. Verifique as suas permissões.");
		}
	});
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "pro_price" ? parseFloat(value) || 0 : value
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
				children: "Planos & Subscrições"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Configure o preço e os métodos de pagamento visíveis para as empresas."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "grid gap-6 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-primary" }), "Regras do Plano Pro"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "O valor base para utilização do sistema sem limites." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "pro_price",
									children: "Preço Mensal (MT)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pro_price",
									name: "pro_price",
									type: "number",
									step: "0.01",
									value: formData.pro_price,
									onChange: handleChange,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "O cálculo automático do MRR usará este valor."
								})
							]
						})
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5 text-primary" }), "Dados do M-Pesa"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Esta informação aparecerá na página de pagamento do cliente." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "mpesa_number",
								children: "Número de Telemóvel (M-Pesa)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "mpesa_number",
								name: "mpesa_number",
								placeholder: "Ex: 840000000",
								value: formData.mpesa_number,
								onChange: handleChange
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "mpesa_name",
								children: "Nome Titular (M-Pesa)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "mpesa_name",
								name: "mpesa_name",
								placeholder: "Nome registado no M-Pesa",
								value: formData.mpesa_name,
								onChange: handleChange
							})]
						})]
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5 text-red-600" }), "Dados do e-Mola"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Esta informação aparecerá na página de pagamento do cliente." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "emola_number",
								children: "Número de Telemóvel (e-Mola)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "emola_number",
								name: "emola_number",
								placeholder: "Ex: 860000000",
								value: formData.emola_number,
								onChange: handleChange
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "emola_name",
								children: "Nome Titular (e-Mola)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "emola_name",
								name: "emola_name",
								placeholder: "Nome registado no e-Mola",
								value: formData.emola_name,
								onChange: handleChange
							})]
						})]
					}) })] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }), "Transferência Bancária"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Dados bancários para envio de comprovativos." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "bank_name",
								children: "Nome do Banco"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "bank_name",
								name: "bank_name",
								placeholder: "Ex: Millennium BIM, BCI",
								value: formData.bank_name,
								onChange: handleChange
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "bank_account",
								children: "Número da Conta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "bank_account",
								name: "bank_account",
								placeholder: "Ex: 12345678",
								value: formData.bank_account,
								onChange: handleChange
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "bank_nib",
								children: "NIB"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "bank_nib",
								name: "bank_nib",
								placeholder: "Opcional",
								value: formData.bank_nib,
								onChange: handleChange
							})]
						})
					]
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						className: "gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto",
						disabled: updateMutation.isPending,
						children: [updateMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), updateMutation.isPending ? "A Guardar..." : "Guardar Configurações"]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { AdminPlanosPage as component };
