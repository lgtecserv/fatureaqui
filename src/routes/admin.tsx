import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.email === "lgtecserv@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/login" });
      } else if (!isAdmin) {
        navigate({ to: "/painel" });
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AdminSidebar />
        <SidebarInset className="flex-1 overflow-x-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 md:hidden">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="w-4" />
              <h1 className="text-lg font-semibold text-slate-900">{t("admin.title")}</h1>
            </div>
            <LanguageSwitcher />
          </header>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
