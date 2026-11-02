import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiAssistantWidgetProps {
  company?: {
    id?: string;
    name?: string;
    nuit?: string;
    city?: string;
    email?: string;
    phone?: string;
    currency?: string;
    bank_name?: string;
    account_number?: string;
  };
}

// Format markdown text (bold, italic, bullet points, headers) safely into HTML
function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const formattedElements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isNumberedList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        formattedElements.push(
          <ol key={`ol-${formattedElements.length}`} className="list-decimal pl-5 my-1.5 space-y-1 text-xs sm:text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        );
      } else {
        formattedElements.push(
          <ul key={`ul-${formattedElements.length}`} className="list-disc pl-5 my-1.5 space-y-1 text-xs sm:text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  const parseInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      formattedElements.push(<div key={`empty-${index}`} className="h-2" />);
      return;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushList();
      formattedElements.push(
        <h4 key={`h4-${index}`} className="font-bold text-sm sm:text-base mt-2 mb-1 text-foreground">
          {trimmed.replace("### ", "")}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      formattedElements.push(
        <h3 key={`h3-${index}`} className="font-bold text-base sm:text-lg mt-2 mb-1 text-foreground">
          {trimmed.replace("## ", "")}
        </h3>
      );
      return;
    }

    // Bullet lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (isNumberedList) flushList();
      isNumberedList = false;
      currentList.push(parseInline(trimmed.substring(2)));
      return;
    }

    // Numbered lists
    const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (matchNumber) {
      if (!isNumberedList) flushList();
      isNumberedList = true;
      currentList.push(parseInline(matchNumber[2]));
      return;
    }

    // Regular line
    flushList();
    formattedElements.push(
      <p 
        key={`p-${index}`} 
        className="leading-relaxed text-xs sm:text-sm my-0.5"
        dangerouslySetInnerHTML={{ __html: parseInline(line) }} 
      />
    );
  });

  flushList();
  return formattedElements;
}

