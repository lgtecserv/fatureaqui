import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Send, Users, AlertCircle, History, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { pt } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/marketing")({
  component: AdminMarketingPage,
});

function AdminMarketingPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [audience, setAudience] = useState<"all" | "active" | "expired" | "trial">("all");

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["admin-marketing-companies"],
    queryFn: async () => {
      const { data: comps, error: compError } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (compError) throw compError;
      if (!comps || comps.length === 0) return [];

      const filteredComps = comps; // Removi o bloqueio aos emails de admin para testes
      
      const userIds = filteredComps.map(c => c.user_id);
      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .in("user_id", userIds);

      if (subsError) throw subsError;

      const { data: settings } = await supabase
        .from("system_settings")
        .select("trial_days")
        .limit(1)
        .single();
      const trialDays = settings?.trial_days || 30;

      return filteredComps.map(comp => {
        const subscription = subs?.find(s => s.user_id === comp.user_id);
        const isPro = subscription?.plan_type === 'pro' && subscription?.status === 'ativo';
        
        const created = new Date(comp.created_at);
        created.setDate(created.getDate() + trialDays);
        const expired = !isPro && created < new Date();
        const isTrial = !isPro && !expired;

        let status: "active" | "expired" | "trial" = "trial";
        if (isPro) status = "active";
        else if (expired) status = "expired";

        return {
          ...comp,
          status
        };
      });
    }
  });

  const { data: history } = useQuery({
    queryKey: ["marketing_campaigns_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const selectedCompanies = companies?.filter(c => audience === "all" || c.status === audience) || [];

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      if (!subject.trim() || !htmlContent.trim()) {
        throw new Error(t("admin.subj_msg_required"));
      }
      if (selectedCompanies.length === 0) {
        throw new Error(t("admin.no_recipient"));
      }

      const emails = selectedCompanies.map(c => c.email);
      
      // Preserve line breaks for plain text formatting
      const formattedHtml = htmlContent.replace(/\n/g, '<br />');

      // Envia os emails através da Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("send-marketing-email", {
        body: { 
          emails, 
          subject, 
          htmlContent: formattedHtml,
          ctaText: ctaText.trim() || undefined,
          ctaLink: ctaLink.trim() || undefined
        },
      });

      if (error) throw error;

      // Guarda o histórico
      await supabase.from("marketing_campaigns").insert({
        subject,
        html_content: htmlContent, // Save original unformatted text for reuse
        cta_text: ctaText.trim() || null,
        cta_link: ctaLink.trim() || null,
        audience,
        sent_count: emails.length
      });

      return data;
    },
    onSuccess: () => {
      toast.success(t("admin.campaign_success", { count: selectedCompanies.length }));
      setSubject("");
      setHtmlContent("");
      setCtaText("");
      setCtaLink("");
      queryClient.invalidateQueries({ queryKey: ["marketing_campaigns_history"] });
    },
    onError: (err) => {
      toast.error(t("admin.send_error", { message: err.message }));
    }
  });

  if (isLoadingCompanies) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" /> {t("admin.marketing_title")}
        </h1>
        <p className="text-slate-500 mt-1">{t("admin.marketing_sub")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.new_campaign")}</CardTitle>
              <CardDescription>{t("admin.new_campaign_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("admin.email_subject")}</label>
                <Input 
                  placeholder={t("admin.email_subject_ph")}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">{t("admin.message_html")}</label>
                <div className="mt-1.5 bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200 mb-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{t("admin.message_html_notice")}</p>
                </div>
                <textarea 
                  placeholder={t("admin.message_ph")}
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full min-h-[300px] p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-sans bg-slate-50"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-sm font-semibold text-slate-700">{t("admin.btn_text_opt")}</label>
                  <Input 
                    placeholder={t("admin.btn_text_ph")}
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">{t("admin.btn_link_opt")}</label>
                  <Input 
                    placeholder={t("admin.btn_link_ph")}
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => sendEmailMutation.mutate()}
                  disabled={sendEmailMutation.isPending || selectedCompanies.length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-50"
                >
                  {sendEmailMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sendEmailMutation.isPending ? t("admin.sending") : t("admin.send_campaign", { count: selectedCompanies.length })}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Campanhas */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5 text-primary" /> {t("admin.campaign_history")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {history && history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900">{campaign.subject}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="bg-white border rounded px-2 py-0.5 font-medium">{format(new Date(campaign.created_at), t("admin.sent_on"), { locale: pt })}</span>
                            <span className="bg-slate-200/50 rounded px-2 py-0.5">{t("admin.sent_to", { count: campaign.sent_count })}</span>
                            {campaign.cta_text && (
                              <span className="bg-primary/10 text-primary font-medium rounded px-2 py-0.5 flex items-center gap-1">{t("admin.btn_included")}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSubject(campaign.subject);
                            setHtmlContent(campaign.html_content);
                            setCtaText(campaign.cta_text || "");
                            setCtaLink(campaign.cta_link || "");
                            setAudience(campaign.audience as any);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            toast.success(t("admin.campaign_loaded"));
                          }}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors w-full sm:w-auto justify-center"
                        >
                          <RefreshCw className="h-3 w-3" /> {t("admin.reuse")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  {t("admin.no_campaigns")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> {t("admin.audience")}</CardTitle>
              <CardDescription>{t("admin.audience_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "all", label: t("admin.audience_all"), count: companies?.length || 0 },
                { id: "active", label: t("admin.audience_pro"), count: companies?.filter(c => c.status === "active").length || 0 },
                { id: "trial", label: t("admin.audience_trial"), count: companies?.filter(c => c.status === "trial").length || 0 },
                { id: "expired", label: t("admin.audience_expired"), count: companies?.filter(c => c.status === "expired").length || 0 },
              ].map((group) => (
                <label key={group.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${audience === group.id ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="audience" 
                      className="accent-primary w-4 h-4"
                      checked={audience === group.id}
                      onChange={() => setAudience(group.id as any)}
                    />
                    <span className="text-sm font-medium text-slate-700">{group.label}</span>
                  </div>
                  <span className="text-xs font-bold bg-white border px-2 py-1 rounded-full text-slate-500">{group.count}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-dashed border-slate-300">
            <CardContent className="p-5 text-sm text-slate-600">
              <h4 className="font-bold text-slate-900 mb-2">{t("admin.active_automations")}</h4>
              <ul className="space-y-2 list-disc pl-4 marker:text-primary">
                <li><strong>{t("admin.auto_welcome")}</strong> {t("admin.auto_welcome_desc")}</li>
                <li><strong>{t("admin.auto_trial_end")}</strong> {t("admin.auto_trial_end_desc")}</li>
                <li><strong>{t("admin.auto_inactivity")}</strong> {t("admin.auto_inactivity_desc")}</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">{t("admin.auto_managed")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
