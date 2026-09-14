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

    const { emails, subject, htmlContent, ctaText, ctaLink } = await req.json();

    if (!emails || emails.length === 0) {
      throw new Error("No emails provided");
    }

    const BATCH_SIZE = 100;
    const results = [];

    // Add visual identity - Modern Email Template
    const fullHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f5f7; }
    table { border-collapse: collapse; }
    p { margin: 0 0 16px 0; line-height: 1.6; color: #1e293b; }
    a { color: #02664D; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { text-align: center; padding: 32px 24px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; }
    .content { padding: 40px 32px; font-size: 16px; color: #334155; }
    .button-container { text-align: center; margin-top: 36px; margin-bottom: 16px; }
    .button { display: inline-block; background-color: #02664D; color: #ffffff !important; font-weight: bold; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px; }
    .footer { background-color: #f8fafc; padding: 32px 24px; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body style="background-color: #f4f5f7; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; text-size-adjust: 100%;">
  <table width="100%" bgcolor="#f4f5f7" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f5f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"><tr><td>
        <![endif]-->
        <table class="container" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td class="header" style="text-align: center; padding: 32px 24px; border-bottom: 1px solid #f1f5f9;">
              <img src="https://www.fatureaqui.com/logo.png" alt="FatureAqui" width="180" style="height: auto; display: inline-block; border: 0; outline: none; text-decoration: none;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content" style="padding: 40px 32px; font-size: 16px; color: #334155; line-height: 1.6;">
              ${htmlContent}
              
              ${ctaText && ctaLink ? \`
              <div class="button-container" style="text-align: center; margin-top: 36px; margin-bottom: 16px;">
                <a href="\${ctaLink}" class="button" style="display: inline-block; background-color: #02664D; color: #ffffff; font-weight: bold; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                  \${ctaText}
                </a>
              </div>
              \` : ''}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #f8fafc; padding: 32px 24px; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; color: #64748b;">FatureAqui &copy; ${new Date().getFullYear()} Todos os direitos reservados.</p>
              <p style="margin: 0; color: #64748b;">A sua plataforma de faturação inteligente.</p>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
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
