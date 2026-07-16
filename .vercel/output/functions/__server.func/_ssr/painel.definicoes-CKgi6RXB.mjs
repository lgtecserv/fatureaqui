import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { L as Lock, R as LoaderCircle, gt as Building2, j as Palette, l as Upload, w as Save } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
import { t as StampGenerator } from "./stamp-generator-Dz8nj340.mjs";
import { t as OnboardingChecklist } from "./onboarding-checklist-gD-a_19J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.definicoes-CKgi6RXB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, defaultValue, hint, wide, type = "text", name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: wide ? "sm:col-span-2" : "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type,
				name,
				defaultValue,
				className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function ColorField({ label, defaultValue, onChange }) {
	const [color, setColor] = (0, import_react.useState)(defaultValue);
	const handleChange = (e) => {
		setColor(e.target.value);
		if (onChange) onChange(e.target.value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value: color,
			onChange: handleChange,
			className: "h-11 w-14 cursor-pointer rounded-xl border border-border bg-background p-1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "text",
			value: color,
			onChange: handleChange,
			className: "h-11 flex-1 rounded-xl border border-border bg-background px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		})]
	})] });
}
function DefinicoesPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = (0, import_react.useState)("empresa");
	const formRef = (0, import_react.useRef)(null);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [isUpdatingPassword, setIsUpdatingPassword] = (0, import_react.useState)(false);
	const [primaryColor, setPrimaryColor] = (0, import_react.useState)("");
	const [secondaryColor, setSecondaryColor] = (0, import_react.useState)("");
	const [stampStyle, setStampStyle] = (0, import_react.useState)("style1");
	const [useDigitalStamp, setUseDigitalStamp] = (0, import_react.useState)(true);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const { data: company, isLoading } = useQuery({
		queryKey: ["company", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data, error } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	(0, import_react.useEffect)(() => {
		if (company) {
			setPrimaryColor(company.primary_color || "");
			setSecondaryColor(company.secondary_color || "");
			setStampStyle(company.stamp_style || "style1");
			setUseDigitalStamp(company.use_digital_stamp !== false);
		}
	}, [company]);
	const updateCompany = useMutation({
		mutationFn: async (updates) => {
			if (!company) return;
			const { error } = await supabase.from("companies").update(updates).eq("id", company.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Definições atualizadas com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["company"] });
		},
		onError: () => {
			toast.error("Erro ao atualizar definições.");
		}
	});
	const handleSaveCompany = (e) => {
		e.preventDefault();
		if (!formRef.current) return;
		const formData = new FormData(formRef.current);
		const updates = {
			name: formData.get("name"),
			nuit: formData.get("nuit"),
			phone: formData.get("phone"),
			address: formData.get("address"),
			city: formData.get("city"),
			province: formData.get("province"),
			email: formData.get("email"),
			website: formData.get("website")
		};
		updateCompany.mutate(updates);
	};
	const handleUpdatePassword = async () => {
		if (newPassword !== confirmPassword) {
			toast.error("As senhas não coincidem.");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("A nova senha deve ter pelo menos 6 caracteres.");
			return;
		}
		setIsUpdatingPassword(true);
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		setIsUpdatingPassword(false);
		if (error) toast.error(error.message);
		else {
			toast.success("Senha atualizada com sucesso!");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		}
	};
	const handleSaveAppearance = () => {
		const newPrimary = primaryColor || company?.primary_color || "#02664D";
		const newSecondary = secondaryColor || company?.secondary_color || "#1E2A38";
		updateCompany.mutate({
			primary_color: newPrimary,
			secondary_color: newSecondary,
			stamp_style: stampStyle,
			use_digital_stamp: useDigitalStamp
		});
		const root = document.documentElement;
		const p = newPrimary;
		const s = newSecondary;
		root.style.setProperty("--primary", p);
		root.style.setProperty("--color-primary", p);
		const soft = `color-mix(in srgb, ${p} 15%, transparent)`;
		root.style.setProperty("--primary-soft", soft);
		root.style.setProperty("--color-primary-soft", soft);
		root.style.setProperty("--primary-foreground", "#ffffff");
		root.style.setProperty("--color-primary-foreground", "#ffffff");
		root.style.setProperty("--primary-soft-foreground", p);
		root.style.setProperty("--color-primary-soft-foreground", p);
		root.style.setProperty("--sidebar-primary", p);
		root.style.setProperty("--color-sidebar-primary", p);
		root.style.setProperty("--sidebar-ring", p);
		root.style.setProperty("--color-sidebar-ring", p);
		root.style.setProperty("--ring", p);
		root.style.setProperty("--color-ring", p);
		root.style.setProperty("--chart-1", p);
		root.style.setProperty("--color-chart-1", p);
		root.style.setProperty("--secondary", s);
		root.style.setProperty("--color-secondary", s);
	};
	const handleLogoUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file || !user || !company) return;
		if (file.size > 3 * 1024 * 1024) {
			toast.error("O logótipo deve ter no máximo 3MB.");
			return;
		}
		if (!file.type.startsWith("image/")) {
			toast.error("Por favor, selecione uma imagem válida (PNG, JPG, etc).");
			return;
		}
		setIsUploading(true);
		toast.info("A fazer upload do logótipo...");
		try {
			const fileExt = file.name.split(".").pop();
			const filePath = `public/${`${company.id}-${Math.random()}.${fileExt}`}`;
			const { error: uploadError } = await supabase.storage.from("logos").upload(filePath, file, { upsert: true });
			if (uploadError) throw uploadError;
			const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(filePath);
			updateCompany.mutate({ logo_url: publicUrl });
			toast.success("Logótipo carregado com sucesso!");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Erro ao carregar logótipo: " + error.message);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
		title: "Definições",
		subtitle: "Configure a sua empresa e conta"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingChecklist, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 rounded-full bg-muted p-1",
				children: [
					{
						id: "empresa",
						label: "Dados da Empresa",
						icon: Building2
					},
					{
						id: "seguranca",
						label: "Segurança",
						icon: Lock
					},
					{
						id: "aparencia",
						label: "Aparência",
						icon: Palette
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab.id),
					className: `flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${activeTab === tab.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "h-3.5 w-3.5" }), tab.label]
				}, tab.id))
			}),
			activeTab === "empresa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				ref: formRef,
				onSubmit: handleSaveCompany,
				className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 border-b border-border pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-16 w-16 shrink-0 overflow-hidden place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground",
							children: isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : company?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: company.logo_url,
								alt: "Logótipo",
								className: "h-full w-full object-contain bg-white"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-extrabold text-foreground",
								children: "Dados da Empresa"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Informação usada em todas as facturas emitidas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							ref: fileInputRef,
							onChange: handleLogoUpload,
							accept: "image/*",
							className: "hidden"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							disabled: isUploading,
							className: "inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground hover:border-primary/40 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), isUploading ? "A carregar..." : "Carregar logotipo"]
						})] })
					]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nome comercial",
							name: "name",
							defaultValue: company?.name,
							wide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "NUIT",
							name: "nuit",
							defaultValue: company?.nuit
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Telefone",
							name: "phone",
							defaultValue: company?.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Endereço",
							name: "address",
							defaultValue: company?.address,
							wide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cidade",
							name: "city",
							defaultValue: company?.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Província",
							name: "province",
							defaultValue: company?.province
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							name: "email",
							defaultValue: company?.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Website",
							name: "website",
							defaultValue: company?.website || ""
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-end gap-2 border-t border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: updateCompany.isPending,
						className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50",
						children: [updateCompany.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Guardar alterações"]
					})]
				})] })]
			}),
			activeTab === "seguranca" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-border pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-extrabold text-foreground",
							children: "Alterar senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Atualize a sua senha de acesso"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Senha actual"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: currentPassword,
									onChange: (e) => setCurrentPassword(e.target.value),
									className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Nova senha"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value),
									className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Mínimo 6 caracteres"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Confirmar nova senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-2 border-t border-border pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setCurrentPassword("");
								setNewPassword("");
								setConfirmPassword("");
							},
							className: "rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleUpdatePassword,
							disabled: isUpdatingPassword || !newPassword,
							className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50",
							children: [isUpdatingPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Alterar senha"]
						})]
					})
				]
			}),
			activeTab === "aparencia" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b border-border pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-extrabold text-foreground",
						children: "Aparência e cores"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Personalize as cores usadas no painel e nos documentos"
					})] })]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Cor primária",
							defaultValue: company?.primary_color || "#02664D",
							onChange: (c) => {
								setPrimaryColor(c);
								document.documentElement.style.setProperty("--color-primary", c);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Cor secundária",
							defaultValue: company?.secondary_color || "#1E2A38",
							onChange: setSecondaryColor
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-xl bg-muted p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Pré-visualização"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-24 rounded-lg",
								style: { backgroundColor: primaryColor || company?.primary_color || "var(--primary)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-24 rounded-lg",
								style: { backgroundColor: secondaryColor || company?.secondary_color || "#1E2A38" }
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-foreground",
								children: "Carimbo Automático na Fatura"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Escolha se quer que o sistema assine e carimbe as faturas automaticamente."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "flex items-center cursor-pointer gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "sr-only",
											checked: useDigitalStamp,
											onChange: (e) => setUseDigitalStamp(e.target.checked)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `block w-10 h-6 rounded-full transition ${useDigitalStamp ? "bg-primary" : "bg-gray-300"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${useDigitalStamp ? "translate-x-4" : ""}` })
									]
								})
							})]
						}), useDigitalStamp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-foreground mb-4",
									children: "Design do Carimbo Digital"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mb-4",
									children: "Escolha o formato do carimbo automático que aparecerá no rodapé das suas faturas."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4",
									children: [
										"style1",
										"style2",
										"style3",
										"style4",
										"style5"
									].map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => setStampStyle(style),
										className: `cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-between gap-4 transition ${stampStyle === style ? "border-primary bg-primary-soft/10 ring-2 ring-primary/20 shadow-soft" : "border-border hover:border-primary/50"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-24 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampGenerator, {
												companyName: company?.name || "SUA EMPRESA",
												companyNuit: company?.nuit || "000000000",
												companyCity: company?.city || "MAPUTO",
												companyPhone: company?.phone || "---",
												companyAddress: company?.address || "",
												color: primaryColor || company?.primary_color || "var(--primary)",
												style
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold text-foreground uppercase tracking-wider text-center",
											children: style === "style1" ? "Clássico Redondo" : style === "style2" ? "Selo Dentado" : style === "style3" ? "Hexagonal Minimal" : style === "style4" ? "Retângulo Clássico" : "Retângulo Iniciais"
										})]
									}, style))
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-2 border-t border-border pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40",
							children: "Repor padrão"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSaveAppearance,
							disabled: updateCompany.isPending,
							className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50",
							children: [updateCompany.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Guardar cores"]
						})]
					})
				] })]
			})
		]
	})] });
}
//#endregion
export { DefinicoesPage as component };
