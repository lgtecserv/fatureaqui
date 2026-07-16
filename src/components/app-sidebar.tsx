import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/painel", icon: LayoutDashboard },
  { title: "Documentos", url: "/painel/facturacao", icon: FileText },
  { title: "Clientes", url: "/painel/clientes", icon: Users },
];

const bottomItems = [
  { title: "Assinatura", url: "/painel/assinatura", icon: CreditCard },
  { title: "Suporte", url: "/painel/suporte", icon: LifeBuoy },
  { title: "Definições", url: "/painel/definicoes", icon: Settings },
];

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Download } from "lucide-react";

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (r) => r.location.pathname,
  });
  const { user, signOut } = useAuth();
  const { data: onboarding } = useOnboarding();
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        setDeferredPrompt(null);
      });
    }
  };

  const { data: company } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const isActive = (path: string) =>
    path === "/painel" ? currentPath === path : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-start px-2 py-4 group-data-[collapsible=icon]:justify-center">
          <img 
            src={company?.logo_url || "/logo.png"} 
            alt={company?.name || "Logo"} 
            className="max-h-10 w-auto max-w-full object-contain group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:object-cover"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-10 rounded-lg data-[active=true]:bg-primary-soft data-[active=true]:text-primary-soft-foreground data-[active=true]:font-semibold"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Conta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={`h-10 rounded-lg data-[active=true]:bg-primary-soft data-[active=true]:text-primary-soft-foreground data-[active=true]:font-semibold ${
                      item.url === "/painel/definicoes" && onboarding && !onboarding.isComplete
                        ? "animate-pulse bg-primary/20 text-primary font-semibold ring-1 ring-primary/50 shadow-sm"
                        : ""
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {deferredPrompt && (
          <SidebarGroup className="mt-auto pb-4">
            <SidebarGroupContent className="px-2">
              <button
                onClick={handleInstallClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
              >
                <Download className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Instalar App</span>
              </button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-soft-foreground">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">{user?.user_metadata?.full_name || company?.name || "Utilizador"}</span>
            <span className="truncate text-xs text-muted-foreground">
              {(subscription?.status === "ativo" || subscription?.status === "active") && subscription?.valid_until && new Date(subscription.valid_until) > new Date() ? "Plano Pro" : 
               subscription?.status === "pendente" ? "Pendente de Aprovação" : 
               "Plano Gratuito"}
            </span>
          </div>
          <button
            onClick={() => signOut()}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
