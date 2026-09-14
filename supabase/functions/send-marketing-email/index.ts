import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Initialize Resend API endpoint
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const { emails, subject, htmlContent } = await req.json();

    if (!emails || emails.length === 0) {
      throw new Error("No emails provided");
    }

    const BATCH_SIZE = 100;
    const results = [];

    // Add visual identity
    const fullHtml = `
      <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-6 bg-gray-50 text-gray-800">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fatureaqui.com/logo.png" alt="FatureAqui" style="height: 40px;" />
        </div>
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          ${htmlContent}
        </div>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
          <p>FatureAqui &copy; ${new Date().getFullYear()}</p>
          <p>Para deixar de receber estes emails, aceda às definições da sua conta.</p>
        </div>
      </div>
    `;

    // Resend Batch API endpoint limit is 100 emails per batch request
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify(batch.map((email: string) => ({
          from: 'FatureAqui <suporte@fatureaqui.com>',
          reply_to: 'contato@lgtecserv.com',
          to: [email],
          subject: subject,
          html: fullHtml
        })))
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend API error:", errorText);
        throw new Error(`Resend error: ${res.statusText}`);
      }
      
      const data = await res.json();
      results.push(data);
    }

    return new Response(
      JSON.stringify({ success: true, message: `Emails sent to ${emails.length} recipients`, data: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
