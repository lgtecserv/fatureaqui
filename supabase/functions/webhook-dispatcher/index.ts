import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import { createHmac } from "node:crypto";

serve(async (req) => {
  try {
    // Apenas aceita POST (acionado pelo Trigger da BD via pg_net)
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const payload = await req.json();
    const { action, table, company_id, record } = payload;

    const internalSecret = req.headers.get('X-Internal-Secret');
    const expectedSecret = Deno.env.get('WEBHOOK_INTERNAL_SECRET');

    if (!internalSecret || !expectedSecret || internalSecret !== expectedSecret) {
      console.error("Tentativa de acesso não autorizada ao dispatcher de webhooks");
      return new Response(JSON.stringify({ error: 'Unauthorized access' }), { status: 403 });
    }

    if (!company_id) {
      return new Response(JSON.stringify({ error: 'company_id missing' }), { status: 400 });
    }

    // Inicializar Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mapear ação da tabela para o nome do evento
    let eventType = '';
    if (table === 'documents') {
      eventType = 'fatura.atualizada'; // Podemos refinar isto depois
      // Se for um novo documento recém-criado, talvez 'fatura.criada'
      if (action === 'INSERT') eventType = 'fatura.criada';
    } else if (table === 'clients') {
      if (action === 'INSERT') eventType = 'cliente.criado';
      else eventType = 'cliente.atualizado';
    }

    if (!eventType) {
      return new Response(JSON.stringify({ error: 'Event not mapped' }), { status: 400 });
    }

    // Buscar Webhooks ativos para esta company e este evento
    const { data: webhooks, error: webhooksError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('company_id', company_id)
      .eq('is_active', true);

    if (webhooksError) throw webhooksError;

    if (!webhooks || webhooks.length === 0) {
      return new Response(JSON.stringify({ message: 'No active webhooks for this company' }), { status: 200 });
    }

    // Filtrar webhooks que subscrevem a este evento (ou se tiverem evento '*')
    const targetWebhooks = webhooks.filter(wh => 
      wh.events.includes(eventType) || wh.events.includes('*')
    );

    if (targetWebhooks.length === 0) {
      return new Response(JSON.stringify({ message: 'No webhooks subscribed to this event' }), { status: 200 });
    }

    const webhookPayload = {
      event: eventType,
      created_at: new Date().toISOString(),
      data: record
    };

    const payloadString = JSON.stringify(webhookPayload);

    // Disparar para todos os URLs em paralelo
    const promises = targetWebhooks.map(async (webhook) => {
      try {
        // Gerar assinatura HMAC usando o secret do webhook
        const signature = createHmac('sha256', webhook.secret)
          .update(payloadString)
          .digest('hex');

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-FatureAqui-Signature': signature,
            'X-FatureAqui-Event': eventType
          },
          body: payloadString,
          // Um timeout curto para não bloquear muito a Edge Function
          signal: AbortSignal.timeout(5000) 
        });

        return { url: webhook.url, status: response.status, success: response.ok };
      } catch (err) {
        return { url: webhook.url, error: err.message, success: false };
      }
    });

    const results = await Promise.all(promises);

    return new Response(JSON.stringify({ message: 'Webhooks dispatched', results }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook dispatcher error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