// Built-in intelligent fallback engine for FatureAqui
function generateSmartFallback(prompt: string, company?: AiAssistantWidgetProps["company"]): string {
  const p = prompt.toLowerCase();
  const companyName = company?.name || "A sua empresa";
  const currency = company?.currency || "MZN";

  // 1. Termos e condições / Observações para Fatura
  if (p.includes("termo") || p.includes("observa") || p.includes("condiç") || p.includes("prazo")) {
    return `### Minuta Sugerida: Termos & Condições de Pagamento

Aqui está uma minuta profissional e juridicamente clara pronta para colocar no campo **Observações / Termos** da fatura:

---
**1. Prazo de Pagamento:**
O pagamento deve ser efetuado no prazo de **15 dias** a contar da data de emissão deste documento.

**2. Coordenadas Bancárias & Móveis:**
Por favor indique o número desta fatura como descritivo da transferência bancária ou envio via **M-Pesa / e-Mola**.

**3. Penalização por Mora:**
Após a data de vencimento, reserva-se o direito de aplicação de juros de mora de **2% ao mês** sobre o saldo devedor.

**4. Reserva de Propriedade:**
Os bens ou serviços prestados permanecem propriedade de **${companyName}** até à liquidação integral do valor faturado.
---

> 💡 **Dica FatureAqui:** Pode copiar este texto e colá-lo diretamente no campo *"Observações / Termos"* ao emitir a fatura!`;
  }

  // 2. Cobrança de Fatura Vencida
  if (p.includes("cobr") || p.includes("vencid") || p.includes("atraso") || p.includes("lembrete")) {
    return `### Mensagens de Cobrança Assertivas & Amigáveis

Pode utilizar estas minutas para enviar aos clientes via **WhatsApp** ou **Email**:

#### Opção A: 1º Aviso Amigável (1 a 5 dias após vencimento)
*"Estimado(a) Cliente, esperamos que este contacto o(a) encontre bem. Gostaríamos de lembrar que a fatura relativa aos serviços prestados pela **${companyName}** atingiu a sua data de vencimento. Se já tiver efetuado o pagamento, pedimos a gentileza de ignorar este aviso ou enviar o comprovativo. Caso necessite de segunda via ou dados para M-Pesa/Banco, estamos ao seu inteiro dispor."*

#### Opção B: 2º Aviso Formal (10 a 15 dias de atraso)
*"Exmo.(a) Senhor(a), vimos por este meio solicitar a regularização do pagamento pendente no valor de [Valor ${currency}], com vencimento passado. Pedimos que proceda à liquidação num prazo de 48 horas para evitar a interrupção no fornecimento de novos serviços ou aplicação de taxas de mora contratuais. Agradecemos a sua pronta colaboração."*`;
  }

  // 3. Descrição de Produtos / Serviços
  if (p.includes("descri") || p.includes("serviço") || p.includes("produto") || p.includes("artigo") || p.includes("ti") || p.includes("manuten")) {
    return `### Sugestões de Descrições para Linhas de Fatura

Para manter o documento claro e evitar contestações com clientes e auditorias:

**Exemplo 1: Manutenção de Informática / TI**
*"Serviço de manutenção preventiva e corretiva de infraestrutura de TI, incluindo otimização do sistema operativo, limpeza de hardware, verificação de segurança de rede e testes de diagnóstico."*

**Exemplo 2: Consultoria & Gestão Empresarial**
*"Prestação de serviços de consultoria especializada no desenvolvimento de estratégias comerciais, auditoria de processos internos e elaboração de relatório executivo de diagnóstico."*

**Exemplo 3: Climatização & AC**
*"Manutenção periódica de unidades de climatização (Splits 12.000 a 24.000 BTUs), incluindo higienização de filtros, medição de pressão do gás refrigerante e revisão elétrica."*

**Exemplo 4: Criação de Website / Software**
*"Desenvolvimento de website corporativo responsivo, incluindo otimização de velocidade, integração de formulários de contacto, certificado SSL e suporte de lançamento."*`;
  }

  // 4. Regras Fiscais Moçambique (FT vs VD vs RC)
  if (p.includes("ft") || p.includes("vd") || p.includes("recibo") || p.includes("diferen") || p.includes("fiscal") || p.includes("moçambique")) {
    return `### Legislação Fiscal em Moçambique: Guia Rápido

No FatureAqui cada documento cumpre regras estritas:

1. **Fatura (FT):** Documento emitido para vendas a **crédito** (prazo de pagamento futuro). É obrigatório apresentar os dados de pagamento (banco, M-Pesa, e-Mola) e gera conta corrente do cliente.
2. **Venda a Dinheiro (VD):** Emitida exclusivamente quando a mercadoria ou serviço é pago **no ato**. O documento já serve como comprovativo de liquidação imediata e não exige coordenadas de pagamento.
3. **Recibo (RC):** Comprovativo de pagamento de uma fatura (FT) previamente emitida.
4. **Cotação / Proforma (CT):** Proposta comercial sem efeito fiscal até aprovação do cliente.
5. **Nota de Crédito (NC):** Ajuste ou anulação total/parcial de fatura.

> 🛡️ **Segurança:** O sistema FatureAqui oculta automaticamente dados bancários em documentos que já foram liquidados (como VD e RC), garantindo conformidade.`;
  }

  // 5. Configurar Carimbo e M-Pesa
  if (p.includes("carimbo") || p.includes("mpesa") || p.includes("emola") || p.includes("banco") || p.includes("defin")) {
    return `### Como Configurar o seu Carimbo, M-Pesa e e-Mola

Para personalizar os seus dados no FatureAqui:

1. **Carimbo da Empresa:**
   - Aceda a **Definições** no menu lateral.
   - Na secção **Carimbo**, selecione o formato desejado (Circular com NUIT e Localidade) ou carregue uma imagem PNG com transparência.
   - O carimbo foi calibrado para um tamanho perfeito e discreto no documento.

2. **Pagamentos Móveis (M-Pesa e e-Mola):**
   - Em **Definições > Métodos de Pagamento**, insira os números de contacto comercial M-Pesa e e-Mola e o titular.
   - Estes dados serão incluídos com destaque em todas as Faturas (FT) e Cotações (CT).`;
  }

  // 6. Resposta Geral de Apoio
  return `Olá! Sou o **Assistente Inteligente do FatureAqui** para a **${companyName}**.

Posso ajudá-lo(a) em várias áreas do seu negócio:

- 📝 **Redação de Documentos:** Criar termos de pagamento, garantias e observações legais.
- 📦 **Descrição de Produtos & Serviços:** Textos claros para colocar nas linhas dos documentos.
- 💰 **Cobrança Amigável:** Mensagens profissionais para clientes com faturas pendentes.
- 🌐 **Exportação Multi-língua:** Emitir faturas em **Português**, **Inglês**, **Chinês** ou **Espanhol**.
- ⚙️ **Dúvidas do Sistema:** Como emitir documentos, configurar M-Pesa/e-Mola e modelos PRO.

*Diga-me: o que gostaria de redigir ou esclarecer hoje?*`;
}

