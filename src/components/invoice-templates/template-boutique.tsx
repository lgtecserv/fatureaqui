import { MT } from "@/lib/format";
import { StampGenerator } from "@/components/stamp-generator";
import { getInvoiceTranslations } from "@/lib/invoice-translations";
import type { TemplateProps } from "./types";

export function TemplateBoutique({
  language = "pt",
  company,
  client,
  documentData,
  items,
  calculations,
  hasIva = true,
  ivaRate,
  hasIspc = false,
  ispcRate = 3,
  id = "pdf-content",
}: TemplateProps) {
  const tr = getInvoiceTranslations(language);
  const primaryColor = company?.primary_color || "#1E3A8A"; // Deep Navy default
  const docTypeName = tr.documentTypes[documentData.type] || documentData.type;
  const showFinancials = documentData.type !== "GR";
  const shouldShowPaymentInfo = ["FT", "CT", "ND"].includes(documentData.type);

  const thankWord = language === "en" ? "Thank you" : language === "zh" ? "谢谢" : language === "es" ? "Gracias" : "Obrigado";

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[13px] text-gray-800 shadow-2xl border border-gray-100 flex flex-col justify-between p-12" 
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="flex-1 flex flex-col">
        {/* --- TOP HEADER --- */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 
              className="text-4xl font-black uppercase tracking-tight mb-3"
              style={{ color: primaryColor }}
            >
              {docTypeName}
            </h1>
            <div className="text-gray-700 text-xs space-y-0.5">
              {!company?.logo_url && (
                <p className="font-bold text-sm text-gray-900">{company?.name || "Empresa Lda"}</p>
              )}
              <p>{company?.address || "Endereço da Empresa"}</p>
              <p>{tr.labels.clientNuit} <strong>{company?.nuit || "000000000"}</strong> | {tr.labels.clientPhone} {company?.phone || "+258 00 000 0000"}</p>
              <p>{company?.email || "contacto@empresa.com"}</p>
            </div>
          </div>

          {/* Circular Logo Container */}
          <div>
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company?.name} 
                crossOrigin="anonymous"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 shadow-sm" 
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs uppercase tracking-widest shadow-sm">
                LOGO
              </div>
            )}
          </div>
        </div>

        {/* --- METADATA BAR (Invoice To & Dates) --- */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-4 border-b-2 border-gray-900 text-xs">
          <div>
            <span className="font-black uppercase tracking-wider text-gray-400 text-[10px] block mb-1">
              {tr.labels.invoiceTo}
            </span>
            <p className="font-bold text-sm text-gray-900">{client?.name || tr.labels.clientName}</p>
            {client?.company_name && <p className="text-gray-600 font-medium">{client.company_name}</p>}
            <p className="text-gray-500 mt-0.5">{client?.address || tr.labels.clientAddress}</p>
            <p className="text-gray-600 mt-1">
              {client?.nuit && <span><strong>{tr.labels.clientNuit}</strong> {client.nuit} </span>}
              {client?.phone && <span>| {tr.labels.clientPhone} {client.phone}</span>}
            </p>
          </div>

          <div className="text-right space-y-1">
            <p><span className="text-gray-400 font-semibold">{tr.labels.invoiceNumber}</span> <strong className="text-gray-900">{documentData.number || "0000"}</strong></p>
            <p><span className="text-gray-400 font-semibold">{tr.labels.date}</span> <strong className="text-gray-900">{documentData.date}</strong></p>
            {documentData.reference_invoice && (
              <p><span className="text-gray-400 font-semibold">{tr.labels.referenceDoc}</span> <strong className="text-gray-900">{documentData.reference_invoice}</strong></p>
            )}
          </div>
        </div>

        {/* --- MINIMALIST TABLE --- */}
        <div className="flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-[11px] uppercase font-bold text-gray-900">
                <th className="py-2.5 px-2 w-10 text-center">{tr.labels.itemNumber}</th>
                <th className="py-2.5 px-3">{tr.labels.description}</th>
                <th className="py-2.5 px-2 text-center w-16">{tr.labels.unit}</th>
                <th className="py-2.5 px-2 text-center w-16">{tr.labels.quantity}</th>
                {showFinancials && (
                  <>
                    <th className="py-2.5 px-3 text-right w-24">{tr.labels.unitPrice}</th>
                    <th className="py-2.5 px-2 text-center w-16">{tr.labels.discount}</th>
                    <th className="py-2.5 px-3 text-right w-28">{tr.labels.total}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => {
                const qty = Number(it.quantity) || 0;
                const price = Number(it.unit_price) || 0;
                const discVal = Number(it.discount_value) || 0;
                let sub = qty * price;
                if (it.discount_type === "percentagem") {
                  sub -= sub * (discVal / 100);
                } else {
                  sub -= discVal;
                }

                return (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-2 text-center text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">{it.description || "—"}</td>
                    <td className="py-3 px-2 text-center uppercase text-gray-500">{it.unit || "UN"}</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">{it.quantity}</td>
                    {showFinancials && (
                      <>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">{MT(price)}</td>
                        <td className="py-3 px-2 text-center text-gray-400">
                          {discVal > 0 ? (it.discount_type === "percentagem" ? `${discVal}%` : MT(discVal)) : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">{MT(sub)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Transport Info if GR */}
          {documentData.type === "GR" && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs grid grid-cols-2 gap-4">
              <p><strong>{tr.labels.transportOrigin}</strong> {documentData.origin || "—"}</p>
              <p><strong>{tr.labels.transportDestination}</strong> {documentData.destination || "—"}</p>
              <p><strong>{tr.labels.driver}</strong> {documentData.driver || "—"}</p>
              <p><strong>{tr.labels.vehiclePlate}</strong> {documentData.vehicle_plate || "—"}</p>
            </div>
          )}

          {/* --- FINANCIAL TOTALS --- */}
          {showFinancials && (
            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">{tr.labels.subtotal}</span>
                  <span className="font-bold text-gray-900">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span>{tr.labels.totalDiscount}</span>
                    <span>-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span className="font-medium">{tr.labels.vat} {ivaRate.toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span className="font-medium">{tr.labels.ispc} {ispcRate.toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{MT(calculations.totalIspc)}</span>
                  </div>
                )}
                <div 
                  className="flex justify-between py-2.5 border-t border-gray-900 text-base font-black"
                  style={{ color: primaryColor }}
                >
                  <span className="uppercase tracking-wider">{tr.labels.total}</span>
                  <span className="text-xl">{MT(calculations.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* --- CALLIGRAPHY + SIGNATURE + TERMS --- */}
          <div className="flex justify-between items-end mt-12 pt-6">
            {/* Left side: Script Word + Terms */}
            <div className="flex items-start gap-8">
              <div 
                className="text-4xl font-normal select-none italic"
                style={{ 
                  fontFamily: "'Brush Script MT', 'Dancing Script', 'Segoe Script', cursive",
                  color: primaryColor,
                  lineHeight: "1"
                }}
              >
                {thankWord}
              </div>

              {/* Vertical divider + Terms and Bank details (Only for FT, CT, ND) */}
              <div className="border-l-2 border-red-500 pl-4 space-y-1 text-xs">
                <span className="font-black text-[11px] uppercase tracking-wider text-red-600 block">
                  {tr.labels.termsAndConditions}
                </span>
                <p className="text-gray-600 text-[11px] max-w-xs leading-relaxed">
                  {documentData.observations || tr.labels.defaultTerms}
                </p>
                {shouldShowPaymentInfo && (company?.bank_name || company?.bank_account || company?.bank_iban || company?.mpesa_number || company?.emola_number) && (
                  <div className="text-[10px] text-gray-700 pt-1 font-medium space-y-0.5">
                    {company.bank_name && <p>{tr.labels.bank} <strong>{company.bank_name}</strong></p>}
                    {company.bank_account && <p>{tr.labels.accountNumber} <strong>{company.bank_account}</strong></p>}
                    {company.bank_iban && <p>{tr.labels.nibIban} <strong>{company.bank_iban}</strong></p>}
                    {company.mpesa_number && <p><span className="text-red-600 font-bold">{tr.labels.mpesa}</span> <strong>{company.mpesa_number}</strong></p>}
                    {company.emola_number && <p><span className="text-orange-600 font-bold">{tr.labels.emola}</span> <strong>{company.emola_number}</strong></p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Stamp & Signature */}
            <div className="flex items-end gap-6">
              <StampGenerator company={company} className="w-20 h-20" />
              <div className="text-center w-40">
                <div className="min-h-[45px] flex items-end justify-center pb-1">
                  {company?.signature_url ? (
                    <img src={company.signature_url} alt="Assinatura" className="h-12 object-contain" />
                  ) : (
                    <span 
                      className="text-2xl text-gray-800 italic" 
                      style={{ fontFamily: "'Brush Script MT', cursive" }}
                    >
                      {company?.name?.split(' ')[0] || "Empresa"}
                    </span>
                  )}
                </div>
                <div className="w-full h-0.5 bg-gray-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mt-1 block">
                  {tr.labels.authorisedSignature}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
