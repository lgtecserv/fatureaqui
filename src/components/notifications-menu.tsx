import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  XCircle,
  Check
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "error": return <XCircle className="h-5 w-5 text-rose-500" />;
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (id: string, isRead: boolean, link?: string) => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
    
    setOpen(false);

    if (link) {
      navigate({ to: link as any }); // Cast as any for router flexibility
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 sm:w-96" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="font-semibold text-foreground">Notificações</h4>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
            >
              <Check className="h-3 w-3" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!notifications?.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Não tem nenhuma notificação de momento.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.is_read, n.link)}
                  className={`flex cursor-pointer items-start gap-3 p-4 text-left transition hover:bg-muted/50 ${
                    !n.is_read ? "bg-primary/5" : "bg-card"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${!n.is_read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {n.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] uppercase text-muted-foreground/70">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: pt })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
