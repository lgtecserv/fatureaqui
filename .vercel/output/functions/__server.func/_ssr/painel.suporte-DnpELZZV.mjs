import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { D as Plus, N as MessageSquare, R as LoaderCircle, St as ArrowLeft, ct as CircleCheck, nt as Clock, x as Send } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format, t as pt } from "../_libs/date-fns.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.suporte-DnpELZZV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PainelSuportePage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [activeTicket, setActiveTicket] = (0, import_react.useState)(null);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [newSubject, setNewSubject] = (0, import_react.useState)("");
	const [newMessage, setNewMessage] = (0, import_react.useState)("");
	const chatContainerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}, [activeTicket]);
	const { data: tickets, isLoading: loadingTickets } = useQuery({
		queryKey: ["my-tickets", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("tickets").select("*").eq("user_id", user?.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
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
	const createTicketMutation = useMutation({
		mutationFn: async () => {
			if (!newSubject.trim() || !newMessage.trim()) throw new Error("Assunto e mensagem são obrigatórios.");
			const { data: ticketData, error: ticketError } = await supabase.from("tickets").insert([{
				subject: newSubject,
				user_id: user?.id,
				status: "aberto"
			}]).select().single();
			if (ticketError) throw ticketError;
			const { error: msgError } = await supabase.from("ticket_messages").insert([{
				ticket_id: ticketData.id,
				user_id: user?.id,
				message: newMessage
			}]);
			if (msgError) throw msgError;
			return ticketData;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
			setIsCreating(false);
			setNewSubject("");
			setNewMessage("");
			setActiveTicket(data);
			toast.success("Ticket criado com sucesso! O suporte responderá em breve.");
		},
		onError: (e) => {
			toast.error(e.message || "Erro ao criar ticket.");
		}
	});
	const replyMutation = useMutation({
		mutationFn: async (msgText) => {
			if (!msgText.trim()) return;
			const { error } = await supabase.from("ticket_messages").insert([{
				ticket_id: activeTicket?.id,
				user_id: user?.id,
				message: msgText
			}]);
			if (error) throw error;
			if (activeTicket?.status === "fechado") await supabase.from("tickets").update({ status: "aberto" }).eq("id", activeTicket.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ticket-messages", activeTicket?.id] });
			queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
			setNewMessage("");
		},
		onError: () => toast.error("Erro ao enviar mensagem.")
	});
	const handleReplySubmit = (e) => {
		e.preventDefault();
		if (!newMessage.trim() || replyMutation.isPending) return;
		replyMutation.mutate(newMessage);
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "aberto": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Aberto"]
			});
			case "em_progresso": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3" }), " Em Resolução"]
			});
			case "fechado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Resolvido"]
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
		title: "Suporte",
		subtitle: "Precisa de ajuda? Fale com a nossa equipa."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-full max-w-5xl p-4 sm:p-6 h-[calc(100vh-80px)] flex flex-col",
		children: isCreating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-6 shadow-soft flex-1 overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsCreating(false),
					className: "mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-slate-900 mb-6",
					children: "Abrir Novo Ticket de Suporte"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold text-slate-700",
							children: "Assunto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: newSubject,
							onChange: (e) => setNewSubject(e.target.value),
							placeholder: "Ex: Erro ao emitir fatura",
							className: "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold text-slate-700",
							children: "Descreva o seu problema detalhadamente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: newMessage,
							onChange: (e) => setNewMessage(e.target.value),
							placeholder: "Olá, estou a tentar emitir um documento mas...",
							className: "min-h-[150px] w-full resize-y rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 flex items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => createTicketMutation.mutate(),
								disabled: createTicketMutation.isPending || !newSubject.trim() || !newMessage.trim(),
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50",
								children: [createTicketMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Enviar Pedido"]
							})
						})
					]
				})
			]
		}) : activeTicket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-soft flex-1 flex flex-col overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setActiveTicket(null);
								queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
							},
							className: "rounded-full p-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-slate-900",
							children: activeTicket.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2 text-xs text-slate-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Aberto a ", format(new Date(activeTicket.created_at), "dd 'de' MMMM", { locale: pt })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								getStatusBadge(activeTicket.status)
							]
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: chatContainerRef,
					className: "flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30",
					children: loadingMessages ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-slate-400" })
					}) : messages?.map((msg, i) => {
						const isMe = msg.user_id === user?.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${isMe ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 ${isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border border-slate-200 text-slate-900 shadow-sm rounded-tl-none"}`,
								children: [
									!isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-primary mb-1",
										children: "Equipa de Suporte"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm whitespace-pre-wrap leading-relaxed",
										children: msg.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `mt-2 text-[10px] font-medium ${isMe ? "text-primary-foreground/70" : "text-slate-400"}`,
										children: format(new Date(msg.created_at), "HH:mm")
									})
								]
							})
						}, msg.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-slate-100 bg-white p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReplySubmit,
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: newMessage,
							onChange: (e) => setNewMessage(e.target.value),
							placeholder: "Escreva a sua mensagem...",
							className: "h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: !newMessage.trim() || replyMutation.isPending,
							className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50",
							children: replyMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 ml-1" })
						})]
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-slate-900",
					children: "Os meus pedidos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsCreating(true),
					className: "inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo Ticket"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
				children: loadingTickets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-40 items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-slate-400" })
				}) : tickets?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-60 flex-col items-center justify-center text-center px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900",
							children: "Nenhum ticket de suporte"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-slate-500",
							children: "Ainda não abriu nenhum pedido de ajuda. Se tiver alguma dúvida ou encontrar um problema, estamos aqui para ajudar."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-slate-100",
					children: tickets?.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTicket(ticket),
						className: "flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "truncate text-sm font-bold text-slate-900",
								children: ticket.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-slate-500",
								children: ["Atualizado a ", format(new Date(ticket.created_at), "dd MMM yyyy", { locale: pt })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: getStatusBadge(ticket.status)
						})]
					}, ticket.id))
				})
			})]
		})
	})] });
}
//#endregion
export { PainelSuportePage as component };
