import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { H as Info, S as Search, at as CircleQuestionMark, ct as CircleCheck, it as CircleX, pt as Check, u as TriangleAlert, vt as Bell } from "../_libs/lucide-react.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { p as SidebarTrigger } from "./sidebar-C9TL2qQK.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as formatDistanceToNow, t as pt } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/topbar-DkK51Kb4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useNotifications() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
			if (error) throw error;
			return data;
		},
		enabled: !!user,
		refetchInterval: 3e4
	});
	const markAsRead = useMutation({
		mutationFn: async (notificationId) => {
			const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
		}
	});
	const markAllAsRead = useMutation({
		mutationFn: async () => {
			if (!user) return;
			const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
		}
	});
	const createNotification = useMutation({
		mutationFn: async (newNotification) => {
			const { error } = await supabase.from("notifications").insert([newNotification]);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			if (variables.user_id === user?.id) queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
		}
	});
	return {
		...query,
		markAsRead,
		markAllAsRead,
		createNotification,
		unreadCount: query.data?.filter((n) => !n.is_read).length || 0
	};
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var getIcon = (type) => {
	switch (type) {
		case "success": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500" });
		case "warning": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-amber-500" });
		case "error": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 text-rose-500" });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-5 w-5 text-blue-500" });
	}
};
function NotificationsMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { data: notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
	const handleNotificationClick = (id, isRead, link) => {
		if (!isRead) markAsRead.mutate(id);
		setOpen(false);
		if (link) navigate({ to: link });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			className: "w-80 p-0 sm:w-96",
			sideOffset: 8,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-semibold text-foreground",
					children: "Notificações"
				}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => markAllAsRead.mutate(),
					className: "flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), "Marcar todas como lidas"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[60vh] overflow-y-auto",
				children: !notifications?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Não tem nenhuma notificação de momento."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col divide-y divide-border",
					children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleNotificationClick(n.id, n.is_read, n.link),
						className: `flex cursor-pointer items-start gap-3 p-4 text-left transition hover:bg-muted/50 ${!n.is_read ? "bg-primary/5" : "bg-card"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 shrink-0",
								children: getIcon(n.type)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-sm ${!n.is_read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`,
										children: n.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
										children: n.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[10px] uppercase text-muted-foreground/70",
										children: formatDistanceToNow(new Date(n.created_at), {
											addSuffix: true,
											locale: pt
										})
									})
								]
							}),
							!n.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" })
						]
					}, n.id))
				})
			})]
		})]
	});
}
function Topbar({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-16 items-center gap-3 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, { className: "text-muted-foreground hover:text-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-6 w-px bg-border sm:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-base font-extrabold tracking-tight text-foreground sm:text-lg",
						children: title
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden truncate text-xs text-muted-foreground sm:block",
						children: subtitle
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								placeholder: "Buscar factura, cliente, produto…",
								className: "h-9 w-72 rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsMenu, {})
					]
				}),
				actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: actions
				})
			]
		})
	});
}
//#endregion
export { Topbar as t };
