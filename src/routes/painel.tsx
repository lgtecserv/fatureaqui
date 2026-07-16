import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { differenceInDays } from "date-fns";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
});

function PainelLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
      return;
    }
    
    if (user?.email === "lgtecserv@gmail.com") {
      navigate({ to: "/admin" });
      return;
    }

    async function initAndCheckBilling() {
      if (!user) return;
      
      // 1. Get or Create Company
      const { data: companyData, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      let company = companyData;
      if (!company && !error) {
        const { data: newCompany } = await supabase.from("companies").insert({
          user_id: user.id,
          name: user.user_metadata?.full_name ? `Empresa de ${user.user_metadata.full_name.split(' ')[0]}` : "A Minha Empresa",
          email: user.email || "",
          phone: "",
          nuit: "",
          address: "",
          city: "",
          province: "",
          country: "Moçambique",
          currency: "MZN",
          primary_color: "#02664D",
          secondary_color: "#1E2A38"
        }).select().single();
        company = newCompany;
      }

      // Set colors
      if (company?.primary_color) {
        const root = document.documentElement;
        const p = company.primary_color;
        root.style.setProperty('--primary', p);
        root.style.setProperty('--color-primary', p);
        const soft = `color-mix(in srgb, ${p} 15%, transparent)`;
        root.style.setProperty('--primary-soft', soft);
        root.style.setProperty('--color-primary-soft', soft);
        root.style.setProperty('--primary-foreground', '#ffffff');
        root.style.setProperty('--color-primary-foreground', '#ffffff');
        root.style.setProperty('--primary-soft-foreground', p);
        root.style.setProperty('--color-primary-soft-foreground', p);
        root.style.setProperty('--sidebar-primary', p);
        root.style.setProperty('--color-sidebar-primary', p);
        root.style.setProperty('--sidebar-ring', p);
        root.style.setProperty('--color-sidebar-ring', p);
        root.style.setProperty('--ring', p);
        root.style.setProperty('--color-ring', p);
        root.style.setProperty('--chart-1', p);
        root.style.setProperty('--color-chart-1', p);
      }
      if (company?.secondary_color) {
        const s = company.secondary_color;
        document.documentElement.style.setProperty('--secondary', s);
        document.documentElement.style.setProperty('--color-secondary', s);
      }

      // 2. CHECK BILLING LIMITS & SUBSCRIPTION (THE GUARD)
      try {
        // Obter definições globais
        const { data: settings } = await supabase
          .from("system_settings")
          .select("free_plan_docs_limit, trial_days, maintenance_mode")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .single();

        if (settings?.maintenance_mode) {
          setIsBlocked(true);
          setBlockReason("Sistema em Manutenção");
          setInitializing(false);
          return;
        }

        // Obter subscrição atual da empresa
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        const hasActivePro = subscription && 
                             (subscription.status === "ativo" || subscription.status === "active") && 
                             subscription.valid_until && 
                             new Date(subscription.valid_until) > new Date();

        // Se tem Pro ativo, não há limites.
        if (!hasActivePro) {
          // A. Verificar Tempo (Trial Days)
          const daysSinceRegistration = differenceInDays(new Date(), new Date(company.created_at));
          const trialLimit = settings?.trial_days || 30; // Predefinição 30 dias se nulo

          if (daysSinceRegistration > trialLimit) {
            setIsBlocked(true);
            setBlockReason(`O seu período de utilização gratuita de ${trialLimit} dias expirou.`);
          } else {
            // B. Verificar Limite de Documentos deste mês
            const date = new Date();
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

            const { count } = await supabase
              .from("documents")
              .select("*", { count: 'exact', head: true })
              .eq("company_id", company.id)
              .gte("date", startOfMonth)
              .lte("date", endOfMonth);

            const currentDocs = count || 0;
            const docLimit = settings?.free_plan_docs_limit || 5;

            // Se for 0, é ilimitado (nas configs do admin).
            if (docLimit > 0 && currentDocs >= docLimit) {
              setIsBlocked(true);
              setBlockReason(`Atingiu o limite de ${docLimit} documentos gratuitos deste mês.`);
            }
          }
        } else {
          // Se tiver Pro ativo, certificamo-nos de que está desbloqueado.
          setIsBlocked(false);
        }

      } catch (err) {
        console.error("Erro a validar limites:", err);
      }

      setInitializing(false);
    }

    if (user && !loading) {
      initAndCheckBilling();
    } else if (!loading) {
      setInitializing(false);
    }
  }, [user, loading, navigate]);

  // Enforcement (Redirecionamento)
  useEffect(() => {
    if (isBlocked && !initializing) {
      const allowedPaths = ["/painel/assinatura", "/painel/suporte", "/painel/definicoes"];
      if (!allowedPaths.includes(location.pathname)) {
        navigate({ to: "/painel/assinatura" });
      }
    }
  }, [isBlocked, initializing, location.pathname, navigate]);

  if (loading || initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm font-medium text-muted-foreground">A preparar o seu painel...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 bg-background relative">
          
          {isBlocked && location.pathname !== "/painel/assinatura" && location.pathname !== "/painel/suporte" && location.pathname !== "/painel/definicoes" && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-100">
                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Acesso Bloqueado</h2>
                <p className="text-slate-500 mb-6">{blockReason}</p>
                <button 
                  onClick={() => navigate({ to: "/painel/assinatura" })}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold w-full hover:bg-primary/90 transition-colors"
                >
                  Regularizar Situação
                </button>
              </div>
            </div>
          )}

          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
