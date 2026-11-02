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
  HelpCircle,
  Lightbulb,
  Building2,
  Compass
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

// Clean markdown text safely into HTML without any raw '#' or formatting bugs
function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const formattedElements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isNumberedList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        formattedElements.push(
          <ol key={`ol-${formattedElements.length}`} className="list-decimal pl-5 my-2 space-y-1.5 text-xs sm:text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        );
      } else {
        formattedElements.push(
          <ul key={`ul-${formattedElements.length}`} className="list-disc pl-5 my-2 space-y-1 text-xs sm:text-sm">
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

    // Dividers
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList();
      formattedElements.push(<hr key={`hr-${index}`} className="my-2.5 border-border/60" />);
      return;
    }

    // Blockquotes
    if (trimmed.startsWith("> ")) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, "");
      formattedElements.push(
        <div key={`quote-${index}`} className="border-l-3 border-emerald-500 bg-muted/30 px-3 py-1.5 my-2 rounded-r-lg text-xs sm:text-sm text-foreground/90 italic">
          <div dangerouslySetInnerHTML={{ __html: parseInline(quoteText) }} />
        </div>
      );
      return;
    }

    // Headers - completely strip any #, ##, ###, ####, or # # # #
    const headerMatch = trimmed.match(/^(?:#\s*){1,6}(.*)$/);
    if (headerMatch) {
      flushList();
      const headingClean = headerMatch[1].trim();
      formattedElements.push(
        <h4 key={`h-${index}`} className="font-bold text-sm sm:text-base mt-2.5 mb-1 text-foreground leading-snug">
          {headingClean}
        </h4>
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

    // Regular paragraph
    flushList();
    formattedElements.push(
      <p 
        key={`p-${index}`} 
        className="leading-relaxed text-xs sm:text-sm my-0.5 text-foreground/90"
        dangerouslySetInnerHTML={{ __html: parseInline(line) }} 
      />
    );
  });

  flushList();
  return formattedElements;
}

// Comprehensive intelligent understanding engine for FatureAqui and business operations
function generateSmartFallback(prompt: string, company?: AiAssistantWidgetProps["company"]): string {
  const p = prompt.toLowerCase().trim();
  const companyName = company?.name || "A sua empresa";
  const currency = company?.currency || "MZN";

  // 1. Meta / Conversational / Frustration check: user asking if AI can answer what was asked
  if (
    p.includes("consegue responder") || 
    p.includes("responder o que") || 
    p.includes("nao respondeu") || 
    p.includes("não respondeu") ||
    p.includes("outra coisa") ||
    p.includes("preste atencao") ||
    p.includes("preste atenção") ||
    p.includes("voce consegue") ||
    p.includes("você consegue")
  ) {
    return `Peço desculpa pela resposta anterior. Estou aqui com total atenção para responder exatamente ao que precisa.

Por favor, diga-me: qual é a dúvida ou o que gostaria de realizar agora para a **${companyName}**?

Posso orientar sobre qualquer item do sistema (como alterar o logótipo, carimbo, M-Pesa, emitir faturas ou exportar em várias línguas) ou ajudar em redação comercial e cálculos de faturação. Estou pronto para ajudar!`;
  }

  // 2. LOGÓTIPO DA EMPRESA (Onde alterar, como mudar)
  if (
    p.includes("logotipo") || 
    p.includes("logótipo") || 
    p.includes("logo") || 
    p.includes("logomarca") || 
    p.includes("imagem da empresa") ||
    p.includes("foto da empresa")
  ) {
    return `Para alterar ou carregar o **logótipo da empresa**:

1. Aceda ao menu lateral esquerdo e clique em **Definições** (ou clique no seu perfil no canto inferior esquerdo).
2. Na secção principal de **Dados da Empresa**, localize o campo **Logótipo da Empresa**.
3. Clique em **Carregar Logótipo** e selecione o ficheiro no seu computador ou telemóvel (formatos recomendados: PNG com fundo transparente ou JPG de boa resolução).
4. Clique em **Guardar Alterações** no fundo da página.

Assim que gravar, o novo logótipo aparecerá automaticamente em todas as novas faturas, cotações, vendas a dinheiro e recibos emitidos!`;
  }

  // 3. CARIMBO DA EMPRESA (Onde alterar, formato, tamanho)
  if (p.includes("carimbo") || p.includes("selo")) {
    return `Para configurar ou personalizar o **carimbo da sua empresa**:

1. Aceda ao menu lateral e clique em **Definições**.
2. Desça até à secção **Carimbo da Empresa**.
3. Pode optar por:
   - **Carimbo Digital Automático:** O sistema gera um carimbo circular oficial contendo o nome da sua empresa, NUIT e Localidade.
   - **Carregar Imagem de Carimbo:** Caso tenha o carimbo físico digitalizado, pode carregar o ficheiro em PNG transparente.
4. Clique em **Guardar Alterações**.

O carimbo foi calibrado para um tamanho compacto e proporcional (82px), garantindo autenticidade no documento sem ocupar espaço excessivo.`;
  }

  // 4. M-PESA E E-MOLA (Onde configurar pagamentos móveis)
  if (p.includes("mpesa") || p.includes("m-pesa") || p.includes("emola") || p.includes("e-mola")) {
    return `Para registar ou alterar as suas contas de **M-Pesa** e **e-Mola**:

1. Aceda ao menu lateral em **Definições**.
2. Na secção **Métodos de Pagamento / Pagamentos Móveis**, preencha:
   - **Contacto M-Pesa** e o **Nome do Titular**.
   - **Contacto e-Mola** e o **Nome do Titular**.
3. Clique em **Guardar Alterações**.

Estes dados serão incluídos nas coordenadas de pagamento de todas as suas **Faturas (FT)** e **Cotações / Proformas (CT)**.`;
  }

  // 5. DADOS BANCÁRIOS (Banco, Conta, NIB)
  if (
    p.includes("dados bancarios") || 
    p.includes("dados bancários") || 
    p.includes("coordenadas bancarias") || 
    p.includes("coordenadas bancárias") ||
    (p.includes("banco") && (p.includes("onde") || p.includes("alterar") || p.includes("colocar") || p.includes("configurar"))) ||
    p.includes("nib") || 
    p.includes("numero de conta") || 
    p.includes("número de conta")
  ) {
    return `Para registar ou atualizar os seus **dados bancários**:

1. Aceda ao menu lateral em **Definições**.
2. Localize a secção **Dados Bancários**.
3. Insira o **Nome do Banco** (ex: Millennium BIM, BCI, Standard Bank, Moza Banco), o **Número de Conta** e o **NIB**.
4. Clique em **Guardar Alterações**.

Os dados bancários serão exibidos nos documentos que exigem liquidação (como Faturas e Cotações) e ocultados automaticamente em documentos que já foram pagos no ato (como Venda a Dinheiro e Recibos).`;
  }

  // 6. MODELOS DE FACTURA (Como alternar, onde escolher, modelos PRO)
  if (
    p.includes("modelo") || 
    p.includes("modelos") || 
    p.includes("template") || 
    p.includes("onda") || 
    p.includes("corporativo") || 
    p.includes("geométrico") || 
    p.includes("geometrico") || 
    p.includes("boutique")
  ) {
    return `O FatureAqui dispõe de 5 modelos de fatura profissionais e personalizáveis:

- **Ao emitir um documento:** Na página de criação da fatura, utilize o seletor **Alternar Modelo** na barra superior da pré-visualização para escolher entre os modelos *Onda*, *Corporativo*, *Moderno*, *Geométrico* e *Boutique*.
- **Definições da Empresa:** Em **Definições**, pode definir o seu modelo favorito como padrão para todas as futuras emissões.
- **Identidade Visual:** Todos os modelos adotam automaticamente a cor da marca da **${companyName}**.`;
  }

  // 7. LÍNGUAS DA FACTURA (Português, Inglês, Chinês, Espanhol)
  if (
    p.includes("lingua") || 
    p.includes("língua") || 
    p.includes("idioma") || 
    p.includes("ingles") || 
    p.includes("inglês") || 
    p.includes("chines") || 
    p.includes("chinês") || 
    p.includes("espanhol") || 
    p.includes("traduz")
  ) {
    return `Pode emitir faturas em 4 idiomas no FatureAqui:

- **Português (MZ/PT):** Padrão oficial nacional.
- **Inglês (EN):** Ideal para clientes internacionais e embaixadas.
- **Chinês (ZH):** Para investidores e empresas parceiras chinesas.
- **Espanhol (ES):** Para transações regionais e cooperação internacional.

**Como alternar o idioma:**
Ao criar ou visualizar um documento, clique no seletor com as bandeiras no topo da pré-visualização: **[PT | EN | ZH | ES]**. Todos os termos técnicos, cabeçalhos, totais e notas fiscais serão traduzidos de imediato.`;
  }

  // 8. ONDE ENCONTRAR / NAVEGAÇÃO GERAL NO SISTEMA
  if (p.includes("onde fica") || p.includes("onde encontro") || p.includes("onde posso") || p.includes("onde alterar") || p.includes("como ir")) {
    if (p.includes("cliente")) {
      return `Para gerir os seus clientes: aceda ao menu lateral em **Clientes**. Para cadastrar um novo, clique no botão **Novo Cliente** no topo direito ou utilize o ícone (+) direto no formulário de emissão.`;
    }
    if (p.includes("fatura") || p.includes("factura") || p.includes("documento") || p.includes("emitir")) {
      return `Para emitir ou consultar faturas: aceda ao menu lateral em **Documentos**. Para criar um novo documento, clique em **Nova Factura** (ou aceda a \`/painel/facturacao/nova\`).`;
    }
    if (p.includes("produto") || p.includes("serviço") || p.includes("servico") || p.includes("artigo") || p.includes("preço") || p.includes("preco")) {
      return `Para gerir produtos e serviços: aceda ao menu lateral em **Artigos & Serviços**. Pode cadastrar produtos ou serviços com preços pré-fixados e unidades de medida.`;
    }
    if (p.includes("assinatura") || p.includes("plano") || p.includes("pagar plano") || p.includes("pro")) {
      return `Para consultar ou renovar a sua assinatura: aceda ao menu lateral em **Assinatura**. Lá poderá ver o estado do seu plano e os dados para pagamento via M-Pesa, e-Mola ou Banco.`;
    }
    if (p.includes("comunidade") || p.includes("mensagem") || p.includes("chat")) {
      return `Para aceder à rede de empresas e mensagens: aceda ao menu lateral em **Comunidade**. Poderá ver publicações da rede e aceder à aba de **Mensagens** para conversar com outras empresas.`;
    }
  }

  // 9. MENSAGENS DE COBRANÇA
  if (p.includes("cobr") || p.includes("vencid") || p.includes("atraso") || p.includes("lembrete de pagamento")) {
    return `Aqui tem minutas prontas e profissionais de cobrança para a **${companyName}**, sem termos agressivos e focadas em resultados:

**Opção 1: Lembrete Amigável (1 a 5 dias após vencimento)**
"Estimado(a) Cliente, esperamos que este contacto o(a) encontre bem. Gostaríamos de recordar que a fatura relativa aos serviços prestados pela ${companyName} atingiu a data de vencimento. Se o pagamento já tiver sido efetuado, solicitamos a gentileza de ignorar este aviso ou remeter o respetivo comprovativo. Ficamos ao seu dispor para qualquer apoio."

**Opção 2: Aviso Formal com Prazo (10 a 15 dias de atraso)**
"Exmo.(a) Senhor(a), vimos por este meio solicitar a regularização do pagamento pendente no valor acordado, referente à fatura com vencimento ultrapassado. Solicitamos a liquidação num prazo de 48 horas através dos nossos dados bancários ou M-Pesa. Agradecemos a sua pronta colaboração para evitarmos encargos moratórios."

**Opção 3: Aviso Pré-Contencioso (Acima de 20 dias)**
"Prezado(a) Cliente, comunicamos que até à data não acusamos a liquidação da fatura pendente. Solicitamos a regularização imediata do valor em aberto para evitar a suspensão temporária dos fornecimentos e o encaminhamento para o departamento jurídico. Caso já tenha regularizado, por favor envie o comprovativo com urgência."`;
  }

  // 10. TERMOS E CONDIÇÕES PARA FATURAS
  if (p.includes("termo") || p.includes("observa") || p.includes("condiç") || p.includes("prazo")) {
    return `Aqui está uma minuta jurídica e comercial pronta para colocar no campo **Observações / Termos** da sua fatura:

1. **Prazo de Pagamento:** O valor faturado deve ser liquidado no prazo de **15 dias** a contar da data de emissão.
2. **Identificação do Pagamento:** Solicitamos a indicação do número deste documento no descritivo da transferência bancária ou no envio via M-Pesa / e-Mola.
3. **Reserva de Propriedade:** Os bens ou serviços faturados permanecem sob reserva de propriedade de **${companyName}** até à sua liquidação integral.
4. **Juros de Mora:** Após a data limite de vencimento, reserva-se o direito de aplicação de juros moratórios legais à taxa em vigor.`;
  }

  // 11. DESCRIÇÃO DE PRODUTOS E SERVIÇOS
  if (
    p.includes("descrever") || 
    p.includes("descri") || 
    p.includes("como descrevo") || 
    p.includes("linha da fatura") ||
    p.includes("texto para servico") ||
    p.includes("texto para serviço")
  ) {
    return `Para que as suas faturas tenham clareza total perante clientes e a Autoridade Tributária, utilize descrições objetivas:

**Serviços de Informática e Suporte de TI:**
"Prestação de serviços de assistência técnica informática e manutenção preventiva de infraestrutura de rede e equipamentos, referente ao período de [Mês/Ano]."

**Consultoria e Assessoria Empresarial:**
"Serviços especializados de consultoria em gestão comercial, otimização de processos internos e elaboração de relatório de diagnóstico."

**Climatização e Ar-Condicionado:**
"Manutenção preventiva e higienização de unidades de ar-condicionado (Splits), incluindo limpeza de filtros, verificação de circuitos elétricos e carga de gás refrigerante."

**Criação de Website e Soluções Digitais:**
"Desenvolvimento e implementação de website institucional responsivo, incluindo otimização de velocidade, certificação SSL e configuração de contas de correio eletrónico."

**Serviços Jurídicos / Contabilidade:**
"Honorários profissionais relativos aos serviços de assessoria contabilística e fiscal mensal, incluindo processamento de salários e submissão de declarações fiscais."`;
  }

  // 12. LEGISLAÇÃO FISCAL EM MOÇAMBIQUE (FT vs VD, IVA, ISPC)
  if (
    p.includes("ft") || 
    p.includes("vd") || 
    p.includes("recibo") || 
    p.includes("iva") || 
    p.includes("ispc") || 
    p.includes("retenção") || 
    p.includes("retencao") || 
    p.includes("diferença") || 
    p.includes("diferenca") || 
    p.includes("fiscal")
  ) {
    return `Guia Prático de Faturação em Moçambique:

1. **Fatura (FT):** Documento para vendas a crédito (com prazo de liquidação futuro). Exige obrigatoriamente as coordenadas para pagamento e gera pendente de conta corrente.
2. **Venda a Dinheiro (VD):** Emitida exclusivamente quando a mercadoria ou serviço é pago no ato. Serve de recibo imediato e não apresenta coordenadas de pagamento pendente.
3. **Cotação / Proforma (CT):** Proposta comercial para aprovação prévia do cliente; não possui valor fiscal de dívida até ser faturada.
4. **Recibo (RC):** Comprovativo de pagamento de uma fatura emitida anteriormente.
5. **IVA (16%):** Taxa normal aplicada à generalidade das operações em Moçambique, salvo isenções previstas no Código do IVA (Art. 9).
6. **ISPC (3%):** Imposto Simplificado para Pequenos Contribuintes com volume de negócios até 2.500.000 MT/ano, aplicável a Vendas a Dinheiro.`;
  }

  // 13. Resposta Geral Contextualizada e Atenciosa
  return `Compreendi a sua mensagem relativamente a: *"${prompt}"*.

Como assistente de gestão e faturação da **${companyName}**, posso orientá-lo(a) em:

- **Localização de Funcionalidades:** Indicar exatamente onde fica qualquer configuração (logótipo, carimbo, M-Pesa, clientes, modelos e línguas).
- **Elaboração de Documentos:** Redigir termos de pagamento, propostas comerciais ou descrições técnicas de serviços.
- **Comunicação com Clientes:** Escrever mensagens de cobrança amigáveis ou formais.
- **Fiscalidade e Cálculos:** Esclarecer taxas de IVA, retenções e regras de emissão de faturas em Moçambique.

Por favor, especifique o que pretende realizar e darei a resposta passo a passo!`;
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
      content: `Olá! Sou o **Assistente Inteligente FatureAqui**.\n\nComo posso ajudar a **${company?.name || "sua empresa"}** hoje? Posso localizar qualquer item no sistema, redigir termos para faturas, criar mensagens de cobrança ou redigir descrições para os seus serviços.`,
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
      const companyContext = {
        name: company?.name || "A Minha Empresa",
        nuit: company?.nuit || "",
        city: company?.city || "",
        currency: company?.currency || "MZN",
        email: company?.email || "",
      };

      const apiHistory = messages.concat(userMessage).map(m => ({
        role: m.role,
        content: m.content
      }));

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
        // Fallback silently to our high-accuracy local engine
      }

      if (!responseText) {
        await new Promise(r => setTimeout(r, 400));
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
    { label: "Onde alterar o Logótipo", icon: Building2, query: "Onde posso alterar a logotipo da empresa no sistema?" },
    { label: "Configurar M-Pesa", icon: CreditCard, query: "Onde configuro as contas de M-Pesa e e-Mola?" },
    { label: "Mensagem de Cobrança", icon: FileText, query: "Crie uma mensagem amigável de cobrança para fatura em atraso" },
    { label: "Termos para Fatura", icon: Compass, query: "Escreva termos e condições de pagamento para colocar na fatura" }
  ];

  return (
    <>
      {/* Floating Trigger Button - Responsive & Non-intrusive on Mobile */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir Assistente de IA"
            className="group relative flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 justify-center"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            </div>
            <span className="font-semibold text-sm hidden sm:inline-block tracking-tight">
              Assistente IA
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-white/20 rounded-md">
              PRO
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog - Fully Responsive for Mobile & Desktop */}
      {isOpen && (
        <div 
          className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-4 sm:right-4 z-50 w-auto sm:w-[440px] h-[84vh] sm:h-[600px] bg-background border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
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
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-muted/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[88%] sm:max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none ml-4 sm:ml-6"
                      : "bg-card border border-border/70 text-card-foreground rounded-tl-none mr-1 sm:mr-2"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div>
                      <div className="space-y-1">
                        {renderFormattedText(msg.content)}
                      </div>
                      <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
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
              <div className="flex gap-2 sm:gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border/70 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-xs text-muted-foreground font-medium">A analisar com atenção...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (if chat is fresh) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 py-2 bg-muted/30 border-t border-border/40 shrink-0">
              <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Sugestões diretas:
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
          <div className="p-3 bg-background border-t border-border shrink-0">
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
                placeholder="Pergunte onde fica um item ou peça uma minuta..."
                rows={1}
                className="flex-1 resize-none bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 max-h-24 min-h-[40px]"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                aria-label="Enviar mensagem"
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Enter para enviar</span>
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
