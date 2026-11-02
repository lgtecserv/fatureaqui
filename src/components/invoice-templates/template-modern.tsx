import { MT } from "@/lib/format";
import { StampGenerator } from "@/components/stamp-generator";
import { getInvoiceTranslations } from "@/lib/invoice-translations";
import { Phone, MapPin, Mail } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateModern({
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
  const primaryColor = company?.primary_color || "#2A2E35";
  const docTypeName = tr.documentTypes[documentData.type] || documentData.type;
  const showFinancials = documentData.type !== "GR";
  const shouldShowPaymentInfo = ["FT", "CT", "ND"].includes(documentData.type);

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-700 shadow-2xl border border-gray-100 flex flex-col justify-between" 
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="p-12 flex-1 flex flex-col">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-3">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company?.name} 
                crossOrigin="anonymous"
                className="h-16 object-contain max-w-[240px]" 
              />
            ) : (
              <div className="flex items-center gap-3">
                <div 
                  className="h-16 w-16 rounded-md flex flex-col items-center justify-center p-2 text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="font-black text-xl leading-none">{company?.name?.charAt(0) || "K"}</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-80 mt-1">EMPRESA</span>
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-gray-900 tracking-tight">{company?.name || "Empresa, Lda"}</h2>
                  <p className="text-[10px] text-gray-400 font-medium">NUIT: {company?.nuit || "000000000"}</p>
                </div>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black uppercase tracking-[0.25em] text-gray-900">
            {docTypeName}
          </h1>
        </div>

        {/* --- INVOICE META & CLIENT ADDRESS (2-COLUMN MODERN BAR) --- */}
        <div className="grid grid-cols-2 gap-8 mb-10 pb-6 border-b border-gray-200">
          {/* Invoice To */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-2">
              {tr.labels.invoiceTo}
            </span>
            <h3 className="font-extrabold text-base text-gray-900 mb-1">{client?.name || tr.labels.clientName}</h3>
            {client?.company_name && <p className="text-gray-600 font-medium">{client.company_name}</p>}
            <p className="text-gray-500 text-xs mt-1">{client?.address || tr.labels.clientAddress}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              {client?.nuit && <span><strong>{tr.labels.clientNuit}</strong> {client.nuit}</span>}
              {client?.phone && <span><strong>{tr.labels.clientPhone}</strong> {client.phone}</span>}
            </div>
          </div>

          {/* Invoice Summary Data */}
          <div className="text-right space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">{tr.labels.invoiceNumber}</span>
                <span className="font-bold text-gray-900">{documentData.number || "0000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">{tr.labels.date}</span>
                <span className="font-medium text-gray-900">{documentData.date}</span>
              </div>
              {documentData.reference_invoice && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">{tr.labels.referenceDoc}</span>
                  <span className="text-gray-900 font-semibold">{documentData.reference_invoice}</span>
                </div>
              )}
            </div>

            {/* Payment Method - Only for FT, CT, ND */}
            {shouldShowPaymentInfo && (company?.bank_name || company?.bank_account || company?.mpesa_number || company?.emola_number) && (
              <div className="border-t border-gray-100 pt-2 space-y-1 text-[11px]">
                {company?.bank_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{tr.labels.bank}</span>
                    <span className="font-medium text-gray-800">{company.bank_name}</span>
                  </div>
                )}
                {company?.bank_account && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{tr.labels.accountNumber}</span>
                    <span className="font-semibold text-gray-900">{company.bank_account}</span>
                  </div>
                )}
                {company?.bank_iban && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{tr.labels.nibIban}</span>
                    <span className="font-semibold text-gray-900">{company.bank_iban}</span>
                  </div>
                )}
                {company?.mpesa_number && (
                  <div className="flex justify-between">
                    <span className="text-red-600 font-bold">{tr.labels.mpesa}</span>
                    <span className="font-bold text-gray-900">{company.mpesa_number}</span>
                  </div>
                )}
                {company?.emola_number && (
                  <div className="flex justify-between">
                    <span className="text-orange-600 font-bold">{tr.labels.emola}</span>
                    <span className="font-bold text-gray-900">{company.emola_number}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- MODERN TABLE WITH CONTRAST HEADER --- */}
        <div className="flex-1">
          <table className="w-full text-left border-collapse overflow-hidden rounded-t-lg">
            <thead>
              <tr 
                className="text-white text-[10px] uppercase font-bold tracking-widest"
                style={{ backgroundColor: primaryColor }}
              >
                <th className="py-3 px-3 w-12 text-center">{tr.labels.itemNumber}</th>
                <th className="py-3 px-3">{tr.labels.description}</th>
                <th className="py-3 px-2 text-center w-16">{tr.labels.unit}</th>
                <th className="py-3 px-3 text-center w-20">{tr.labels.quantity}</th>
                {showFinancials && (
                  <>
                    <th className="py-3 px-3 text-right w-24">{tr.labels.unitPrice}</th>
                    <th className="py-3 px-3 text-right w-20">{tr.labels.discount}</th>
                    <th className="py-3 px-3 text-right w-28">{tr.labels.total}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={showFinancials ? 7 : 4} className="py-8 text-center text-gray-400 italic">
                    {tr.labels.noItems}
                  </td>
                </tr>
              )}
              {items.map((item, index) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.unit_price) || 0;
                const lineGross = qty * price;
                const discountVal = parseFloat(item.discount_value) || 0;
                const lineDiscount = item.discount_type === "percentagem" ? lineGross * (discountVal / 100) : discountVal;
                const lineTotal = lineGross - lineDiscount;

                return (
                  <tr 
                    key={item.id || index} 
                    className={`border-b border-gray-100 text-xs ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}`}
                  >
                    <td className="py-3 px-3 text-center text-gray-400 font-semibold">{String(index + 1).padStart(2, '0')}</td>
                    <td className="py-3 px-3 font-semibold text-gray-800">
                      {item.description || <span className="text-gray-300 italic">Sem descrição...</span>}
                    </td>
                    <td className="py-3 px-2 text-center uppercase text-gray-500 font-medium">{item.unit || "un"}</td>
                    <td className="py-3 px-3 text-center font-bold text-gray-800">{item.quantity}</td>
                    {showFinancials && (
                      <>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">{MT(price)}</td>
                        <td className="py-3 px-3 text-right text-gray-400">
                          {discountVal > 0 ? (item.discount_type === "percentagem" ? `${discountVal}%` : MT(discountVal)) : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">{MT(lineTotal)}</td>
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

          {/* --- TOTAL DUE STRIP & BREAKDOWN --- */}
          <div className="flex justify-between items-start mt-8 pt-4">
            {/* Left Column: Bold Total Due Highlight */}
            {showFinancials && (
              <div className="w-64 pt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{tr.labels.totalToPay}</span>
                <p className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                  {MT(calculations.total)}
                </p>
                <div className="w-48 h-0.5 bg-gray-900 mb-2" />
                <p className="text-[10px] text-gray-400 italic">
                  {tr.labels.softwareCertification}
                </p>
              </div>
            )}

            {/* Right Column: Detailed Breakdown Table */}
            {showFinancials && (
              <div className="w-64 text-xs space-y-2">
                <div className="flex justify-between py-1 text-gray-500 font-medium">
                  <span>{tr.labels.subtotal}</span>
                  <span className="font-bold text-gray-800">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-red-500 font-medium">
                    <span>{tr.labels.totalDiscount}</span>
                    <span>-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between py-1 text-gray-500 font-medium">
                    <span>{tr.labels.vat} ({ivaRate}%)</span>
                    <span className="font-bold text-gray-800">{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between py-1 text-gray-500 font-medium">
                    <span>{tr.labels.ispc} ({ispcRate}%)</span>
                    <span className="font-bold text-gray-800">{MT(calculations.totalIspc)}</span>
                  </div>
                )}
                {/* Solid Dark Total Box */}
                <div 
                  className="flex justify-between py-2.5 px-4 rounded text-white font-black text-sm tracking-wide shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="uppercase tracking-widest text-xs">{tr.labels.total}</span>
                  <span>{MT(calculations.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Terms & Signature Section */}
          <div className="flex justify-between items-end mt-10 pt-6 border-t border-gray-100">
            <div className="max-w-sm space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-900 block">{tr.labels.termsAndConditions}</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {documentData.observations || tr.labels.defaultTerms}
              </p>
              <div className="pt-2">
                <StampGenerator company={company} className="w-20 h-20" />
              </div>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-gray-300 pb-1 mb-1 min-h-[35px] flex items-end justify-center">
                {company?.signature_url ? (
                  <img src={company.signature_url} alt="Assinatura" className="h-10 object-contain" />
                ) : (
                  <span className="text-[11px] text-gray-300 italic">{tr.labels.authorisedSignature}</span>
                )}
              </div>
              <p className="font-bold text-xs text-gray-900">{company?.name || "Responsável"}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{tr.labels.authorisedSignature}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM 3-COLUMN CONTACT FOOTER --- */}
      <div>
        <div className="border-t border-gray-200 py-4 px-12 grid grid-cols-3 gap-6 text-[11px] text-gray-600 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <Phone className="h-3.5 w-3.5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{company?.phone || "+258 84 000 0000"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-gray-200 pl-6">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate">{company?.address || "Maputo, Moçambique"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-gray-200 pl-6">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <Mail className="h-3.5 w-3.5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate">{company?.email || "info@empresa.com"}</p>
            </div>
          </div>
        </div>

        {/* Solid bottom colored bar */}
        <div className="h-3.5 w-full" style={{ backgroundColor: primaryColor }} />
      </div>
    </div>
  );
}
