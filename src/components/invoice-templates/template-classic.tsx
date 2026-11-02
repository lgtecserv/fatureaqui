import { MT } from "@/lib/format";
import { StampGenerator } from "@/components/stamp-generator";
import { getInvoiceTranslations } from "@/lib/invoice-translations";
import type { TemplateProps } from "./types";

export function TemplateClassic({
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
  const primaryColor = company?.primary_color || "#02664D";
  const docTypeName = tr.documentTypes[documentData.type] || documentData.type;
  const showFinancials = documentData.type !== "GR";
  const shouldShowPaymentInfo = ["FT", "CT", "ND"].includes(documentData.type);

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[13px] text-gray-800 shadow-2xl border border-gray-100 flex flex-col justify-between" 
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      
      {/* --- TOP GEOMETRIC ACCENT --- */}
      <div className="absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none z-0">
        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,0 L800,0 L800,120 C500,20 300,160 0,60 Z" fill={primaryColor} fillOpacity="0.05" />
          <path d="M0,0 L800,0 L800,80 C600,0 400,120 0,30 Z" fill={primaryColor} fillOpacity="0.1" />
          <path d="M0,0 L800,0 L800,40 C500,-10 300,70 0,10 Z" fill={primaryColor} />
        </svg>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 p-10 flex flex-col flex-1">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 z-10 relative px-4 mt-8">
          {/* Company Info */}
          <div className="flex flex-col max-w-[55%] break-words">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company?.name} 
                crossOrigin="anonymous"
                className="h-20 mb-3 object-contain max-w-[240px]" 
              />
            ) : (
              <>
                <div 
                  className="h-16 w-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-2 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {company?.name?.charAt(0) || "F"}
                </div>
                <h1 className="font-extrabold text-lg tracking-tight text-gray-900 mb-1">{company?.name || "Sua Empresa, Lda"}</h1>
              </>
            )}
            <p className="text-gray-500">{company?.address || "Endereço da Empresa"}</p>
            <div className="flex items-center gap-3 text-gray-500 mt-1 flex-wrap">
              <span><strong className="text-gray-700">NUIT:</strong> {company?.nuit || "000000000"}</span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span>{company?.phone || "Tel: +258 000 000 000"}</span>
            </div>
            <p className="text-gray-500">{company?.email || "email@empresa.com"}</p>
          </div>

          <div className="text-right flex flex-col items-end max-w-[40%]">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2 text-right break-words w-full" style={{ color: primaryColor, lineHeight: "1.2" }}>
              {docTypeName}
            </h2>
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 mt-2 text-right min-w-[200px]">
              <div className="flex justify-between mb-1 gap-8">
                <span className="text-gray-500 font-medium">{tr.labels.invoiceNumber}</span>
                <span className="font-bold text-gray-900">{documentData.number || "---"}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-gray-500 font-medium">{tr.labels.date}</span>
                <span className="font-bold text-gray-900">{documentData.date}</span>
              </div>
              {documentData.reference_invoice && (
                <div className="flex justify-between gap-8 mt-1 border-t border-gray-200/50 pt-1 text-xs">
                  <span className="text-gray-500">{tr.labels.referenceDoc}</span>
                  <span className="font-semibold text-gray-900">{documentData.reference_invoice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Entities Info */}
        <div className="flex justify-between items-stretch mb-8 gap-6">
          {/* Client Box */}
          <div className="flex-1 rounded-xl p-5 border-l-4 bg-gray-50/80" style={{ borderLeftColor: primaryColor }}>
            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">{tr.labels.invoiceTo}</h3>
            <p className="font-bold text-base text-gray-900 mb-1">{client?.name || tr.labels.clientName}</p>
            {client?.company_name && <p className="text-gray-700 font-medium text-sm mb-1">{client.company_name}</p>}
            <p className="text-gray-500 mb-1">{client?.address || tr.labels.clientAddress}</p>
            <p className="text-gray-700"><strong className="text-gray-500 font-medium">{tr.labels.clientNuit}</strong> {client?.nuit || "—"}</p>
          </div>

          {/* Transport Info if GR */}
          {documentData.type === "GR" && (
            <div className="flex-1 rounded-xl p-5 border border-gray-200 bg-gray-50/50 text-xs space-y-1.5">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Guia de Transporte</h3>
              <p><strong>{tr.labels.transportOrigin}</strong> {documentData.origin || "—"}</p>
              <p><strong>{tr.labels.transportDestination}</strong> {documentData.destination || "—"}</p>
              <p><strong>{tr.labels.driver}</strong> {documentData.driver || "—"}</p>
              <p><strong>{tr.labels.vehiclePlate}</strong> {documentData.vehicle_plate || "—"}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-8 flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 text-left text-xs uppercase tracking-wider text-gray-600 font-bold" style={{ borderColor: primaryColor }}>
                <th className="py-3 px-3 w-12 text-center">{tr.labels.itemNumber}</th>
                <th className="py-3 px-3">{tr.labels.description}</th>
                <th className="py-3 px-3 text-center w-16">{tr.labels.unit}</th>
                <th className="py-3 px-3 text-center w-16">{tr.labels.quantity}</th>
                {showFinancials && (
                  <>
                    <th className="py-3 px-3 text-right w-28">{tr.labels.unitPrice}</th>
                    <th className="py-3 px-3 text-center w-20">{tr.labels.discount}</th>
                    <th className="py-3 px-3 text-right w-32">{tr.labels.total}</th>
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
                  <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/40" : ""}>
                    <td className="py-3 px-3 text-center text-gray-400 text-xs font-medium">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-gray-800">{it.description || "Item sem descrição"}</p>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-500 uppercase text-xs">{it.unit || "UN"}</td>
                    <td className="py-3 px-3 text-center font-bold text-gray-700">{it.quantity}</td>
                    {showFinancials && (
                      <>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">{MT(price)}</td>
                        <td className="py-3 px-3 text-center text-gray-400 text-xs">
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
        </div>

        {/* Financial Summary & Observations */}
        <div className="flex justify-between items-start mb-6 gap-8">
          {/* Notes */}
          <div className="flex-1 space-y-4">
            <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
              <h4 className="font-bold text-gray-700 text-xs mb-1 uppercase tracking-wider">{tr.labels.termsAndConditions}:</h4>
              <p className="text-gray-600 text-xs whitespace-pre-wrap leading-relaxed">
                {documentData.observations || tr.labels.defaultTerms}
              </p>
            </div>
          </div>

          {/* Totals */}
          {showFinancials && (
            <div className="w-full md:w-[320px] shrink-0">
              <div className="space-y-3 p-4">
                <div className="flex justify-between text-gray-600">
                  <span>{tr.labels.subtotal}</span>
                  <span className="font-semibold text-gray-900">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>{tr.labels.totalDiscount}</span>
                    <span className="font-semibold">-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between text-gray-600">
                    <span>{tr.labels.vat} ({ivaRate}%)</span>
                    <span className="font-semibold text-gray-900">{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between text-gray-600">
                    <span>{tr.labels.ispc} ({ispcRate}%)</span>
                    <span className="font-semibold text-gray-900">{MT(calculations.totalIspc || 0)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-base">
                  <span className="font-bold text-gray-900">{tr.labels.totalToPay}:</span>
                  <span className="font-black text-xl" style={{ color: primaryColor }}>{MT(calculations.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Coordinates Block - ONLY for FT, CT, ND */}
        {shouldShowPaymentInfo && (company?.bank_name || company?.bank_account || company?.mpesa_number || company?.emola_number) && (
          <div className="mt-2 p-3.5 bg-gray-50/90 rounded-xl border border-gray-200 text-xs text-gray-700">
            <span className="font-bold uppercase tracking-wider text-[10px] text-gray-900 block mb-1.5">
              {tr.labels.paymentInfo}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {company?.bank_name && (
                <div className="space-y-0.5">
                  <div><strong>{tr.labels.bank}</strong> {company.bank_name}</div>
                  {company?.bank_account && <div><strong>{tr.labels.accountNumber}</strong> {company.bank_account}</div>}
                  {company?.bank_iban && <div><strong>{tr.labels.nibIban}</strong> {company.bank_iban}</div>}
                </div>
              )}
              <div className="space-y-1">
                {company?.mpesa_number && (
                  <div>
                    <span className="font-bold text-red-600">{tr.labels.mpesa}</span> <strong>{company.mpesa_number}</strong>
                  </div>
                )}
                {company?.emola_number && (
                  <div>
                    <span className="font-bold text-orange-600">{tr.labels.emola}</span> <strong>{company.emola_number}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Area with Stamp and Signature */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-end">
          <div className="text-[11px] text-gray-400 space-y-0.5 max-w-xs">
            <p className="font-semibold text-gray-500">{tr.labels.softwareCertification}</p>
            <p>FatureAqui — Sistema Comercial & Faturação</p>
          </div>

          <div className="flex items-end gap-6">
            <StampGenerator company={company} className="w-20 h-20" />
            <div className="text-center w-44">
              <div className="border-b border-gray-400 pb-1 mb-1 min-h-[30px] flex items-end justify-center">
                {company?.signature_url ? (
                  <img src={company.signature_url} alt="Assinatura" className="h-10 object-contain" />
                ) : (
                  <span className="text-[11px] text-gray-300 italic">{tr.labels.authorisedSignature}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{tr.labels.authorisedSignature}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
