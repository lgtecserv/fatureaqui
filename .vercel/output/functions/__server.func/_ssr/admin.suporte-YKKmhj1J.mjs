import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { N as MessageSquare, R as LoaderCircle, S as Search, St as ArrowLeft, ct as CircleCheck, gt as Building2, nt as Clock, x as Send } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format, t as pt } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.suporte-YKKmhj1J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSuportePage() {
	const queryClient = useQueryClient();
	const [activeTicket, setActiveTicket] = (0, import_react.useState)(null);
	const [newMessage, setNewMessage] = (0, import_react.useState)("");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const chatContainerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}, [activeTicket]);
	const { data: tickets, isLoading: loadingTickets } = useQuery({
		queryKey: ["admin-tickets"],
		queryFn: async () => {
			const { data: ticketsData, error: ticketsError } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
			if (ticketsError) throw ticketsError;
			if (!ticketsData || ticketsData.length === 0) return [];
			const userIds = [...new Set(ticketsData.map((t) => t.user_id))];
			const { data: companies, error: compError } = await supabase.from("companies").select("user_id, name, email").in("user_id", userIds);
			if (compError) throw compError;
			return ticketsData.map((t) => ({
				...t,
				company: companies?.find((c) => c.user_id === t.user_id) || {
					name: "Desconhecida",
					email: ""
				}
			}));
		}
	});
	const { data: messages, isLoading: loadingMessages } = useQuery({
		queryKey: ["ticket-messages", activeTicket?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("ticket_messages").select("*").eq("ticket_id", activeTicket?.id).order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		},
		enabled: !!activeTicket?.id
	});
	const replyMutation = useMutation({
		mutationFn: async (msgText) => {
			if (!msgText.trim()) return;
			const { data: authData } = await supabase.auth.getUser();
			if (!authData.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("ticket_messages").insert([{
				ticket_id: activeTicket?.id,
				user_id: authData.user.id,
				message: msgText
			}]);
			if (error) throw error;
			if (activeTicket?.status === "aberto") await supabase.from("tickets").update({ status: "em_progresso" }).eq("id", activeTicket.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ticket-messages", activeTicket?.id] });
			queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
			setNewMessage("");
		},
		onError: () => toast.error("Erro ao enviar mensagem.")
	});
	const closeTicketMutation = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("tickets").update({ status: "fechado" }).eq("id", activeTicket?.id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
			toast.success("Ticket marcado como resolvido!");
			if (activeTicket) setActiveTicket({
				...activeTicket,
				status: "fechado"
			});
		}
	});
	const handleReplySubmit = (e) => {
		e.preventDefault();
		if (!newMessage.trim() || replyMutation.isPending) return;
		replyMutation.mutate(newMessage);
	};
	const filteredTickets = tickets?.filter((t) => t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.company?.name.toLowerCase().includes(searchTerm.toLowerCase()));
	const getStatusBadge = (status) => {
		switch (status) {
			case "aberto": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Aberto (Novo)"]
			});
			case "em_progresso": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3" }), " A Responder"]
			});
			case "fechado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Resolvido"]
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 p-8 h-screen flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold text-slate-900",
				children: "Suporte / Tickets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-1",
				children: "Pedidos de ajuda e suporte técnico das empresas."
			})] }), !activeTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full sm:w-72",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "Procurar ticket ou empresa...",
					className: "h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex",
			children: activeTicket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-slate-100 bg-slate-50/50 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTicket(null),
								className: "rounded-full p-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-slate-900",
								children: activeTicket.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-3 text-sm text-slate-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 font-medium text-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }),
											" ",
											activeTicket.company?.name
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									getStatusBadge(activeTicket.status)
								]
							})] })]
						}), activeTicket.status !== "fechado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => closeTicketMutation.mutate(),
							disabled: closeTicketMutation.isPending,
							className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50",
							children: [closeTicketMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }), "Marcar como Resolvido"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: chatContainerRef,
						className: "flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30",
						children: loadingMessages ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-slate-400" })
						}) : messages?.map((msg) => {
							const isAdmin = msg.user_id !== activeTicket.user_id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex ${isAdmin ? "justify-end" : "justify-start"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 ${isAdmin ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border border-slate-200 text-slate-900 shadow-sm rounded-tl-none"}`,
									children: [
										!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold text-slate-500 mb-1",
											children: activeTicket.company?.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm whitespace-pre-wrap leading-relaxed",
											children: msg.message
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `mt-2 text-[10px] font-medium ${isAdmin ? "text-primary-foreground/70" : "text-slate-400"}`,
											children: format(new Date(msg.created_at), "dd MMM, HH:mm", { locale: pt })
										})
									]
								})
							}, msg.id);
						})
					}),
					activeTicket.status !== "fechado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-slate-100 bg-white p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleReplySubmit,
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newMessage,
								onChange: (e) => setNewMessage(e.target.value),
								placeholder: "Escreva a resposta para o cliente...",
								className: "h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: !newMessage.trim() || replyMutation.isPending,
								className: "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50",
								children: [replyMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Responder"
								})]
							})]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-slate-100 bg-slate-50 p-4 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500 font-medium",
							children: "Este ticket foi marcado como resolvido e fechado."
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full h-full overflow-y-auto",
				children: loadingTickets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
				}) : filteredTickets?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center text-center p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-slate-900",
							children: "Sem tickets"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-slate-500",
							children: "Não existem tickets abertos ou não encontramos nenhum resultado para a sua pesquisa."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-slate-50/80 text-slate-500 sticky top-0 border-b border-slate-200 backdrop-blur-sm z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold",
								children: "Empresa / Cliente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold w-1/2",
								children: "Assunto do Ticket"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold",
								children: "Estado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold text-right",
								children: "Data"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100",
						children: filteredTickets?.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setActiveTicket(ticket),
							className: "hover:bg-slate-50 cursor-pointer transition-colors group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-slate-900",
										children: ticket.company?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-500",
										children: ticket.company?.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-slate-900 group-hover:text-primary transition-colors truncate max-w-md",
										children: ticket.subject
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4",
									children: getStatusBadge(ticket.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-right text-slate-500",
									children: format(new Date(ticket.created_at), "dd MMM yyyy", { locale: pt })
								})
							]
						}, ticket.id))
					})]
				})
			})
		})]
	});
}
//#endregion
export { AdminSuportePage as component };
