import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Upload, CheckCircle, Banknote, Building2, Loader2, ArrowRight, Clock } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/assinatura")({
  component: AssinaturaPage,
});

function AssinaturaPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    }
  });

  const { data: subscription, isLoading: isSubLoading } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user
  });

  const submitReceipt = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado");
      if (!file) throw new Error("Selecione um comprovativo primeiro");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Fazer upload do ficheiro
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, file);

      if (uploadError) throw new Error("Erro ao fazer upload do ficheiro");

      const { data: { publicUrl } } = supabase.storage
        .from("receipts")
        .getPublicUrl(filePath);

      // 2. Atualizar ou Criar Subscrição como Pendente
      const { error: dbError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan_type: "pro",
          status: "pendente",
          receipt_url: publicUrl,
          notes: notes || null,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

      if (dbError) throw dbError;
      return true;
    },
    onSuccess: () => {
      toast.success("Comprovativo enviado com sucesso! Aguarde aprovação.");
      setFile(null);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao enviar comprovativo.");
    }
  });

  const now = new Date();
  const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
  const isExpired = validUntil ? now > validUntil : false;

  const isPro = (subscription?.status === "ativo" || subscription?.status === "active") && !isExpired;
  const isPending = subscription?.status === "pendente";

  const daysLeft = isPro && validUntil ? Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const canRenew = isPro && daysLeft <= 5;

  const plans = [
    {
      name: "Gratuito",
      price: "0 MT",
      features: [
        settings?.free_plan_docs_limit === 0 ? "Documentos ilimitados" : `${settings?.free_plan_docs_limit || 5} documentos/mês`, 
        "1 tipo de documento", 
        "Suporte por email"
      ],
      current: !isPro && !isPending,
    },
    {
      name: "Pro",
      price: settings?.pro_price ? `${new Intl.NumberFormat("pt-MZ").format(settings.pro_price)} MT/mês` : "1.500 MT/mês",
      features: [
        "Documentos ilimitados",
        "Todos os 7 tipos de documento",
        "Geração de PDF",
        "Suporte prioritário",
        "Múltiplos utilizadores",
      ],
      current: isPro,
      recommended: !isPro,
    },
  ];

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <Topbar
        title="Assinatura"
        subtitle="Gerencie o seu plano de subscrição"
      />

      <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6 pb-24">
        {/* Current status */}
        <div className={`flex items-center gap-3 rounded-2xl border p-5 shadow-soft ${isPending ? 'border-amber-200 bg-amber-50' : 'border-border bg-card'}`}>
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-primary-soft text-primary-soft-foreground'}`}>
            {isPending ? <Clock className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground">
              Plano actual: <span className={isPending ? 'text-amber-700' : 'text-primary'}>{isPro ? "Pro" : "Gratuito"}</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              {isPending ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Clock className="h-3.5 w-3.5" /> Pendente de Aprovação
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <CheckCircle className="h-3.5 w-3.5" /> Activo
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-6 shadow-soft transition ${
                plan.recommended
                  ? "border-primary shadow-elevated"
                  : "border-border"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Recomendado
                </span>
              )}
              <h3 className="text-xl font-extrabold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-2 text-2xl font-extrabold tabular text-foreground">
                {plan.price}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              
              {plan.name === "Pro" && !isPro && !isPending && (
                <button
                  onClick={scrollToUpload}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-95 transition"
                >
                  Fazer upgrade <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {plan.name === "Pro" && canRenew && !isPending && (
                <button
                  onClick={scrollToUpload}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-primary-soft text-primary-soft-foreground text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition"
                >
                  Renovar Plano ({daysLeft} dias restantes) <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {plan.current && !canRenew && (
                <button
                  className="mt-6 flex h-11 w-full items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-muted-foreground transition"
                  disabled
                >
                  {isPro && plan.name === "Pro" ? `Plano actual (${daysLeft} dias)` : "Plano actual"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Upload receipt */}
        {(!isPro || canRenew) && (
          <div ref={uploadSectionRef} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden mt-8 scroll-mt-24">
          <div className="bg-slate-50 p-6 border-b border-border">
            <h3 className="text-base font-bold text-foreground mb-4">
              Instruções de Pagamento
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {(settings?.mpesa_number || settings?.mpesa_name) && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-red-100 p-2 text-red-600">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">M-Pesa</h4>
                    <div className="mt-1 space-y-1 text-sm text-slate-600">
                      {settings.mpesa_number && <p>Número: <span className="font-medium text-slate-900">{settings.mpesa_number}</span></p>}
                      {settings.mpesa_name && <p>Nome: <span className="font-medium text-slate-900">{settings.mpesa_name}</span></p>}
                    </div>
                  </div>
                </div>
              )}

              {(settings?.emola_number || settings?.emola_name) && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-orange-100 p-2 text-orange-600">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">e-Mola</h4>
                    <div className="mt-1 space-y-1 text-sm text-slate-600">
                      {settings.emola_number && <p>Número: <span className="font-medium text-slate-900">{settings.emola_number}</span></p>}
                      {settings.emola_name && <p>Nome: <span className="font-medium text-slate-900">{settings.emola_name}</span></p>}
                    </div>
                  </div>
                </div>
              )}
              
              {(settings?.bank_account || settings?.bank_nib) && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{settings.bank_name || "Transferência Bancária"}</h4>
                    <div className="mt-1 space-y-1 text-sm text-slate-600">
                      {settings.bank_account && <p>Conta: <span className="font-medium text-slate-900">{settings.bank_account}</span></p>}
                      {settings.bank_nib && <p>NIB: <span className="font-medium text-slate-900">{settings.bank_nib}</span></p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {isPending ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Comprovativo em Análise</h3>
                <p className="mt-2 max-w-md text-slate-600">
                  Recebemos o seu comprovativo e estamos a verificar o pagamento. A sua conta Pro será ativada brevemente.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">Enviar comprovativo de pagamento</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Após efectuar o pagamento, envie o comprovativo para activar o plano Pro.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Comprovativo (PDF, JPG, PNG)</label>
                    <div className="flex items-center gap-3">
                      <label className="relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-slate-50 px-6 py-4 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary hover:bg-primary-soft/10 w-full">
                        <Upload className="h-5 w-5" /> 
                        {file ? file.name : "Clique para anexar ficheiro"}
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, application/pdf"
                          className="sr-only" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Notas Adicionais (Opcional)</label>
                    <textarea 
                      placeholder="Ex: Pagamento feito a partir do número 84..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-[60px] rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-border flex justify-end">
                  <button 
                    onClick={() => submitReceipt.mutate()}
                    disabled={submitReceipt.isPending || !file}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
                  >
                    {submitReceipt.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar para Aprovação"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
