import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Code, Key, Copy, Plus, Trash2, ShieldAlert, Lock, ExternalLink, Webhook } from "lucide-react";

export const Route = createFileRoute("/painel/api")({
  component: ApiPage,
});

function ApiPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const { data: company } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("subscriptions").select("status, valid_until").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user
  });

  const { data: apiKeys, isLoading: isLoadingKeys } = useQuery({
    queryKey: ["api-keys", company?.id],
    queryFn: async () => {
      if (!company) return [];
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!company
  });

  const now = new Date();
  const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
  const isProActive = (subscription?.status === "ativo" || subscription?.status === "active") && validUntil && now <= validUntil;

  const generateKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!company) throw new Error("Empresa não encontrada");
      
      // Generate a random key
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const randomString = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      const rawKey = `fat_live_${randomString}`;
      
      // Generate SHA-256 Hash
      const msgUint8 = new TextEncoder().encode(rawKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const preview = `fat_live_...${rawKey.slice(-4)}`;

      const { error } = await supabase
        .from("api_keys")
        .insert({
          company_id: company.id,
          name,
          key_hash: keyHash,
          preview
        });

      if (error) throw error;
      return rawKey;
    },
    onSuccess: (rawKey) => {
      setGeneratedKey(rawKey);
      setNewKeyName("");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("Chave gerada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao gerar chave.");
    }
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("Chave revogada.");
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  if (!isProActive) {
    return (
      <>
        <Topbar title="API e Integrações" subtitle="Ligue o FatureAqui aos seus sistemas" />
        <div className="mx-auto w-full max-w-4xl p-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Lock className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Funcionalidade Exclusiva Pro</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              A criação de Chaves de API e integrações com sistemas externos (como E-commerces e ERPs) está disponível apenas no plano Pro.
            </p>
            <Link to="/painel/assinatura" className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Fazer Upgrade para Pro
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="API e Integrações" subtitle="Faça a gestão das suas chaves de acesso" />
      <div className="mx-auto w-full max-w-4xl space-y-8 p-4 sm:p-6 pb-24">
        
        {/* Header Banner */}
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Code className="h-5 w-5 text-indigo-400" />
                Acesso para Programadores
              </h2>
              <p className="mt-2 max-w-xl text-slate-300">
                Gere chaves secretas para ligar a sua loja online, ERP ou sistema POS ao FatureAqui. 
                Nunca partilhe estas chaves publicamente.
              </p>
            </div>
            <a href="/docs/api" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
              Ver Documentação <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Generate New Key */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-lg font-bold text-foreground mb-4">Gerar Nova Chave</h3>
          
          {generatedKey ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 relative">
              <div className="flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-900">Guarde a sua chave secreta</h4>
                  <p className="text-sm text-emerald-700 mt-1 mb-4">
                    Por motivos de segurança, esta chave <strong>não voltará a ser mostrada</strong>. 
                    Copie-a agora e guarde num local seguro.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-emerald-200 rounded-lg p-3 text-sm font-mono text-slate-800 break-all">
                      {generatedKey}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(generatedKey)}
                      className="shrink-0 rounded-lg bg-emerald-600 p-3 text-white hover:bg-emerald-700 transition"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setGeneratedKey(null)}
                    className="mt-6 text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    Já guardei a chave, fechar este aviso.
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome da Integração</label>
                <input 
                  type="text" 
                  placeholder="Ex: Loja Shopify, App Mobile, POS..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button 
                disabled={!newKeyName || generateKeyMutation.isPending}
                onClick={() => generateKeyMutation.mutate(newKeyName)}
                className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Gerar Chave
              </button>
            </div>
          )}
        </div>

        {/* Existing Keys */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
          <div className="border-b border-border bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-foreground">As suas Chaves de API</h3>
          </div>
          <div className="p-0">
            {isLoadingKeys ? (
              <div className="p-8 text-center text-muted-foreground">A carregar chaves...</div>
            ) : !apiKeys || apiKeys.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Key className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-slate-900">Sem chaves ativas</h4>
                <p className="text-sm text-slate-500 mt-1">Crie a sua primeira chave acima para começar.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Nome</th>
                    <th className="px-6 py-3 font-medium">Chave (Censurada)</th>
                    <th className="px-6 py-3 font-medium">Última Utilização</th>
                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{k.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{k.preview}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString("pt-PT") : "Nunca usada"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (confirm("Tem a certeza? Os sistemas que usam esta chave deixarão de funcionar.")) {
                              revokeKeyMutation.mutate(k.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Revogar Chave"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Webhooks Section */}
        {company && <WebhooksPanel companyId={company.id} />}

      </div>
    </>
  );
}

function WebhooksPanel({ companyId }: { companyId: string }) {
  const queryClient = useQueryClient();
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvent, setNewWebhookEvent] = useState<string>("*");
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhooks")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (params: { url: string, events: string[] }) => {
      // Secret is generated securely in JS for webhook signing
      const secret = "whsec_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const { data, error } = await supabase.from("webhooks").insert({
        company_id: companyId,
        url: params.url,
        events: params.events,
        secret
      }).select().single();
      if (error) throw error;
      return { data, secret };
    },
    onSuccess: (res) => {
      toast.success("Webhook criado com sucesso!");
      setNewWebhookUrl("");
      setGeneratedSecret(res.secret);
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    onError: (err: any) => {
      toast.error("Erro ao criar webhook: " + err.message);
    }
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webhooks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Webhook eliminado!");
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    }
  });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft mt-8">
      <div className="border-b border-border bg-slate-50 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" /> Webhooks
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Seja notificado automaticamente quando eventos ocorrerem (ex: fatura paga).
          </p>
        </div>
      </div>
      
      <div className="p-6 border-b border-border">
        {generatedSecret ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 relative">
            <div className="flex items-start gap-4">
              <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-amber-900">Guarde o Segredo do Webhook (Secret)</h4>
                <p className="text-sm text-amber-700 mt-1 mb-4">
                  Esta chave é usada para assinar os pedidos enviados para o seu servidor. <strong>Não voltará a ser mostrada</strong>.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-amber-200 rounded-lg p-3 text-sm font-mono text-slate-800 break-all">
                    {generatedSecret}
                  </code>
                </div>
                <button 
                  onClick={() => setGeneratedSecret(null)}
                  className="mt-6 text-sm font-semibold text-amber-700 hover:underline"
                >
                  Já guardei a chave, fechar este aviso.
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-slate-700">URL de Destino</label>
              <input 
                type="url" 
                placeholder="https://sua-loja.com/api/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2 w-full md:w-auto">
              <label className="text-sm font-medium text-slate-700">Evento</label>
              <select
                value={newWebhookEvent}
                onChange={(e) => setNewWebhookEvent(e.target.value)}
                className="w-full md:w-48 h-11 rounded-xl border border-border px-4 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="*">Todos os Eventos</option>
                <option value="fatura.criada">Fatura Criada</option>
                <option value="fatura.atualizada">Fatura Atualizada</option>
                <option value="cliente.criado">Cliente Criado</option>
              </select>
            </div>
            <button 
              disabled={!newWebhookUrl || createWebhookMutation.isPending}
              onClick={() => createWebhookMutation.mutate({ url: newWebhookUrl, events: [newWebhookEvent] })}
              className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        )}
      </div>

      <div className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">A carregar webhooks...</div>
        ) : !webhooks || webhooks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Nenhum webhook configurado.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="px-6 py-3 font-medium">Eventos</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {webhooks.map((w: any) => (
                <tr key={w.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-slate-900 truncate max-w-[200px]" title={w.url}>
                    {w.url}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                      {w.events.join(", ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        if (confirm("Tem a certeza que deseja remover este Webhook?")) {
                          deleteWebhookMutation.mutate(w.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remover Webhook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
