import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Package,
  CreditCard,
  Settings,
  LifeBuoy,
  Activity,
  LogOut,
  Mail,
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
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

export function AdminSidebar() {
  const { t } = useTranslation();
  
  const adminItems = [
    { title: t("admin.nav_dashboard"), url: "/admin", icon: LayoutDashboard },
    { title: t("admin.nav_companies"), url: "/admin/empresas", icon: Building2 },
    { title: t("admin.nav_marketing"), url: "/admin/marketing", icon: Mail },
    { title: t("admin.nav_plans"), url: "/admin/planos", icon: Package },
    { title: t("admin.nav_billing"), url: "/admin/faturacao", icon: CreditCard },
    { title: t("admin.nav_settings"), url: "/admin/configuracoes", icon: Settings },
    { title: t("admin.nav_support"), url: "/admin/suporte", icon: LifeBuoy },
    { title: t("admin.nav_logs"), url: "/admin/logs", icon: Activity },
  ];
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-start px-2 py-4 group-data-[collapsible=icon]:justify-center">
          <img 
            src="/logo.png" 
            alt="FatureAqui Admin" 
            className="max-h-10 w-auto max-w-full object-contain group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:object-cover"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{t("admin.group_admin")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
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
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-soft-foreground group-data-[collapsible=icon]:mx-auto">
            A
          </div>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-foreground">Super Admin</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <button 
            onClick={() => signOut()}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:hidden"
            title={t("admin.logout_tooltip")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
