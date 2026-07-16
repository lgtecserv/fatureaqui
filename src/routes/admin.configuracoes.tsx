import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Globe, ShieldCheck, Scale, Percent, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfiguracoesPage,
});

function AdminConfiguracoesPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    app_name: "FatureAqui",
    support_email: "",
    support_phone: "",
    free_plan_docs_limit: 5,
    trial_days: 0,
    default_tax_rate: 16.00,
    currency: "MZN",
    maintenance_mode: false,
    terms_url: "",
    privacy_url: ""
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings-global"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        app_name: settings.app_name ?? "FatureAqui",
        support_email: settings.support_email ?? "",
        support_phone: settings.support_phone ?? "",
        free_plan_docs_limit: settings.free_plan_docs_limit ?? 5,
        trial_days: settings.trial_days ?? 0,
        default_tax_rate: settings.default_tax_rate ?? 16.00,
        currency: settings.currency ?? "MZN",
        maintenance_mode: settings.maintenance_mode ?? false,
        terms_url: settings.terms_url ?? "",
        privacy_url: settings.privacy_url ?? ""
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const { error } = await supabase
        .from("system_settings")
        .update({
          ...newData,
          updated_at: new Date().toISOString()
        })
        .eq("id", "00000000-0000-0000-0000-000000000001");
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings-global"] });
      toast.success("Configurações globais guardadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao guardar. Verifique se executou a migração SQL no Supabase.");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      maintenance_mode: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Configurações Globais</h1>
        <p className="text-slate-500 mt-1">Gerencie informações da plataforma, limites do plano gratuito e segurança.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="mb-8 bg-slate-100 p-1">
            <TabsTrigger value="geral" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">Geral</TabsTrigger>
            <TabsTrigger value="limites" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">Limites & Planos</TabsTrigger>
            <TabsTrigger value="faturacao" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">Impostos & Moeda</TabsTrigger>
            <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">Legal & Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Informações da Plataforma
                </CardTitle>
                <CardDescription>Dados públicos que podem aparecer para os clientes das empresas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="app_name">Nome da Aplicação</Label>
                  <Input 
                    id="app_name" 
                    name="app_name" 
                    value={formData.app_name} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="support_email">Email de Suporte</Label>
                    <Input 
                      id="support_email" 
                      name="support_email" 
                      type="email"
                      placeholder="suporte@exemplo.com"
                      value={formData.support_email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="support_phone">Telefone de Suporte</Label>
                    <Input 
                      id="support_phone" 
                      name="support_phone" 
                      placeholder="+258 8X XXX XXXX"
                      value={formData.support_phone} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limites" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Limites do Plano Gratuito
                </CardTitle>
                <CardDescription>Defina os limites para empresas que não têm o plano Pro ativo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="free_plan_docs_limit">Nº Máximo de Documentos / Mês</Label>
                    <Input 
                      id="free_plan_docs_limit" 
                      name="free_plan_docs_limit" 
                      type="number" 
                      min="0"
                      value={formData.free_plan_docs_limit} 
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">Coloque 0 para ilimitado.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trial_days">Dias de Período de Teste (Trial)</Label>
                    <Input 
                      id="trial_days" 
                      name="trial_days" 
                      type="number"
                      min="0"
                      value={formData.trial_days} 
                      onChange={handleChange} 
                    />
                    <p className="text-xs text-muted-foreground">Dias de plano Pro gratuitos ao registar.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faturacao" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  Impostos e Moeda Padrão
                </CardTitle>
                <CardDescription>Valores base aplicados quando uma nova empresa é criada.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="default_tax_rate">Taxa de IVA Padrão (%)</Label>
                    <Input 
                      id="default_tax_rate" 
                      name="default_tax_rate" 
                      type="number"
                      step="0.1" 
                      min="0"
                      value={formData.default_tax_rate} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Moeda Base</Label>
                    <Input 
                      id="currency" 
                      name="currency" 
                      value={formData.currency} 
                      onChange={handleChange} 
                      placeholder="MT ou MZN"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Links Legais
                </CardTitle>
                <CardDescription>Links para as páginas legais da sua empresa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="terms_url">URL dos Termos de Serviço</Label>
                  <Input 
                    id="terms_url" 
                    name="terms_url" 
                    type="url"
                    placeholder="https://exemplo.com/termos"
                    value={formData.terms_url} 
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="privacy_url">URL da Política de Privacidade</Label>
                  <Input 
                    id="privacy_url" 
                    name="privacy_url" 
                    type="url"
                    placeholder="https://exemplo.com/privacidade"
                    value={formData.privacy_url} 
                    onChange={handleChange} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <ShieldCheck className="h-5 w-5" />
                  Modo de Segurança / Manutenção
                </CardTitle>
                <CardDescription className="text-red-600/80">
                  Bloqueie temporariamente o acesso de todas as empresas ao sistema (para atualizações).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Ativar Modo de Manutenção</Label>
                    <p className="text-sm text-slate-500">
                      O Super Admin continuará a ter acesso, mas as empresas verão uma página de manutenção.
                    </p>
                  </div>
                  <Switch 
                    checked={formData.maintenance_mode}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-border mt-8">
          <Button type="submit" size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {updateMutation.isPending ? "A Guardar..." : "Guardar Configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
