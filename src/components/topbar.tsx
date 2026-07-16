import { Search, HelpCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsMenu } from "./notifications-menu";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar factura, cliente, produto…"
              className="h-9 w-72 rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
            <HelpCircle className="h-4 w-4" />
          </button>
          
          <NotificationsMenu />
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
