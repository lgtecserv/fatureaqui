import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid API key' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const apiKey = authHeader.replace('Bearer ', '')

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Hash the API key using SHA-256
    const msgUint8 = new TextEncoder().encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Validate API key
    const { data: keyData, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('company_id, is_active')
      .eq('key_hash', keyHash)
      .single()

    if (keyError || !keyData || !keyData.is_active) {
      return new Response(JSON.stringify({ 
        error: 'Invalid or inactive API key', 
        details: keyError?.message || (keyData ? 'Inactive key' : 'Key not found'),
        debug: { 
          hasServiceRole: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
          hasUrl: !!Deno.env.get('SUPABASE_URL')
        }
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const companyId = keyData.company_id

    // Update last_used_at
    await supabaseClient
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', keyHash)

    // Process the POST request
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
    }

    const body = await req.json()
    const { name, nuit, email, phone, address, city, notes } = body

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400, headers: corsHeaders })
    }

    const { data: customer, error: customerError } = await supabaseClient
      .from('clients')
      .insert({
        company_id: companyId,
        name,
        nuit: nuit || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        notes: notes || null
      })
      .select()
      .single()

    if (customerError) throw customerError

    return new Response(
      JSON.stringify({ success: true, data: customer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
