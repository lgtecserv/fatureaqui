import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as AuthProvider } from "./use-auth-DqYihmFD.mjs";
import { _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D_CFhTDP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DCjJBH1i.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Fature Aqui — Facturação e Gestão para Moçambique" },
			{
				name: "description",
				content: "O melhor software de faturação e gestão de Moçambique, certificado pela AT. Emita facturas, controle stock e clientes 100% online."
			},
			{
				name: "robots",
				content: "index, follow"
			},
			{
				property: "og:title",
				content: "Fature Aqui — Facturação e Gestão"
			},
			{
				property: "og:description",
				content: "O melhor software de faturação e gestão de Moçambique, certificado pela AT."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://fatureaqui.com"
			},
			{
				property: "og:site_name",
				content: "Fature Aqui"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Fature Aqui — Facturação e Gestão"
			},
			{
				name: "twitter:description",
				content: "O melhor software de faturação e gestão de Moçambique, certificado pela AT."
			},
			{
				name: "google-site-verification",
				content: "Q-lHKEc1oD3LJQ_cCGI-IYm_qhf7Gz35qIsQlCVdDdA"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$24 = () => import("./termos-BRrm2HYy.mjs");
var Route$24 = createFileRoute("/termos")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./sobre-BA7CfXWy.mjs");
var Route$23 = createFileRoute("/sobre")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./rgpd-BPDk3t64.mjs");
var Route$22 = createFileRoute("/rgpd")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./registro-BnBhj5uD.mjs");
var Route$21 = createFileRoute("/registro")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./privacidade-Np0flYt4.mjs");
var Route$20 = createFileRoute("/privacidade")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./painel-Dq1HFhz0.mjs");
var Route$19 = createFileRoute("/painel")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./login-EkSjbNDI.mjs");
var Route$18 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./contactos-C_AH-79M.mjs");
var Route$17 = createFileRoute("/contactos")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./atualizacoes-eB8syG8r.mjs");
var Route$16 = createFileRoute("/atualizacoes")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin-BzH2aWQF.mjs");
var Route$15 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./routes-DTvs-Yds.mjs");
var Route$14 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./painel.index-CPeWU22V.mjs");
var Route$13 = createFileRoute("/painel/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.index-TPblqGAT.mjs");
var Route$12 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./painel.suporte-DnpELZZV.mjs");
var Route$11 = createFileRoute("/painel/suporte")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./painel.definicoes-CKgi6RXB.mjs");
var Route$10 = createFileRoute("/painel/definicoes")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./painel.clientes-BVzlol7d.mjs");
var Route$9 = createFileRoute("/painel/clientes")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./painel.assinatura-GNBYGvqN.mjs");
var Route$8 = createFileRoute("/painel/assinatura")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.suporte-YKKmhj1J.mjs");
var Route$7 = createFileRoute("/admin/suporte")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.planos-CfXX_-N2.mjs");
var Route$6 = createFileRoute("/admin/planos")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.logs-g_t-UfB9.mjs");
var Route$5 = createFileRoute("/admin/logs")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.faturacao-DDjN5pNr.mjs");
var Route$4 = createFileRoute("/admin/faturacao")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.empresas-DGb-rsG7.mjs");
var Route$3 = createFileRoute("/admin/empresas")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.configuracoes-1gbTIvK4.mjs");
var Route$2 = createFileRoute("/admin/configuracoes")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./painel.facturacao.index-Y4Xfs4_U.mjs");
var Route$1 = createFileRoute("/painel/facturacao/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./painel.facturacao.nova-CmU0c097.mjs");
var Route = createFileRoute("/painel/facturacao/nova")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TermosRoute = Route$24.update({
	id: "/termos",
	path: "/termos",
	getParentRoute: () => Route$25
});
var SobreRoute = Route$23.update({
	id: "/sobre",
	path: "/sobre",
	getParentRoute: () => Route$25
});
var RgpdRoute = Route$22.update({
	id: "/rgpd",
	path: "/rgpd",
	getParentRoute: () => Route$25
});
var RegistroRoute = Route$21.update({
	id: "/registro",
	path: "/registro",
	getParentRoute: () => Route$25
});
var PrivacidadeRoute = Route$20.update({
	id: "/privacidade",
	path: "/privacidade",
	getParentRoute: () => Route$25
});
var PainelRoute = Route$19.update({
	id: "/painel",
	path: "/painel",
	getParentRoute: () => Route$25
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$25
});
var ContactosRoute = Route$17.update({
	id: "/contactos",
	path: "/contactos",
	getParentRoute: () => Route$25
});
var AtualizacoesRoute = Route$16.update({
	id: "/atualizacoes",
	path: "/atualizacoes",
	getParentRoute: () => Route$25
});
var AdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$25
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var PainelIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => PainelRoute
});
var AdminIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var PainelSuporteRoute = Route$11.update({
	id: "/suporte",
	path: "/suporte",
	getParentRoute: () => PainelRoute
});
var PainelDefinicoesRoute = Route$10.update({
	id: "/definicoes",
	path: "/definicoes",
	getParentRoute: () => PainelRoute
});
var PainelClientesRoute = Route$9.update({
	id: "/clientes",
	path: "/clientes",
	getParentRoute: () => PainelRoute
});
var PainelAssinaturaRoute = Route$8.update({
	id: "/assinatura",
	path: "/assinatura",
	getParentRoute: () => PainelRoute
});
var AdminSuporteRoute = Route$7.update({
	id: "/suporte",
	path: "/suporte",
	getParentRoute: () => AdminRoute
});
var AdminPlanosRoute = Route$6.update({
	id: "/planos",
	path: "/planos",
	getParentRoute: () => AdminRoute
});
var AdminLogsRoute = Route$5.update({
	id: "/logs",
	path: "/logs",
	getParentRoute: () => AdminRoute
});
var AdminFaturacaoRoute = Route$4.update({
	id: "/faturacao",
	path: "/faturacao",
	getParentRoute: () => AdminRoute
});
var AdminEmpresasRoute = Route$3.update({
	id: "/empresas",
	path: "/empresas",
	getParentRoute: () => AdminRoute
});
var AdminConfiguracoesRoute = Route$2.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => AdminRoute
});
var PainelFacturacaoIndexRoute = Route$1.update({
	id: "/facturacao/",
	path: "/facturacao/",
	getParentRoute: () => PainelRoute
});
var PainelFacturacaoNovaRoute = Route.update({
	id: "/facturacao/nova",
	path: "/facturacao/nova",
	getParentRoute: () => PainelRoute
});
var AdminRouteChildren = {
	AdminConfiguracoesRoute,
	AdminEmpresasRoute,
	AdminFaturacaoRoute,
	AdminLogsRoute,
	AdminPlanosRoute,
	AdminSuporteRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var PainelRouteChildren = {
	PainelAssinaturaRoute,
	PainelClientesRoute,
	PainelDefinicoesRoute,
	PainelSuporteRoute,
	PainelIndexRoute,
	PainelFacturacaoNovaRoute,
	PainelFacturacaoIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	AtualizacoesRoute,
	ContactosRoute,
	LoginRoute,
	PainelRoute: PainelRoute._addFileChildren(PainelRouteChildren),
	PrivacidadeRoute,
	RegistroRoute,
	RgpdRoute,
	SobreRoute,
	TermosRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
