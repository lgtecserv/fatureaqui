import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Globe, ShieldCheck, Scale, Percent, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfiguracoesPage,
});

function AdminConfiguracoesPage() {
  const { t } = useTranslation();
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
      toast.success(t("admin.save_success"));
    },
    onError: () => {
      toast.error(t("admin.save_error"));
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
        <h1 className="text-3xl font-bold text-slate-900">{t("admin.settings_title")}</h1>
        <p className="text-slate-500 mt-1">{t("admin.settings_sub")}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="mb-8 bg-slate-100 p-1">
            <TabsTrigger value="geral" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">{t("admin.tab_general")}</TabsTrigger>
            <TabsTrigger value="limites" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">{t("admin.tab_limits")}</TabsTrigger>
            <TabsTrigger value="faturacao" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">{t("admin.tab_billing")}</TabsTrigger>
            <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6">{t("admin.tab_legal")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {t("admin.platform_info")}
                </CardTitle>
                <CardDescription>{t("admin.platform_info_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="app_name">{t("admin.app_name")}</Label>
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
                    <Label htmlFor="support_email">{t("admin.support_email")}</Label>
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
                    <Label htmlFor="support_phone">{t("admin.support_phone")}</Label>
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
                  {t("admin.free_plan_limits")}
                </CardTitle>
                <CardDescription>{t("admin.free_plan_limits_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="free_plan_docs_limit">{t("admin.max_docs")}</Label>
                    <Input 
                      id="free_plan_docs_limit" 
                      name="free_plan_docs_limit" 
                      type="number" 
                      min="0"
                      value={formData.free_plan_docs_limit} 
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.zero_unlimited")}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trial_days">{t("admin.trial_days")}</Label>
                    <Input 
                      id="trial_days" 
                      name="trial_days" 
                      type="number"
                      min="0"
                      value={formData.trial_days} 
                      onChange={handleChange} 
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.trial_days_desc")}</p>
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
                  {t("admin.taxes_currency")}
                </CardTitle>
                <CardDescription>{t("admin.taxes_currency_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="default_tax_rate">{t("admin.default_tax_rate")}</Label>
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
                    <Label htmlFor="currency">{t("admin.base_currency")}</Label>
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
                  {t("admin.legal_links")}
                </CardTitle>
                <CardDescription>{t("admin.legal_links_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="terms_url">{t("admin.terms_url")}</Label>
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
                  <Label htmlFor="privacy_url">{t("admin.privacy_url")}</Label>
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
                  {t("admin.maintenance_mode")}
                </CardTitle>
                <CardDescription className="text-red-600/80">
                  {t("admin.maintenance_mode_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">{t("admin.enable_maintenance")}</Label>
                    <p className="text-sm text-slate-500">
                      {t("admin.maintenance_notice")}
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
            {updateMutation.isPending ? t("admin.saving") : t("admin.save_settings")}
          </Button>
        </div>
      </form>
    </div>
  );
}
