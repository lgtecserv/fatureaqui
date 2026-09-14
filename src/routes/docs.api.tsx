import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Code, Key, Terminal, Shield, CheckCircle2, Copy, Webhook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/docs/api")({
  component: ApiDocsPage,
  head: () => ({
    meta: [
      { title: "Documentação da API | FatureAqui" },
      { name: "description", content: "Integre a sua loja online, ERP ou sistema POS ao FatureAqui através da nossa API REST." },
    ],
  }),
});

function CodeBlock({ code, language }: { code: string, language: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  return (
    <div className="relative group rounded-xl bg-slate-900 border border-slate-800 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copiar</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ApiDocsPage() {
  const [activeTabClientes, setActiveTabClientes] = useState<"curl" | "js" | "php">("curl");
  const [activeTabFaturas, setActiveTabFaturas] = useState<"curl" | "js" | "php">("curl");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 border-b border-border/40 bg-background">
        <Link to="/">
          <img src="/logo.png" alt="FatureAqui" className="h-16 sm:h-[72px] object-contain" />
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground hidden sm:block">
            Voltar ao Site
          </Link>
          <Link
            to="/painel"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition-opacity"
          >
            Obter Chave API <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-slate-900 text-white pt-20 pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-6">
              <Code className="h-4 w-4" />
              Documentação para Programadores
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              FatureAqui API <span className="text-indigo-400">REST</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Ligue a sua loja online, aplicação mobile, sistema de faturação externo ou POS diretamente à sua conta FatureAqui de forma rápida, segura e automatizada.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row gap-12 relative -mt-8">
          
          {/* Sidebar / Quick Links */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm sticky top-6">
              <h4 className="font-bold text-slate-900 mb-4">Navegação</h4>
              <nav className="flex flex-col space-y-3 text-sm">
                <a href="#autenticacao" className="text-slate-600 hover:text-primary font-medium">1. Autenticação</a>
                <li><a href="#clientes" className="text-slate-600 hover:text-primary transition-colors">Criar Cliente</a></li>
                <li><a href="#faturas" className="text-slate-600 hover:text-primary transition-colors">Criar Fatura</a></li>
                <li><a href="#webhooks" className="text-slate-600 hover:text-primary transition-colors">Webhooks (Eventos)</a></li>
                <li><a href="#erros" className="text-slate-600 hover:text-primary transition-colors">Tratamento de Erros</a></li>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-16">
            
            {/* Introdução e Base URL */}
            <section className="bg-white rounded-3xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Base URL</h2>
              <p className="text-slate-600 mb-6">Todos os pedidos devem ser feitos para o endpoint principal do projeto alojado na Supabase.</p>
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-800 break-all">
                https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/
              </div>
            </section>

            {/* Autenticação */}
            <section id="autenticacao" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-xl"><Shield className="h-6 w-6" /></div>
                <h2 className="text-3xl font-bold text-slate-900">Autenticação</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>A API do FatureAqui utiliza <strong>Bearer Tokens</strong> para autenticar pedidos. Apenas contas com plano <strong>Pro</strong> podem gerar chaves de API.</p>
                <ol className="list-decimal list-inside space-y-2 mt-4 mb-6">
                  <li>Vá ao seu <Link to="/painel/api" className="text-primary hover:underline font-semibold">Painel &gt; API e Integrações</Link>.</li>
                  <li>Clique em <strong>"Gerar Chave"</strong> e copie a chave fornecida (Ex: <code>fat_live_...</code>).</li>
                  <li>Envie essa chave no cabeçalho (Header) de todos os pedidos HTTP.</li>
                </ol>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-800 mb-6">
                  Authorization: Bearer fat_live_SUA_CHAVE_SECRETA_AQUI
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start gap-3">
                  <Key className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm">As chaves <code>fat_live_</code> dão acesso direto à sua conta e criam documentos válidos. Nunca exponha esta chave no código frontend (lado do cliente). Faça os pedidos sempre a partir do seu servidor (backend).</p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Criar Cliente */}
            <section id="clientes" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Terminal className="h-6 w-6" /></div>
                <h2 className="text-3xl font-bold text-slate-900">Criar Cliente</h2>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded text-sm tracking-wide">POST</span>
                <code className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded">/api-customers</code>
              </div>
              
              <p className="text-slate-600 mb-8">Cria um novo cliente na sua conta FatureAqui. É recomendável criar o cliente primeiro antes de lhe emitir uma fatura.</p>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Parâmetros (Body JSON)</h3>
              <div className="overflow-x-auto mb-8 border border-border rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b">Campo</th>
                      <th className="px-4 py-3 font-semibold border-b">Tipo</th>
                      <th className="px-4 py-3 font-semibold border-b">Obrigatório</th>
                      <th className="px-4 py-3 font-semibold border-b">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-primary">name</td><td className="px-4 py-3">string</td><td className="px-4 py-3"><CheckCircle2 className="h-4 w-4 text-green-500" /></td><td className="px-4 py-3 text-slate-600">Nome completo ou designação da empresa.</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">email</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">Email do cliente para envio automático.</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">nuit</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">NUIT (Número de Identificação Tributária).</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">phone</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">Contacto telefónico.</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">address</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">Endereço completo (Ex: Av. 24 de Julho).</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">city</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">Cidade (Ex: Maputo).</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="flex border-b border-border mb-4 gap-6">
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabClientes === 'curl' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabClientes('curl')}>cURL</button>
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabClientes === 'js' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabClientes('js')}>JavaScript (Fetch)</button>
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabClientes === 'php' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabClientes('php')}>PHP</button>
              </div>

              {activeTabClientes === 'curl' && (
                <CodeBlock language="bash" code={`curl -X POST "https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-customers" \\
  -H "Authorization: Bearer fat_live_SUA_CHAVE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "nuit": "123456789",
    "city": "Maputo"
  }'`} />
              )}
              {activeTabClientes === 'js' && (
                <CodeBlock language="javascript" code={`const criarCliente = async () => {
  const resposta = await fetch('https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-customers', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer fat_live_SUA_CHAVE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "João Silva",
      email: "joao@email.com",
      nuit: "123456789"
    })
  });
  
  const json = await resposta.json();
  console.log(json);
};`} />
              )}
              {activeTabClientes === 'php' && (
                <CodeBlock language="php" code={`<?php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-customers',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode(array(
    'name' => 'João Silva',
    'nuit' => '123456789'
  )),
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer fat_live_SUA_CHAVE',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
curl_close($curl);
echo $response;
?>`} />
              )}

              <h4 className="mt-8 mb-4 font-semibold text-slate-900">Resposta de Sucesso (201 Created)</h4>
              <CodeBlock language="json" code={`{
  "success": true,
  "data": {
    "id": "e838b0fc-1234-4567-8901-abcdef123456",
    "name": "João Silva",
    "nuit": "123456789",
    "email": "joao@email.com"
  }
}`} />
            </section>

            <hr className="border-border" />

            {/* Criar Fatura */}
            <section id="faturas" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><Terminal className="h-6 w-6" /></div>
                <h2 className="text-3xl font-bold text-slate-900">Criar Fatura</h2>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded text-sm tracking-wide">POST</span>
                <code className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded">/api-invoices</code>
              </div>
              
              <p className="text-slate-600 mb-8">Gera um novo documento fiscal (Fatura ou Fatura-Recibo) atribuído a um cliente existente.</p>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Parâmetros (Body JSON)</h3>
              <div className="overflow-x-auto mb-8 border border-border rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b">Campo</th>
                      <th className="px-4 py-3 font-semibold border-b">Tipo</th>
                      <th className="px-4 py-3 font-semibold border-b">Obrigatório</th>
                      <th className="px-4 py-3 font-semibold border-b">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-primary">customer_id</td><td className="px-4 py-3">string</td><td className="px-4 py-3"><CheckCircle2 className="h-4 w-4 text-green-500" /></td><td className="px-4 py-3 text-slate-600">ID do cliente (UUID retornado ao criar).</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">type</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600"><code>Fatura</code> ou <code>Fatura-Recibo</code>. Padrão: <code>Fatura</code>.</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-slate-700">currency</td><td className="px-4 py-3">string</td><td className="px-4 py-3 text-slate-400">-</td><td className="px-4 py-3 text-slate-600">Moeda (Ex: <code>MT</code>, <code>USD</code>). Padrão: <code>MT</code>.</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-mono font-medium text-primary">items</td><td className="px-4 py-3">array</td><td className="px-4 py-3"><CheckCircle2 className="h-4 w-4 text-green-500" /></td><td className="px-4 py-3 text-slate-600">Array de objetos contendo os produtos/serviços.</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Estrutura do Array <code>items</code></h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-border mb-8 space-y-4">
                <p className="text-sm text-slate-600">Cada item no array deve conter:</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
                  <li><code>description</code> (string): Nome do produto/serviço.</li>
                  <li><code>quantity</code> (número): Quantidade (pode ser decimal).</li>
                  <li><code>unit_price</code> (número): Preço unitário antes de impostos.</li>
                  <li><code>tax_rate</code> (número, opcional): Percentagem do IVA (Ex: 16). Padrão: 0.</li>
                </ul>
              </div>

              <div className="flex border-b border-border mb-4 gap-6">
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabFaturas === 'curl' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabFaturas('curl')}>cURL</button>
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabFaturas === 'js' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabFaturas('js')}>JavaScript (Fetch)</button>
                <button className={`pb-3 font-semibold text-sm transition-colors ${activeTabFaturas === 'php' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTabFaturas('php')}>PHP</button>
              </div>

              {activeTabFaturas === 'curl' && (
                <CodeBlock language="bash" code={`curl -X POST "https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-invoices" \\
  -H "Authorization: Bearer fat_live_SUA_CHAVE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "e838b0fc-1234-4567-8901-abcdef123456",
    "type": "Fatura",
    "currency": "MT",
    "items": [
      {
        "description": "Desenvolvimento de Website",
        "quantity": 1,
        "unit_price": 50000.00,
        "tax_rate": 16
      },
      {
        "description": "Alojamento Mensal",
        "quantity": 1,
        "unit_price": 1500.00,
        "tax_rate": 16
      }
    ]
  }'`} />
              )}
              {activeTabFaturas === 'js' && (
                <CodeBlock language="javascript" code={`const criarFatura = async () => {
  const resposta = await fetch('https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-invoices', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer fat_live_SUA_CHAVE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_id: "e838b0fc-1234-4567-8901-abcdef123456",
      type: "Fatura",
      items: [
        {
          description: "Desenvolvimento de Website",
          quantity: 1,
          unit_price: 50000.00,
          tax_rate: 16
        }
      ]
    })
  });
  
  const json = await resposta.json();
  console.log(json);
};`} />
              )}
              {activeTabFaturas === 'php' && (
                <CodeBlock language="php" code={`<?php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://sesbyfhonbigmtfyavck.supabase.co/functions/v1/api-invoices',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode(array(
    'customer_id' => 'e838b0fc-1234-4567-8901-abcdef123456',
    'type' => 'Fatura',
    'items' => array(
      array(
        'description' => 'Serviços de Consultoria',
        'quantity' => 10,
        'unit_price' => 2000,
        'tax_rate' => 16
      )
    )
  )),
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer fat_live_SUA_CHAVE',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
curl_close($curl);
echo $response;
?>`} />
              )}

              <h4 className="mt-8 mb-4 font-semibold text-slate-900">Resposta de Sucesso (201 Created)</h4>
              <CodeBlock language="json" code={`{
  "success": true,
  "data": {
    "id": "f949c1ec-9876-5432-1098-fedcba654321",
    "number": "FT 2026/42",
    "type": "Fatura",
    "status": "rascunho",
    "subtotal": 51500.00,
    "total_tax": 8240.00,
    "total": 59740.00,
    "issue_date": "2026-08-25"
  }
}`} />
            </section>

            <hr className="border-border" />

            {/* Webhooks */}
            <section id="webhooks" className="scroll-mt-8 pb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-xl"><Webhook className="h-6 w-6" /></div>
                <h2 className="text-3xl font-bold text-slate-900">Webhooks (Eventos)</h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Os Webhooks permitem que a sua aplicação receba notificações em tempo real sempre que ocorre um evento na sua conta FatureAqui (por exemplo, quando uma fatura é criada ou o seu estado é alterado para Paga). 
                Isto elimina a necessidade de fazer consultas (<i>polling</i>) constantes à nossa API.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Configuração no Painel</h3>
              <p className="text-slate-600 mb-4">
                Pode registar o URL do seu servidor para receber Webhooks diretamente no seu <Link to="/painel/api" className="text-primary font-semibold hover:underline">Painel de Integrações</Link>.
                Quando criar um webhook, receberá um <strong>Secret</strong>. Esse segredo é vital para validar a autenticidade dos pedidos recebidos.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Estrutura do Payload (POST)</h3>
              <p className="text-slate-600 mb-4">Sempre que um evento ocorrer, o FatureAqui enviará um pedido HTTP POST para o seu URL com a seguinte estrutura:</p>
              <CodeBlock language="json" code={`{
  "event": "fatura.atualizada",
  "created_at": "2026-08-25T15:30:00Z",
  "data": {
    "id": "f949c1ec-9876-5432-1098-fedcba654321",
    "status": "pago",
    "type": "Fatura",
    "total": 59740.00,
    ...
  }
}`} />

              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Validação de Segurança (HMAC)</h3>
              <p className="text-slate-600 mb-4">
                Para garantir que o pedido foi enviado genuinamente pelo FatureAqui, incluímos um cabeçalho <code>X-FatureAqui-Signature</code> em cada webhook.
                Esta assinatura é um hash HMAC SHA-256 gerado usando o <i>Secret</i> do seu Webhook e o corpo do pedido (raw body).
              </p>
              
              <div className="bg-slate-50 border border-border rounded-xl p-5 mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Exemplo em PHP para validar a assinatura:</h4>
                <CodeBlock language="php" code={`<?php
// O Secret que recebeu no Painel do FatureAqui
$secret = 'whsec_seusegredo12345';

// O corpo exato do pedido (Raw Payload)
$payload = file_get_contents('php://input');

// A assinatura enviada pelo FatureAqui nos Cabeçalhos
$signatureHeader = $_SERVER['HTTP_X_FATUREAQUI_SIGNATURE'];

// Calcule a assinatura localmente
$expectedSignature = hash_hmac('sha256', $payload, $secret);

// Compare as assinaturas (usando hash_equals para evitar ataques de timing)
if (hash_equals($expectedSignature, $signatureHeader)) {
    // É autêntico! Pode processar
    $data = json_decode($payload, true);
    http_response_code(200);
    echo "Sucesso";
} else {
    // A assinatura não coincide, rejeite!
    http_response_code(401);
    echo "Assinatura inválida";
}`} />
              </div>
            </section>

            <hr className="border-border" />

            {/* Tratamento de Erros */}
            <section id="erros" className="scroll-mt-8 pb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 text-red-600 p-2 rounded-xl"><Shield className="h-6 w-6" /></div>
                <h2 className="text-3xl font-bold text-slate-900">Tratamento de Erros</h2>
              </div>
              <p className="text-slate-600 mb-6">O FatureAqui utiliza códigos HTTP convencionais para indicar o sucesso ou falha de uma requisição API.</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-border p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-green-600">201</span>
                    <span className="font-semibold text-slate-900">Created</span>
                  </div>
                  <p className="text-sm text-slate-600">O pedido foi bem sucedido e o recurso foi criado.</p>
                </div>
                
                <div className="bg-white border border-border p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-red-600">400</span>
                    <span className="font-semibold text-slate-900">Bad Request</span>
                  </div>
                  <p className="text-sm text-slate-600">Falta um parâmetro obrigatório ou há um erro de formatação (Ex: string em vez de número).</p>
                </div>
                
                <div className="bg-white border border-border p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-amber-600">401</span>
                    <span className="font-semibold text-slate-900">Unauthorized</span>
                  </div>
                  <p className="text-sm text-slate-600">Chave de API inválida, revogada ou não enviada no formato Bearer correto.</p>
                </div>
                
                <div className="bg-white border border-border p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-amber-600">405</span>
                    <span className="font-semibold text-slate-900">Method Not Allowed</span>
                  </div>
                  <p className="text-sm text-slate-600">Foi utilizado um método incorreto (Ex: GET em vez de POST).</p>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
