import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { $ as CreditCard, B as LifeBuoy, I as LogOut, J as FileText, R as LoaderCircle, V as LayoutDashboard, a as Users, y as Settings } from "../_libs/lucide-react.mjs";
import { a as SidebarGroupContent, c as SidebarInset, d as SidebarMenuItem, f as SidebarProvider, i as SidebarGroup, l as SidebarMenu, n as SidebarContent, o as SidebarGroupLabel, r as SidebarFooter, s as SidebarHeader, t as Sidebar, u as SidebarMenuButton } from "./sidebar-C9TL2qQK.mjs";
import { _ as Link, l as useLocation, p as Outlet, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as differenceInDays } from "../_libs/date-fns.mjs";
import { t as useOnboarding } from "./use-onboarding-W5yKWkFk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel-Dq1HFhz0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mainItems = [
	{
		title: "Dashboard",
		url: "/painel",
		icon: LayoutDashboard
	},
	{
		title: "Documentos",
		url: "/painel/facturacao",
		icon: FileText
	},
	{
		title: "Clientes",
		url: "/painel/clientes",
		icon: Users
	}
];
var bottomItems = [
	{
		title: "Assinatura",
		url: "/painel/assinatura",
		icon: CreditCard
	},
	{
		title: "Suporte",
		url: "/painel/suporte",
		icon: LifeBuoy
	},
	{
		title: "Definições",
		url: "/painel/definicoes",
		icon: Settings
	}
];
function AppSidebar() {
	const currentPath = useRouterState({ select: (r) => r.location.pathname });
	const { user, signOut } = useAuth();
	const { data: onboarding } = useOnboarding();
	const { data: company } = useQuery({
		queryKey: ["company", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
			return data;
		},
		enabled: !!user
	});
	const { data: subscription } = useQuery({
		queryKey: ["subscription", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
			return data;
		},
		enabled: !!user
	});
	const isActive = (path) => path === "/painel" ? currentPath === path : currentPath.startsWith(path);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
		collapsible: "icon",
		className: "border-r border-sidebar-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
				className: "border-b border-sidebar-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start px-2 py-4 group-data-[collapsible=icon]:justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: company?.logo_url || "/logo.png",
						alt: company?.name || "Logo",
						className: "max-h-10 w-auto max-w-full object-contain group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:object-cover"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarContent, {
				className: "px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Gestão"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: mainItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
					asChild: true,
					isActive: isActive(item.url),
					tooltip: item.title,
					className: "h-10 rounded-lg data-[active=true]:bg-primary-soft data-[active=true]:text-primary-soft-foreground data-[active=true]:font-semibold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.url,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
					})
				}) }, item.url)) }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
						className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
						children: "Conta"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: bottomItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
						asChild: true,
						isActive: isActive(item.url),
						tooltip: item.title,
						className: `h-10 rounded-lg data-[active=true]:bg-primary-soft data-[active=true]:text-primary-soft-foreground data-[active=true]:font-semibold ${item.url === "/painel/definicoes" && onboarding && !onboarding.isComplete ? "animate-pulse bg-primary/20 text-primary font-semibold ring-1 ring-primary/50 shadow-sm" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.url,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
						})
					}) }, item.url)) }) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {
				className: "border-t border-sidebar-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 group-data-[collapsible=icon]:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-soft-foreground",
							children: user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-semibold text-foreground",
								children: user?.user_metadata?.full_name || company?.name || "Utilizador"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs text-muted-foreground",
								children: (subscription?.status === "ativo" || subscription?.status === "active") && subscription?.valid_until && new Date(subscription.valid_until) > /* @__PURE__ */ new Date() ? "Plano Pro" : subscription?.status === "pendente" ? "Pendente de Aprovação" : "Plano Gratuito"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => signOut(),
							className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground",
							"aria-label": "Sair",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})
					]
				})
			})
		]
	});
}
function PainelLayout() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [initializing, setInitializing] = (0, import_react.useState)(true);
	const [isBlocked, setIsBlocked] = (0, import_react.useState)(false);
	const [blockReason, setBlockReason] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!loading && !user) {
			navigate({ to: "/login" });
			return;
		}
		if (user?.email === "lgtecserv@gmail.com") {
			navigate({ to: "/admin" });
			return;
		}
		async function initAndCheckBilling() {
			if (!user) return;
			const { data: companyData, error } = await supabase.from("companies").select("*").eq("user_id", user.id).maybeSingle();
			let company = companyData;
			if (!company && !error) {
				const { data: newCompany } = await supabase.from("companies").insert({
					user_id: user.id,
					name: user.user_metadata?.full_name ? `Empresa de ${user.user_metadata.full_name.split(" ")[0]}` : "A Minha Empresa",
					email: user.email || "",
					phone: "",
					nuit: "",
					address: "",
					city: "",
					province: "",
					country: "Moçambique",
					currency: "MZN",
					primary_color: "#02664D",
					secondary_color: "#1E2A38"
				}).select().single();
				company = newCompany;
			}
			if (company?.primary_color) {
				const root = document.documentElement;
				const p = company.primary_color;
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
			}
			if (company?.secondary_color) {
				const s = company.secondary_color;
				document.documentElement.style.setProperty("--secondary", s);
				document.documentElement.style.setProperty("--color-secondary", s);
			}
			try {
				const { data: settings } = await supabase.from("system_settings").select("free_plan_docs_limit, trial_days, maintenance_mode").eq("id", "00000000-0000-0000-0000-000000000001").single();
				if (settings?.maintenance_mode) {
					setIsBlocked(true);
					setBlockReason("Sistema em Manutenção");
					setInitializing(false);
					return;
				}
				const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();
				if (!(subscription && (subscription.status === "ativo" || subscription.status === "active") && subscription.valid_until && new Date(subscription.valid_until) > /* @__PURE__ */ new Date())) {
					const daysSinceRegistration = differenceInDays(/* @__PURE__ */ new Date(), new Date(company.created_at));
					const trialLimit = settings?.trial_days || 30;
					if (daysSinceRegistration > trialLimit) {
						setIsBlocked(true);
						setBlockReason(`O seu período de utilização gratuita de ${trialLimit} dias expirou.`);
					} else {
						const date = /* @__PURE__ */ new Date();
						const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
						const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
						const { count } = await supabase.from("documents").select("*", {
							count: "exact",
							head: true
						}).eq("company_id", company.id).gte("date", startOfMonth).lte("date", endOfMonth);
						const currentDocs = count || 0;
						const docLimit = settings?.free_plan_docs_limit || 5;
						if (docLimit > 0 && currentDocs >= docLimit) {
							setIsBlocked(true);
							setBlockReason(`Atingiu o limite de ${docLimit} documentos gratuitos deste mês.`);
						}
					}
				} else setIsBlocked(false);
			} catch (err) {
				console.error("Erro a validar limites:", err);
			}
			setInitializing(false);
		}
		if (user && !loading) initAndCheckBilling();
		else if (!loading) setInitializing(false);
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (isBlocked && !initializing) {
			if (![
				"/painel/assinatura",
				"/painel/suporte",
				"/painel/definicoes"
			].includes(location.pathname)) navigate({ to: "/painel/assinatura" });
		}
	}, [
		isBlocked,
		initializing,
		location.pathname,
		navigate
	]);
	if (loading || initializing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-3 text-sm font-medium text-muted-foreground",
			children: "A preparar o seu painel..."
		})]
	});
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarInset, {
			className: "min-w-0 flex-1 bg-background relative",
			children: [isBlocked && location.pathname !== "/painel/assinatura" && location.pathname !== "/painel/suporte" && location.pathname !== "/painel/definicoes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "32",
								height: "32",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "18",
									height: "11",
									x: "3",
									y: "11",
									rx: "2",
									ry: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-slate-900 mb-2",
							children: "Acesso Bloqueado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-500 mb-6",
							children: blockReason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/painel/assinatura" }),
							className: "bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold w-full hover:bg-primary/90 transition-colors",
							children: "Regularizar Situação"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
		})]
	}) });
}
//#endregion
export { PainelLayout as component };
