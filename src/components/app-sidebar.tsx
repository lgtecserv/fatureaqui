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
  Code,
  Lock,
  Truck,
  Package,
  Warehouse,
  ShoppingCart,
  Boxes,
  ArrowRightLeft
} from "lucide-react";
import { toast } from "sonner";
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
  { translationKey: "sidebar.dashboard", title: "Dashboard", url: "/painel", icon: LayoutDashboard },
  { translationKey: "sidebar.documents", title: "Documentos", url: "/painel/facturacao", icon: FileText },
  { translationKey: "sidebar.clients", title: "Clientes", url: "/painel/clientes", icon: Users },
  { translationKey: "sidebar.products", title: "Produtos", url: "/painel/produtos", icon: Package },
  { translationKey: "sidebar.batches", title: "Lotes & Validades", url: "/painel/lotes", icon: Boxes, isBeta: true },
  { translationKey: "sidebar.suppliers", title: "Fornecedores", url: "/painel/fornecedores", icon: Truck, isBeta: true },
  { translationKey: "sidebar.purchases", title: "Compras", url: "/painel/compras", icon: ShoppingCart, isBeta: true },
  { translationKey: "sidebar.warehouses", title: "Armazéns", url: "/painel/armazens", icon: Warehouse, isBeta: true },
  { translationKey: "sidebar.transfers", title: "Transferências", url: "/painel/transferencias", icon: ArrowRightLeft, isBeta: true },
];

const bottomItems = [
  { translationKey: "sidebar.subscription", title: "Assinatura", url: "/painel/assinatura", icon: CreditCard },
  { translationKey: "sidebar.api", title: "API e Integrações", url: "/painel/api", icon: Code, requiresPro: true },
  { translationKey: "sidebar.support", title: "Suporte", url: "/painel/suporte", icon: LifeBuoy },
  { translationKey: "sidebar.settings", title: "Definições", url: "/painel/definicoes", icon: Settings },
];

import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Download } from "lucide-react";

export function AppSidebar() {
  const { t } = useTranslation();
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

  const { data: settings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("system_settings").select("*").limit(1).single();
      return data;
    }
  });

  const now = new Date();
  const trialDays = settings?.trial_days || 30;
  const trialExpiration = company ? new Date(company.created_at) : new Date();
  if (company) {
    trialExpiration.setDate(trialExpiration.getDate() + trialDays);
  }

  const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
  const isProActive = (subscription?.status === "ativo" || subscription?.status === "active") && validUntil && now <= validUntil;
  const isPending = subscription?.status === "pendente";
  
  const isExpired = isProActive ? false : (now > trialExpiration);
  const expirationDate = isProActive ? validUntil : trialExpiration;
  const daysLeft = expirationDate ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const isActive = (path: string) =>
    path === "/painel" ? currentPath === path : currentPath.startsWith(path);

  const isPro = isProActive;

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
            {t("sidebar.management")}
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
                    <Link 
                      to={item.isBeta ? currentPath : item.url}
                      onClick={(e) => {
                        if (item.isBeta) {
                          e.preventDefault();
                          toast.info("Funcionalidade em desenvolvimento. Disponível em breve!");
                        }
                      }}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.translationKey, item.title)}</span>
                      </div>
                      {item.isBeta && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber/20 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0 group-data-[collapsible=icon]:hidden">
                          {t("sidebar.soon")}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("sidebar.account")}
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
                    <Link to={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.translationKey, item.title)}</span>
                      </div>
                      {item.requiresPro && !isProActive && (
                        <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
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
                <span className="group-data-[collapsible=icon]:hidden">{t("sidebar.install")}</span>
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
              {isProActive ? t("sidebar.pro_plan", { days: daysLeft }) : 
               isPending ? t("sidebar.pending") : 
               isExpired ? <span className="text-red-500 font-medium">{t("sidebar.expired")}</span> :
               t("sidebar.free_plan", { days: daysLeft })}
            </span>
          </div>
          <LanguageSwitcher />
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
