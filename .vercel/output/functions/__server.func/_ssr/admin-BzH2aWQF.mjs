import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { $ as CreditCard, B as LifeBuoy, Ct as Activity, I as LogOut, M as Package, R as LoaderCircle, V as LayoutDashboard, gt as Building2, y as Settings } from "../_libs/lucide-react.mjs";
import { a as SidebarGroupContent, c as SidebarInset, d as SidebarMenuItem, f as SidebarProvider, i as SidebarGroup, l as SidebarMenu, n as SidebarContent, o as SidebarGroupLabel, r as SidebarFooter, s as SidebarHeader, t as Sidebar, u as SidebarMenuButton } from "./sidebar-C9TL2qQK.mjs";
import { _ as Link, l as useLocation, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BzH2aWQF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var adminItems = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: LayoutDashboard
	},
	{
		title: "Empresas",
		url: "/admin/empresas",
		icon: Building2
	},
	{
		title: "Planos & Subscrições",
		url: "/admin/planos",
		icon: Package
	},
	{
		title: "Faturação",
		url: "/admin/faturacao",
		icon: CreditCard
	},
	{
		title: "Configurações",
		url: "/admin/configuracoes",
		icon: Settings
	},
	{
		title: "Suporte",
		url: "/admin/suporte",
		icon: LifeBuoy
	},
	{
		title: "Logs de Sistema",
		url: "/admin/logs",
		icon: Activity
	}
];
function AdminSidebar() {
	const { user, signOut } = useAuth();
	const currentPath = useLocation().pathname;
	const isActive = (path) => {
		if (path === "/admin") return currentPath === path;
		return currentPath.startsWith(path);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
		collapsible: "icon",
		className: "border-r border-sidebar-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
				className: "border-b border-sidebar-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start px-2 py-4 group-data-[collapsible=icon]:justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "FatureAqui Admin",
						className: "max-h-10 w-auto max-w-full object-contain group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:object-cover"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {
				className: "px-1 mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: "ADMINISTRAÇÃO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: adminItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
					asChild: true,
					isActive: isActive(item.url),
					tooltip: item.title,
					className: "h-10 rounded-lg data-[active=true]:bg-primary-soft data-[active=true]:text-primary-soft-foreground data-[active=true]:font-semibold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.url,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
					})
				}) }, item.title)) }) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {
				className: "border-t border-sidebar-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 group-data-[collapsible=icon]:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-soft-foreground group-data-[collapsible=icon]:mx-auto",
							children: "A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-semibold text-foreground",
								children: "Super Admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs text-muted-foreground",
								children: user?.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => signOut(),
							className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:hidden",
							title: "Sair",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})
					]
				})
			})
		]
	});
}
function AdminLayout() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const isAdmin = user?.email === "lgtecserv@gmail.com";
	(0, import_react.useEffect)(() => {
		if (!loading) {
			if (!user) navigate({ to: "/login" });
			else if (!isAdmin) navigate({ to: "/painel" });
		}
	}, [
		user,
		loading,
		isAdmin,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-slate-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInset, {
			className: "flex-1 overflow-x-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	}) });
}
//#endregion
export { AdminLayout as component };
