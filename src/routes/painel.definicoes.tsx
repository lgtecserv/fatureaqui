import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Upload, Lock, Palette, Save, Loader2, CreditCard, Sparkles, Crown, CheckCircle2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useState, useRef, useEffect } from "react";
import { StampGenerator } from "@/components/stamp-generator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { INVOICE_TEMPLATES, type InvoiceTemplateId } from "@/types";
import { useProPlan } from "@/hooks/use-pro-plan";

import { OnboardingChecklist } from "@/components/onboarding-checklist";

export const Route = createFileRoute("/painel/definicoes")({
  component: DefinicoesPage,
});

function Field({
  label,
  defaultValue,
  hint,
  wide,
  type = "text",
  name,
}: {
  label: string;
  defaultValue?: string;
  hint?: string;
  wide?: boolean;
  type?: string;
  name?: string;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ColorField({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: string;
  onChange?: (color: string) => void;
}) {
  const [color, setColor] = useState(defaultValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-background p-1"
        />
        <input
          type="text"
          value={color}
          onChange={handleChange}
          className="h-11 flex-1 rounded-xl border border-border bg-background px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

function DefinicoesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"empresa" | "seguranca" | "aparencia">("empresa");
  const formRef = useRef<HTMLFormElement>(null);
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Appearance State
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [stampStyle, setStampStyle] = useState<"style1" | "style2" | "style3" | "style4" | "style5">("style1");
  const [useDigitalStamp, setUseDigitalStamp] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateId>("classic");

  // Logo Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check Pro plan status via centralized hook
  const { isPro: hasActivePro } = useProPlan();

  useEffect(() => {
    if (company) {
      setPrimaryColor(company.primary_color || "");
      setSecondaryColor(company.secondary_color || "");
      setStampStyle(company.stamp_style || "style1");
      setUseDigitalStamp(company.use_digital_stamp !== false);
      setSelectedTemplate((company.invoice_template as InvoiceTemplateId) || "classic");
    }
  }, [company]);

  const updateCompany = useMutation({
    mutationFn: async (updates: any) => {
      if (!company) return;
      const { error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", company.id);

      if (error && (error.message?.includes("invoice_template") || error.message?.includes("bank_") || error.message?.includes("mpesa") || error.message?.includes("emola"))) {
        // Fallback defensivo caso a coluna ainda não exista no schema cache do Supabase
        const safeUpdates = { ...updates };
        delete safeUpdates.invoice_template;
        delete safeUpdates.bank_name;
        delete safeUpdates.bank_holder;
        delete safeUpdates.bank_account;
        delete safeUpdates.bank_iban;
        delete safeUpdates.mpesa_number;
        delete safeUpdates.emola_number;
        const retry = await supabase.from("companies").update(safeUpdates).eq("id", company.id);
        if (retry.error) throw retry.error;
      } else if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t("settings.msg_success"));
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: () => {
      toast.error(t("settings.msg_error"));
    }
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const updates = {
      name: formData.get("name"),
      nuit: formData.get("nuit"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      province: formData.get("province"),
      email: formData.get("email"),
      website: formData.get("website"),
      bank_name: formData.get("bank_name") || null,
      bank_holder: formData.get("bank_holder") || null,
      bank_account: formData.get("bank_account") || null,
      bank_iban: formData.get("bank_iban") || null,
      mpesa_number: formData.get("mpesa_number") || null,
      emola_number: formData.get("emola_number") || null,
    };
    updateCompany.mutate(updates);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t("settings.msg_pass_mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("settings.msg_pass_short"));
      return;
    }
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("settings.msg_pass_success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSaveAppearance = () => {
    const newPrimary = primaryColor || company?.primary_color || "#02664D";
    const newSecondary = secondaryColor || company?.secondary_color || "#1E2A38";
    
    updateCompany.mutate({
      primary_color: newPrimary,
      secondary_color: newSecondary,
      stamp_style: stampStyle,
      use_digital_stamp: useDigitalStamp,
      invoice_template: selectedTemplate,
    });
    
    // Apply globally immediately with full palette calculation
    const root = document.documentElement;
    const p = newPrimary;
    const s = newSecondary;
    
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
    
    root.style.setProperty('--secondary', s);
    root.style.setProperty('--color-secondary', s);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !company) return;

    // Validate size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      toast.error(t("settings.msg_logo_size"));
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error(t("settings.msg_logo_type"));
      return;
    }

    setIsUploading(true);
    toast.info(t("settings.msg_logo_uploading"));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      updateCompany.mutate({ logo_url: publicUrl });
      toast.success(t("settings.msg_logo_success"));
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(t("settings.msg_logo_error") + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const tabs = [
    { id: "empresa" as const, label: t("settings.tab_company"), icon: Building2 },
    { id: "seguranca" as const, label: t("settings.tab_security"), icon: Lock },
    { id: "aparencia" as const, label: t("settings.tab_appearance"), icon: Palette },
  ];

  return (
    <>
      <Topbar title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6">
        <OnboardingChecklist />
        
        {/* Tabs */}
        <div className="flex gap-1.5 rounded-full bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Empresa Tab */}
        {activeTab === "empresa" && (
          <form ref={formRef} onSubmit={handleSaveCompany} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
              <div className="grid h-16 w-16 shrink-0 overflow-hidden place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : company?.logo_url ? (
                  <img src={company.logo_url} alt="Logótipo" className="h-full w-full object-contain bg-white" />
                ) : (
                  <Building2 className="h-8 w-8" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-foreground">
                  {t("settings.tab_company")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.company_info")}
                </p>
              </div>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" /> 
                  {isUploading ? t("settings.uploading") : t("settings.upload_logo")}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label={t("settings.commercial_name")} name="name" defaultValue={company?.name} wide />
                  <Field label={t("settings.nuit")} name="nuit" defaultValue={company?.nuit} />
                  <Field label={t("settings.phone")} name="phone" defaultValue={company?.phone} />
                  <Field label={t("settings.address")} name="address" defaultValue={company?.address} wide />
                  <Field label={t("settings.city")} name="city" defaultValue={company?.city} />
                  <Field label={t("settings.province")} name="province" defaultValue={company?.province} />
                  <Field label={t("settings.email")} name="email" defaultValue={company?.email} />
                  <Field label={t("settings.website")} name="website" defaultValue={company?.website || ""} />
                </div>

                {/* Dados Bancários para Faturação */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Dados Bancários para Faturação</h3>
                      <p className="text-xs text-muted-foreground">Estes dados aparecem nas faturas para transferências e pagamentos dos clientes.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Nome do Banco" name="bank_name" defaultValue={company?.bank_name || ""} hint="Ex: BCI, Millennium BIM, Standard Bank, Moza" />
                    <Field label="Titular da Conta" name="bank_holder" defaultValue={company?.bank_holder || company?.name || ""} hint="Nome da empresa ou titular" />
                    <Field label="Número da Conta" name="bank_account" defaultValue={company?.bank_account || ""} hint="Ex: 0001 2345 6789" />
                    <Field label="NIB / IBAN" name="bank_iban" defaultValue={company?.bank_iban || ""} hint="Ex: 0008 0000 0000 1234 5678 9" />
                    <Field label="Número M-Pesa (Vodacom)" name="mpesa_number" defaultValue={company?.mpesa_number || ""} hint="Ex: 84 123 4567 ou 85 123 4567" />
                    <Field label="Número e-Mola (Movitel)" name="emola_number" defaultValue={company?.emola_number || ""} hint="Ex: 86 123 4567 ou 87 123 4567" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-border pt-6">
                  <button type="button" className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40">
                    {t("settings.cancel")}
                  </button>
                  <button type="submit" disabled={updateCompany.isPending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50">
                    {updateCompany.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {t("settings.save_changes")}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Segurança Tab */}
        {activeTab === "seguranca" && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  {t("settings.change_pass_title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.change_pass_desc")}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.current_pass")}</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.new_pass")}</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <p className="mt-1 text-xs text-muted-foreground">{t("settings.min_chars")}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.confirm_pass")}</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-6">
              <button 
                onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40"
              >
                {t("settings.cancel")}
              </button>
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !newPassword}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50"
              >
                {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {t("settings.change_pass_btn")}
              </button>
            </div>
          </div>
        )}

        {/* Aparência Tab */}
        {activeTab === "aparencia" && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  {t("settings.appearance_title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.appearance_desc")}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ColorField 
                    label={t("settings.primary_color")} 
                    defaultValue={company?.primary_color || "#02664D"} 
                    onChange={(c) => { setPrimaryColor(c); document.documentElement.style.setProperty('--color-primary', c); }}
                  />
                  <ColorField 
                    label={t("settings.secondary_color")} 
                    defaultValue={company?.secondary_color || "#1E2A38"} 
                    onChange={setSecondaryColor}
                  />
                </div>

                <div className="mt-6 rounded-xl bg-muted p-4">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t("settings.preview")}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <div className="h-10 w-24 rounded-lg" style={{ backgroundColor: primaryColor || company?.primary_color || 'var(--primary)' }} />
                    <div className="h-10 w-24 rounded-lg" style={{ backgroundColor: secondaryColor || company?.secondary_color || '#1E2A38' }} />
                  </div>
                </div>

                {/* Modelos de Fatura & Documentos */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <span>Modelos de Fatura & Documentos</span>
                          {!hasActivePro && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                              <Crown className="h-3 w-3" /> PRO
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Selecione o design padrão aplicado a todas as faturas, recibos e cotações emitidas pela sua empresa.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {INVOICE_TEMPLATES.map((tpl) => {
                      const isSelected = selectedTemplate === tpl.id;
                      const isLocked = tpl.isPro && !hasActivePro;

                      return (
                        <div
                          key={tpl.id}
                          onClick={() => {
                            if (isLocked) {
                              toast.info(`O modelo ${tpl.name} é exclusivo do Plano Pro.`, {
                                description: "Faça upgrade para desbloquear todos os modelos executivos!",
                                action: {
                                  label: "Fazer Upgrade",
                                  onClick: () => navigate({ to: "/painel/assinatura" }),
                                },
                              });
                              return;
                            }
                            setSelectedTemplate(tpl.id);
                          }}
                          className={cn(
                            "relative cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none",
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-md"
                              : "border-border bg-card hover:border-primary/40 hover:bg-muted/30 shadow-xs",
                            isLocked && "opacity-80 hover:opacity-100"
                          )}
                        >
                          {/* Visual Card Mockup */}
                          <div className="w-full h-36 rounded-xl bg-background border border-border/80 p-2.5 mb-2.5 flex flex-col justify-between shadow-xs pointer-events-none overflow-hidden relative">
                            {/* Template Specific Mini Artwork */}
                            {tpl.id === "classic" && (
                              <div className="w-full h-full flex flex-col justify-between">
                                <div className="h-4 w-full bg-primary/20 rounded-b-xl flex items-center px-1.5 justify-between">
                                  <div className="h-1.5 w-6 bg-primary rounded-full" />
                                  <div className="h-1.5 w-8 bg-gray-400/50 rounded-full" />
                                </div>
                                <div className="space-y-1 px-1">
                                  <div className="h-1.5 w-12 bg-primary/40 rounded-full" />
                                  <div className="h-1.5 w-full bg-muted rounded" />
                                  <div className="h-1.5 w-full bg-muted rounded" />
                                  <div className="h-1.5 w-3/4 bg-muted rounded" />
                                </div>
                                <div className="flex justify-between items-center px-1 border-t border-border pt-1">
                                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                                  <div className="h-2 w-10 bg-primary rounded" />
                                </div>
                              </div>
                            )}

                            {tpl.id === "corporate" && (
                              <div className="w-full h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <div className="h-2 w-8 bg-gray-800 rounded" />
                                  <div className="h-2 w-10 bg-amber-400 rounded-sm" />
                                </div>
                                <div className="border border-gray-800 rounded-xs p-0.5 space-y-0.5 my-1">
                                  <div className="h-1.5 bg-gray-800 rounded-xs w-full" />
                                  <div className="h-1 bg-gray-200 rounded-xs w-full" />
                                  <div className="h-1 bg-gray-200 rounded-xs w-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="h-1.5 w-6 bg-gray-300 rounded" />
                                  <div className="h-2.5 w-8 bg-amber-400 rounded-xs" />
                                </div>
                                <div className="h-1 w-full bg-amber-400 rounded-xs mt-1" />
                              </div>
                            )}

                            {tpl.id === "modern" && (
                              <div className="w-full h-full flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                  <div className="h-3 w-3 bg-gray-800 rounded-xs" />
                                  <div className="h-1.5 w-8 bg-gray-900 rounded font-bold" />
                                </div>
                                <div className="space-y-1 my-1">
                                  <div className="h-2 bg-gray-800 rounded w-full" />
                                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-200 pt-1">
                                  <div>
                                    <div className="h-1 w-6 bg-gray-300 rounded mb-0.5" />
                                    <div className="h-2 w-10 bg-gray-900 rounded" />
                                  </div>
                                  <div className="h-2.5 w-8 bg-gray-800 rounded" />
                                </div>
                              </div>
                            )}

                            {tpl.id === "geometric" && (
                              <div className="w-full h-full flex flex-col justify-between relative">
                                <div className="absolute top-0 right-0 w-14 h-4 bg-amber-400 clip-diagonal" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
                                <div className="h-2 w-6 bg-gray-800 rounded mt-0.5" />
                                <div className="border border-gray-800 rounded-xs p-0.5 space-y-0.5 my-1">
                                  <div className="h-1.5 bg-[#1E2238] rounded-xs w-full" />
                                  <div className="h-1 bg-gray-200 rounded-xs w-full" />
                                  <div className="h-1 bg-gray-200 rounded-xs w-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="h-1.5 w-8 bg-gray-400 rounded" />
                                  <div className="h-2 w-8 bg-amber-400 rounded-xs" />
                                </div>
                                <div className="h-1.5 w-10 bg-amber-400 mt-1" style={{ clipPath: "polygon(0 0, 100% 0, 75% 100%, 0 100%)" }} />
                              </div>
                            )}

                            {tpl.id === "boutique" && (
                              <div className="w-full h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <div className="h-3 w-10 bg-blue-900 rounded-xs font-black" />
                                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                                </div>
                                <div className="space-y-1 my-1 border-t border-b border-blue-900 py-1">
                                  <div className="h-1 bg-gray-200 rounded w-full" />
                                  <div className="h-1 bg-gray-200 rounded w-full" />
                                </div>
                                <div className="flex justify-between items-end">
                                  <span className="text-[8px] italic font-serif text-blue-900">Obrigado</span>
                                  <div className="h-2 w-10 bg-blue-900 rounded-xs" />
                                </div>
                              </div>
                            )}

                            {/* Selection Checkmark */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shadow">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </div>
                            )}

                            {/* Locked Overlay if Pro */}
                            {isLocked && (
                              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                  <Crown className="h-3 w-3" /> PRO
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Meta */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                                {tpl.name}
                              </h4>
                              {tpl.badge && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                  {tpl.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {tpl.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{t("settings.stamp_title")}</h3>
                      <p className="text-xs text-muted-foreground">{t("settings.stamp_desc")}</p>
                    </div>
                    <label className="flex items-center cursor-pointer gap-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={useDigitalStamp} onChange={(e) => setUseDigitalStamp(e.target.checked)} />
                        <div className={`block w-10 h-6 rounded-full transition ${useDigitalStamp ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${useDigitalStamp ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  
                  {useDigitalStamp && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-foreground mb-4">{t("settings.stamp_design_title")}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{t("settings.stamp_design_desc")}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(["style1", "style2", "style3", "style4", "style5"] as const).map((style) => (
                      <div 
                        key={style}
                        onClick={() => setStampStyle(style)}
                        className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-between gap-4 transition ${stampStyle === style ? "border-primary bg-primary-soft/10 ring-2 ring-primary/20 shadow-soft" : "border-border hover:border-primary/50"}`}
                      >
                        <div className="w-full h-24 flex items-center justify-center">
                          <StampGenerator 
                            companyName={company?.name || "SUA EMPRESA"} 
                            companyNuit={company?.nuit || "000000000"} 
                            companyCity={company?.city || "MAPUTO"}
                            companyPhone={company?.phone || "---"}
                            companyAddress={company?.address || ""}
                            color={primaryColor || company?.primary_color || 'var(--primary)'}
                            style={style}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider text-center">
                          {t(`settings.${style}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-border pt-6">
                  <button className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40">
                    {t("settings.reset_default")}
                  </button>
                  <button 
                    onClick={handleSaveAppearance}
                    disabled={updateCompany.isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-50"
                  >
                    {updateCompany.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {t("settings.save_colors")}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
