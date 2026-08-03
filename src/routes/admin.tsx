import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
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
          {/* Mobile Header for Admin */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="w-4" />
            <h1 className="text-lg font-semibold text-slate-900">Administração</h1>
          </header>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
