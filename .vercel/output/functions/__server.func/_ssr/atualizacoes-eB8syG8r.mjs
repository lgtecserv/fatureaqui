import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as RefreshCcw, T as Rocket, g as Sparkles, r as Wrench, xt as ArrowRight } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Footer } from "./footer-B3lEqg1a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atualizacoes-eB8syG8r.js
var import_jsx_runtime = require_jsx_runtime();
function AtualizacoesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "FatureAqui",
						className: "h-16 sm:h-[72px] object-contain"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/painel",
					className: "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95",
					children: ["Entrar no painel ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-6 py-12 md:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center mb-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold uppercase tracking-wider text-primary mb-2 block",
									children: "Changelog"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight",
									children: "Atualizações do Sistema"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-lg text-muted-foreground",
									children: "Descubra as mais recentes funcionalidades, melhorias e correções feitas pela equipa da LG Tecserv."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative border-l-2 border-border/60 ml-4 md:ml-0 md:pl-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-16",
								children: [
									{
										version: "v1.5.0",
										date: "16 de Julho de 2026",
										type: "feature",
										title: "O Novo Motor de Notificações em Tempo Real",
										description: "Lançámos um sistema de notificações globais. Agora, os utilizadores recebem alertas instantâneos (com indicadores visuais na barra superior) sempre que um novo pagamento é aprovado, um ticket de suporte é respondido ou uma nova atualização de sistema entra em vigor.",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-amber-500" }),
										colorClass: "bg-amber-500/10 border-amber-500/20"
									},
									{
										version: "v1.4.2",
										date: "13 de Julho de 2026",
										type: "improvement",
										title: "Duplo Sistema de Impostos (IVA & Retenção na Fonte)",
										description: "Implementámos a lógica complexa de impostos exigida pela Autoridade Tributária, permitindo aplicar em simultâneo a taxa de IVA (16%) e a Retenção na Fonte IRPS/IRPC diretamente nas faturas emitidas.",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "h-5 w-5 text-blue-500" }),
										colorClass: "bg-blue-500/10 border-blue-500/20"
									},
									{
										version: "v1.3.0",
										date: "10 de Julho de 2026",
										type: "feature",
										title: "Integração M-Pesa e e-Mola Automática",
										description: "Acabaram-se os dias de verificar pagamentos manualmente. Integrámos gateways de pagamento mobile para que as suas faturas possam ser pagas via M-Pesa ou e-Mola, sendo o estado da fatura atualizado automaticamente no sistema.",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-5 w-5 text-primary" }),
										colorClass: "bg-primary/10 border-primary/20"
									},
									{
										version: "v1.1.5",
										date: "05 de Julho de 2026",
										type: "fix",
										title: "Otimização de Performance nos Relatórios",
										description: "Corrigimos lentidões ao gerar o mapa de impostos trimestral para contas com mais de 50.000 documentos emitidos. O PDF é agora gerado em menos de 2 segundos.",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5 text-slate-500" }),
										colorClass: "bg-slate-500/10 border-slate-500/20"
									},
									{
										version: "v1.0.0",
										date: "01 de Junho de 2026",
										type: "launch",
										title: "Lançamento Oficial do Fature Aqui",
										description: "A revolução começou! A LG Tecserv abriu o Fature Aqui ao público moçambicano, oferecendo um software de faturação SaaS nativo na cloud e 100% em conformidade com as regras locais.",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-5 w-5 text-green-500" }),
										colorClass: "bg-green-500/10 border-green-500/20"
									}
								].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative md:pl-12 pl-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `absolute -left-[17px] md:-left-[21px] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background ${item.colorClass.split(" ")[0]} shadow-sm`,
										children: item.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
													children: item.version
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: "text-xl font-bold text-foreground",
													children: item.title
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-muted-foreground",
												children: item.date
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: item.description
										})]
									})]
								}, index))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-20 text-center bg-primary/5 rounded-3xl p-10 border border-primary/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-bold text-foreground mb-4",
									children: "Quer solicitar uma nova funcionalidade?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-6",
									children: "A nossa equipa ouve o mercado para definir as prioridades de desenvolvimento."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contactos",
									className: "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90",
									children: "Falar com os Desenvolvedores"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { AtualizacoesPage as component };
