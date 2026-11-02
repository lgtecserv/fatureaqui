import { MT } from "@/lib/format";
import { StampGenerator } from "@/components/stamp-generator";
import { getInvoiceTranslations } from "@/lib/invoice-translations";
import { Phone, MapPin, Mail, Globe } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateGeometric({
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
  const primaryColor = company?.primary_color || "#F59E0B"; // Yellow/amber default
  const darkNavy = "#1E2238"; // Complementary navy accent
  const docTypeName = tr.documentTypes[documentData.type] || documentData.type;
  const showFinancials = documentData.type !== "GR";
  const shouldShowPaymentInfo = ["FT", "CT", "ND"].includes(documentData.type);

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-800 shadow-2xl border border-gray-100 flex flex-col justify-between" 
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* --- TOP-RIGHT ANGULAR DIAGONAL BANNER --- */}
      <div className="absolute top-0 right-0 w-[420px] h-28 pointer-events-none z-0">
        <svg viewBox="0 0 420 120" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="50,0 420,0 420,100 20,100" fill={primaryColor} />
          <polygon points="0,0 60,0 30,100 0,100" fill={darkNavy} />
        </svg>

        {/* Contact details embedded in top-right colored banner */}
        <div className="absolute top-3 right-6 text-right text-gray-900 font-bold text-[10px] space-y-0.5">
          <p className="flex items-center justify-end gap-1.5"><MapPin className="h-3 w-3" /> {company?.address || "Endereço da Empresa"}</p>
          <p className="flex items-center justify-end gap-1.5"><Mail className="h-3 w-3" /> {company?.email || "contacto@empresa.com"}</p>
          <p className="flex items-center justify-end gap-1.5"><Phone className="h-3 w-3" /> {company?.phone || "+258 000 000 000"}</p>
          <p className="flex items-center justify-end gap-1.5"><Globe className="h-3 w-3" /> {company?.website || (tr.labels.clientNuit + " " + (company?.nuit || "000000000"))}</p>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col relative z-10">
        {/* --- LOGO & BRAND ON LEFT --- */}
        <div className="flex items-center gap-3 mb-6 mt-2 max-w-[320px]">
          {company?.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={company?.name} 
              crossOrigin="anonymous"
              className="h-16 object-contain" 
            />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center font-black text-white text-xl shadow"
                style={{ backgroundColor: darkNavy }}
              >
                {company?.name?.charAt(0) || "G"}
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-gray-900 uppercase block">{company?.name || "EMPRESA"}</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">COMÉRCIO & SERVIÇOS</span>
              </div>
            </div>
          )}
        </div>

        {/* --- INVOICE TITLE --- */}
        <div className="text-right mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">
            {docTypeName}
          </h1>
        </div>

        {/* --- TWO-COLUMN DETAILS GRID --- */}
        <div className="grid grid-cols-2 gap-10 mb-8 text-xs">
          {/* Document Details */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-2">
              {tr.labels.invoiceNumber.replace(":", "")}
            </h3>
            <div className="space-y-1.5 text-gray-700">
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.invoiceNumber} <strong className="text-gray-900">{documentData.number || "0000"}</strong>
              </p>
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.date} <strong className="text-gray-900">{documentData.date}</strong>
              </p>
              {documentData.reference_invoice && (
                <p className="border-b border-gray-200 pb-1">
                  {tr.labels.referenceDoc} <strong className="text-gray-900">{documentData.reference_invoice}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-2">
              {tr.labels.invoiceTo}
            </h3>
            <div className="space-y-1.5 text-gray-700">
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.clientName}: <strong className="text-gray-900">{client?.name || tr.labels.clientName}</strong>
              </p>
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.clientPhone} <strong className="text-gray-900">{client?.phone || "—"}</strong>
              </p>
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.clientAddress}: <span className="text-gray-600">{client?.address || "—"}</span>
              </p>
              <p className="border-b border-gray-200 pb-1">
                {tr.labels.clientNuit} <strong className="text-gray-900">{client?.nuit || "—"}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* --- TABLE (Dark Navy Header, Clean Bordered Grid) --- */}
        <div className="mb-8 flex-1">
          <table className="w-full border-collapse border border-gray-900 text-left">
            <thead>
              <tr className="bg-[#1E2238] text-white text-[11px] uppercase font-bold tracking-wider">
                <th className="border border-gray-900 py-2.5 px-3 w-12 text-center">{tr.labels.itemNumber}</th>
                <th className="border border-gray-900 py-2.5 px-3">{tr.labels.description}</th>
                <th className="border border-gray-900 py-2.5 px-3 text-center w-16">{tr.labels.unit}</th>
                <th className="border border-gray-900 py-2.5 px-3 text-center w-16">{tr.labels.quantity}</th>
                {showFinancials && (
                  <>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-24">{tr.labels.unitPrice}</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-center w-16">{tr.labels.discount}</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-28">{tr.labels.total}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
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
                  <tr key={idx} className="border-b border-gray-400">
                    <td className="border-r border-gray-400 py-2.5 px-3 text-center font-bold text-gray-700">{idx + 1}</td>
                    <td className="border-r border-gray-400 py-2.5 px-3 font-semibold text-gray-900">{it.description || "—"}</td>
                    <td className="border-r border-gray-400 py-2.5 px-3 text-center uppercase text-gray-600">{it.unit || "UN"}</td>
                    <td className="border-r border-gray-400 py-2.5 px-3 text-center font-bold text-gray-900">{it.quantity}</td>
                    {showFinancials && (
                      <>
                        <td className="border-r border-gray-400 py-2.5 px-3 text-right font-mono text-gray-700">{MT(price)}</td>
                        <td className="border-r border-gray-400 py-2.5 px-3 text-center text-gray-500">
                          {discVal > 0 ? (it.discount_type === "percentagem" ? `${discVal}%` : MT(discVal)) : "—"}
                        </td>
                        <td className="border-r border-gray-900 py-2.5 px-3 text-right font-mono font-bold text-gray-900">{MT(sub)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- LOWER SECTION: PAYMENT INFO & TOTALS --- */}
        <div className="flex justify-between items-start gap-8 mb-6">
          {/* Left: Payment Info + Notes + Stamp */}
          <div className="flex-1 space-y-3.5 max-w-sm">
            {shouldShowPaymentInfo && (company?.bank_name || company?.bank_account || company?.mpesa_number || company?.emola_number) && (
              <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs mb-1 uppercase tracking-wider">{tr.labels.paymentInfo}</h4>
                <div className="text-[11px] text-gray-700 space-y-0.5">
                  {company?.bank_account && (
                    <p>{tr.labels.accountNumber} <strong className="text-gray-900">{company.bank_account}</strong></p>
                  )}
                  {company?.name && (
                    <p>{tr.labels.accountHolder} <strong className="text-gray-900">{company.name}</strong></p>
                  )}
                  {company?.bank_name && (
                    <p>{tr.labels.bank} <span className="text-gray-900 font-medium">{company.bank_name}</span></p>
                  )}
                  {company?.mpesa_number && (
                    <p><strong className="text-red-600">{tr.labels.mpesa}</strong> {company.mpesa_number}</p>
                  )}
                  {company?.emola_number && (
                    <p><strong className="text-orange-600">{tr.labels.emola}</strong> {company.emola_number}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-0.5">{tr.labels.termsAndConditions}</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
                {documentData.observations || tr.labels.defaultTerms}
              </p>
            </div>

            <div className="pt-1">
              <StampGenerator company={company} className="w-20 h-20" />
            </div>

            <div className="pt-2">
              <p className="font-black text-xs uppercase tracking-wider text-gray-900">
                {tr.labels.thanksForBusiness}
              </p>
            </div>
          </div>

          {/* Right: Totals Box & Signature */}
          {showFinancials && (
            <div className="w-64 shrink-0 text-xs">
              <div className="border border-gray-900 divide-y divide-gray-900">
                <div className="flex justify-between py-2 px-3 bg-white font-medium">
                  <span>{tr.labels.subtotal}</span>
                  <span className="font-bold">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between py-2 px-3 bg-white text-red-600">
                    <span>{tr.labels.totalDiscount}</span>
                    <span>-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between py-2 px-3 bg-white font-medium">
                    <span>{tr.labels.vat} ({ivaRate}%)</span>
                    <span>{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between py-2 px-3 bg-white font-medium">
                    <span>{tr.labels.ispc} ({ispcRate}%)</span>
                    <span>{MT(calculations.totalIspc)}</span>
                  </div>
                )}
                {/* Total Box */}
                <div 
                  className="flex justify-between py-2.5 px-3 font-black text-sm text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="uppercase tracking-wider">{tr.labels.total}</span>
                  <span>{MT(calculations.total)}</span>
                </div>
              </div>

              {/* Authorised Signature Line */}
              <div className="mt-8 text-center">
                <div className="border-b border-gray-900 pb-1 mb-1 min-h-[30px] flex items-end justify-center">
                  {company?.signature_url ? (
                    <img src={company.signature_url} alt="Assinatura" className="h-8 object-contain" />
                  ) : null}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600">{tr.labels.authorisedSignature}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM DECORATIVE COLOR STRIP --- */}
      <div className="h-4 w-full flex">
        <div className="h-full flex-1" style={{ backgroundColor: primaryColor }} />
        <div className="h-full w-24" style={{ backgroundColor: darkNavy }} />
      </div>
    </div>
  );
}