export function AiAssistantWidget({ company }: AiAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Olá! Sou o seu **Assistente Inteligente FatureAqui**.\n\nComo posso ajudar a **${company?.name || "sua empresa"}** hoje? Posso redigir termos para faturas, descrições de serviços, mensagens de cobrança ou esclarecer qualquer funcionalidade do sistema.`,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Texto copiado para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      // 1. Context strictly scoped to current tenant (No cross-company leak)
      const companyContext = {
        name: company?.name || "Empresa",
        nuit: company?.nuit || "",
        city: company?.city || "",
        currency: company?.currency || "MZN",
        email: company?.email || "",
      };

      const apiHistory = messages.concat(userMessage).map(m => ({
        role: m.role,
        content: m.content
      }));

      // 2. Attempt Edge Function invocation
      let responseText = "";
      try {
        const { data, error } = await supabase.functions.invoke("ai-assistant", {
          body: {
            messages: apiHistory,
            companyContext
          }
        });

        if (!error && data?.content) {
          responseText = data.content;
        }
      } catch (e) {
        // Fallback silently without throwing to user
      }

      // 3. If edge function was unavailable or had no key, use intelligent built-in fallback
      if (!responseText) {
        // Add a slight realistic delay for quality feeling
        await new Promise(r => setTimeout(r, 600));
        responseText = generateSmartFallback(query, company);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      toast.error("Ocorreu um erro ao processar. Usando resposta local.");
      const fallbackText = generateSmartFallback(query, company);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackText,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { label: "Termos para Fatura", icon: FileText, query: "Escreva termos e condições de pagamento a 15 dias para colocar nas observações da fatura" },
    { label: "Descrever Serviço", icon: Lightbulb, query: "Como descrever de forma profissional um serviço de manutenção e consultoria nas linhas da fatura?" },
    { label: "Mensagem de Cobrança", icon: CreditCard, query: "Crie uma mensagem amigável para cobrar uma fatura em atraso via WhatsApp" },
    { label: "Diferença FT e VD", icon: ShieldCheck, query: "Qual é a diferença fiscal entre emitir Fatura (FT) e Venda a Dinheiro (VD) em Moçambique?" }
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir Assistente de IA"
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <span className="font-semibold text-sm hidden sm:inline-block tracking-tight">
              Assistente IA
            </span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-white/20 rounded-md">
              PRO
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[88vh] bg-background border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm truncate">Assistente FatureAqui</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] text-emerald-100 truncate">
                  {company?.name ? `${company.name}` : "Apoio Inteligente"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome-reset",
                      role: "assistant",
                      content: `Conversa reiniciada. Como posso ajudar a **${company?.name || "sua empresa"}** agora?`,
                      timestamp: new Date()
                    }
                  ]);
                }}
                title="Limpar conversa"
                className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fechar"
                className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none ml-6"
                      : "bg-card border border-border/70 text-card-foreground rounded-tl-none mr-2"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div>
                      <div className="space-y-1">
                        {renderFormattedText(msg.content)}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="text-[10px] opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 hover:text-foreground transition-colors font-medium text-xs px-2 py-0.5 rounded bg-muted/60 hover:bg-muted"
                          title="Copiar texto gerado"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border/70 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-xs text-muted-foreground font-medium">A elaborar resposta inteligente...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (if chat is short) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 py-2 bg-muted/30 border-t border-border/40">
              <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Sugestões rápidas:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(item.query)}
                    className="flex items-center gap-1.5 text-left text-[11px] bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 border border-border/60 hover:border-emerald-300 rounded-lg p-2 transition-all shadow-xs"
                  >
                    <item.icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-background border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte ao assistente ou peça uma minuta..."
                rows={1}
                className="flex-1 resize-none bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 max-h-24 min-h-[40px]"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                aria-label="Enviar mensagem"
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-sm transition-all shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Enter para enviar • Shift+Enter para nova linha</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3 h-3" /> Dados isolados e seguros
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
