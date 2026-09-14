import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Send, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/marketing")({
  component: AdminMarketingPage,
});

function AdminMarketingPage() {
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

      const adminEmails = ["lgtecserv@gmail.com", "lgtecserv.com@gmail.com"];
      const filteredComps = comps.filter(c => !adminEmails.includes(c.email));
      
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

  const selectedCompanies = companies?.filter(c => audience === "all" || c.status === audience) || [];

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      if (!subject.trim() || !htmlContent.trim()) {
        throw new Error("O assunto e a mensagem são obrigatórios.");
      }
      if (selectedCompanies.length === 0) {
        throw new Error("Nenhum destinatário selecionado.");
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
      return data;
    },
    onSuccess: () => {
      toast.success("Campanha de email enviada com sucesso para " + selectedCompanies.length + " destinatários!");
      setSubject("");
      setHtmlContent("");
      setCtaText("");
      setCtaLink("");
    },
    onError: (err) => {
      toast.error(`Erro ao enviar email: ${err.message}`);
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
    <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" /> Marketing e Comunicação
        </h1>
        <p className="text-slate-500 mt-1">Crie e envie campanhas de email para os utilizadores da plataforma (Resend).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Campanha</CardTitle>
              <CardDescription>Escreva o email que será enviado aos clientes selecionados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Assunto do Email</label>
                <Input 
                  placeholder="Ex: Novidades de Outubro no FatureAqui!" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Mensagem (Suporta HTML)</label>
                <div className="mt-1.5 bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200 mb-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>O cabeçalho e o rodapé serão adicionados automaticamente. As quebras de linha que escrever aqui serão respeitadas no email final.</p>
                </div>
                <textarea 
                  placeholder="Escreva a sua mensagem aqui..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full min-h-[300px] p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-sans bg-slate-50"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Botão: Texto (Opcional)</label>
                  <Input 
                    placeholder="Ex: Aceder à Plataforma" 
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Botão: Link (Opcional)</label>
                  <Input 
                    placeholder="Ex: https://fatureaqui.com/painel" 
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
                  {sendEmailMutation.isPending ? "A enviar..." : `Enviar para ${selectedCompanies.length} Empresas`}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Audiência</CardTitle>
              <CardDescription>Para quem deseja enviar este email?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "all", label: "Todos os Utilizadores", count: companies?.length || 0 },
                { id: "active", label: "Subscritores PRO (Ativos)", count: companies?.filter(c => c.status === "active").length || 0 },
                { id: "trial", label: "Em Período de Teste (Trial)", count: companies?.filter(c => c.status === "trial").length || 0 },
                { id: "expired", label: "Contas Expiradas", count: companies?.filter(c => c.status === "expired").length || 0 },
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
              <h4 className="font-bold text-slate-900 mb-2">Automacões Ativas</h4>
              <ul className="space-y-2 list-disc pl-4 marker:text-primary">
                <li><strong>Boas-vindas:</strong> Enviado no registo.</li>
                <li><strong>Aviso de Fim de Teste:</strong> Enviado 3 dias antes do fim.</li>
                <li><strong>Inatividade:</strong> Enviado após 7 dias sem atividade.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">Estas automações são geridas pela Supabase e executadas de forma invisível.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
