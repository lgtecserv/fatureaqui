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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Hash the API key
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
      return new Response(JSON.stringify({ error: 'Invalid or inactive API key' }), { status: 401, headers: corsHeaders })
    }

    const companyId = keyData.company_id

    // Check if company has Pro plan (using simple logic, assuming subscription exists and is active)
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('status, plan_type, valid_until')
      .eq('company_id', companyId)
      .maybeSingle()

    // Depending on business rules, we could block it here if not Pro, but let's just proceed for now or strictly enforce.
    // Assuming API is allowed as long as they have an active key.

    // Process POST request
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
    }

    const body = await req.json()
    const { customer_id, type, issue_date, due_date, items, notes, currency } = body

    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields: customer_id or items array' }), { status: 400, headers: corsHeaders })
    }

    const currentYear = issue_date ? new Date(issue_date).getFullYear() : new Date().getFullYear()
    const { count } = await supabaseClient
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('type', type || 'Fatura')
      .eq('year', currentYear)

    const sequence = (count || 0) + 1
    const documentNumber = `${type === 'Fatura-Recibo' ? 'FR' : 'FT'} ${currentYear}/${sequence}`

    // Calculate totals
    let subtotal = 0
    let totalTax = 0
    const invoiceItems = items.map((item: any) => {
      const itemSubtotal = item.quantity * item.unit_price
      const itemTax = itemSubtotal * ((item.tax_rate || 0) / 100)
      subtotal += itemSubtotal
      totalTax += itemTax
      
      return {
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || 0,
        total: itemSubtotal + itemTax
      }
    })

    const total = subtotal + totalTax

    // Create Invoice
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('documents')
      .insert({
        company_id: companyId,
        customer_id,
        number: documentNumber,
        sequence,
        year: currentYear,
        type: type || 'Fatura',
        status: type === 'Fatura-Recibo' ? 'paga' : 'rascunho',
        issue_date: issue_date || new Date().toISOString().split('T')[0],
        due_date: due_date || new Date().toISOString().split('T')[0],
        subtotal,
        total_tax: totalTax,
        total,
        currency: currency || 'MT',
        notes: notes || null
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Insert Items
    const itemsToInsert = invoiceItems.map(item => ({
      ...item,
      document_id: invoice.id,
      company_id: companyId
    }))

    const { error: itemsError } = await supabaseClient
      .from('document_items')
      .insert(itemsToInsert)

    if (itemsError) throw itemsError

    return new Response(
      JSON.stringify({ success: true, data: invoice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
