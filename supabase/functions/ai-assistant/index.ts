import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, companyContext } = await req.json();

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("Chave da API da OpenAI não está configurada no servidor Supabase.");
    }

    const companyInfoStr = companyContext
      ? `EMPRESA ACTUAL:
- Nome: ${companyContext.name || "A Minha Empresa"}
- NUIT: ${companyContext.nuit || "Não definido"}
- Cidade/Província: ${companyContext.city || "Moçambique"}
- Moeda: ${companyContext.currency || "MZN"}`
      : "Contexto da empresa atual fornecido.";

    const systemPrompt = `Você é o Assistente de Inteligência Artificial Oficial do FatureAqui (plataforma de faturação e gestão comercial em Moçambique).
Seu objetivo é ajudar empresários, gestores e profissionais a operarem com máxima eficiência.

Suas capacidades principais:
1. NAVEGAÇÃO E RECURSOS DO SISTEMA: Orientar o utilizador sobre onde encontrar opções (Facturação, Clientes, Artigos & Serviços, Modelos de Factura PRO, Personalização de Carimbo, Comunidade de Networking, Definições de Empresa e M-Pesa / e-Mola).
2. REDAÇÃO PARA DOCUMENTOS: Criar minutas profissionais de Observações e Termos para faturas (prazos, garantias, penalizações, dados de entrega).
3. DESCRIÇÃO DE PRODUTOS E SERVIÇOS: Redigir descrições técnicas, atraentes e detalhadas para colocar nas linhas dos documentos (TI, advocacia, contabilidade, ar-condicionado, obras, consultoria, etc.).
4. COBRANÇA E COMUNICAÇÃO: Redigir mensagens amigáveis e assertivas de cobrança de faturas pendentes via WhatsApp ou Email.
5. LEGISLAÇÃO FISCAL MOÇAMBICANA: Esclarecer a diferença entre Fatura (FT), Venda a Dinheiro (VD), Cotação/Proforma (CT), Recibo (RC), Nota de Crédito (NC) e IVA 16% / ISPC.

REGRAS DE SEGURANÇA E PRIVACIDADE RIGOROSAS:
- MULTI-TENANCY ISOLATION: NUNCA mencione, divulgue ou invente dados de qualquer outra empresa. Apenas conheça a empresa atual:
${companyInfoStr}

FORMATO DE RESPOSTA:
- Use sempre Markdown bem estruturado: **negrito** para dar ênfase a pontos cruciais, listas com marcadores (-) ou numeração (1., 2.) para facilidade de leitura.
- Para minutas de textos prontos a copiar, destaque-os claramente entre aspas ou bloco para o utilizador colar diretamente na fatura.
- Respostas objetivas, elegantes e em português claro.`;

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(messages) ? messages : [])
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
