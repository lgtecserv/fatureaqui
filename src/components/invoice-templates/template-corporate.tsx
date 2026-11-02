import { MT } from "@/lib/format";
import { StampGenerator } from "@/components/stamp-generator";
import { getInvoiceTranslations } from "@/lib/invoice-translations";
import { Phone, MapPin, Mail, Globe } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateCorporate({
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
  const primaryColor = company?.primary_color || "#EAB308"; // Gold/Yellow default
  const docTypeName = tr.documentTypes[documentData.type] || documentData.type;
  const showFinancials = documentData.type !== "GR";
  const shouldShowPaymentInfo = ["FT", "CT", "ND"].includes(documentData.type);

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-800 shadow-2xl border border-gray-200 flex flex-col justify-between" 
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="p-10 flex-1 flex flex-col">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start mb-8">
          {company?.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={company?.name} 
              crossOrigin="anonymous"
              className="h-16 object-contain max-w-[240px]" 
            />
          ) : (
            <div className="flex items-center gap-3.5">
              <div 
                className="h-14 w-14 rounded-lg flex items-center justify-center font-black text-white text-2xl shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {company?.name?.charAt(0) || "B"}
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tight text-gray-900 uppercase">
                  {company?.name || "EMPRESA"}
                </h1>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                  {company?.website || "Soluções Empresariais & Comerciais"}
                </p>
              </div>
            </div>
          )}

          {/* Top Right Colored Accent Block */}
          <div 
            className="w-48 h-8 rounded-sm shadow-sm"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* --- ENTITY & INVOICE METADATA --- */}
        <div className="flex justify-between items-start mb-8 gap-8">
          {/* Invoice To */}
          <div className="max-w-[50%]">
            <span className="font-bold text-gray-900 text-xs block mb-1">{tr.labels.invoiceTo}</span>
            <p className="font-bold text-sm text-gray-900">{client?.name || tr.labels.clientName}</p>
            {client?.company_name && <p className="text-gray-600 text-xs">{client.company_name}</p>}
            <p className="text-gray-500 text-xs">{client?.address || tr.labels.clientAddress}</p>
            <p className="text-gray-600 text-xs mt-1">
              {client?.nuit && <span><strong>{tr.labels.clientNuit}</strong> {client.nuit} </span>}
              {client?.phone && <span>| {tr.labels.clientPhone} {client.phone}</span>}
            </p>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
            <h2 className="font-black text-2xl text-gray-900 uppercase tracking-wide mb-2">
              {docTypeName}
            </h2>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-6">
                <span className="font-bold text-gray-700">{tr.labels.invoiceNumber}</span>
                <span className="text-gray-900 font-semibold">{documentData.number || "0000"}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="font-bold text-gray-700">{tr.labels.date}</span>
                <span className="text-gray-900">{documentData.date}</span>
              </div>
              {documentData.reference_invoice && (
                <div className="flex justify-between gap-6">
                  <span className="font-bold text-gray-700">{tr.labels.referenceDoc}</span>
                  <span className="text-gray-900">{documentData.reference_invoice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- BORDERED GRID TABLE --- */}
        <div className="flex-1 mb-8">
          <table className="w-full border-collapse border border-gray-900 text-left">
            <thead>
              <tr className="bg-gray-900 text-white text-[11px] uppercase font-bold tracking-wider">
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
                  <tr key={idx} className="border-b border-gray-900">
                    <td className="border-r border-gray-900 py-2.5 px-3 text-center font-bold text-gray-600">{idx + 1}</td>
                    <td className="border-r border-gray-900 py-2.5 px-3 font-semibold text-gray-900">{it.description || "—"}</td>
                    <td className="border-r border-gray-900 py-2.5 px-3 text-center uppercase text-gray-600">{it.unit || "UN"}</td>
                    <td className="border-r border-gray-900 py-2.5 px-3 text-center font-bold text-gray-900">{it.quantity}</td>
                    {showFinancials && (
                      <>
                        <td className="border-r border-gray-900 py-2.5 px-3 text-right font-mono text-gray-700">{MT(price)}</td>
                        <td className="border-r border-gray-900 py-2.5 px-3 text-center text-gray-500">
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

        {/* --- BOTTOM SECTION: PAYMENT INFO & TOTALS --- */}
        <div className="flex justify-between items-start gap-8 mb-6">
          {/* Left: Payment Info + Terms + Stamp */}
          <div className="flex-1 space-y-4 max-w-sm">
            {shouldShowPaymentInfo && (company?.bank_name || company?.bank_account || company?.mpesa_number || company?.emola_number) && (
              <div className="bg-gray-50 p-3.5 rounded border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wider">{tr.labels.paymentInfo}:</h4>
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  {company?.bank_account && <p>{tr.labels.accountNumber} <span className="text-gray-900 font-semibold">{company.bank_account}</span></p>}
                  {company?.bank_holder && <p>{tr.labels.accountHolder} <span className="text-gray-900 font-semibold">{company.bank_holder}</span></p>}
                  {company?.bank_name && <p>{tr.labels.bank} <span className="text-gray-900 font-semibold">{company.bank_name} {company?.bank_iban && `(${company.bank_iban})`}</span></p>}
                  {company?.mpesa_number && <p><span className="text-red-600 font-bold">{tr.labels.mpesa}</span> <span className="text-gray-900 font-bold">{company.mpesa_number}</span></p>}
                  {company?.emola_number && <p><span className="text-orange-600 font-bold">{tr.labels.emola}</span> <span className="text-gray-900 font-bold">{company.emola_number}</span></p>}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">{tr.labels.termsAndConditions}:</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
                {documentData.observations || tr.labels.defaultTerms}
              </p>
            </div>

            <div className="pt-1">
              <StampGenerator company={company} className="w-20 h-20" />
            </div>
          </div>

          {/* Subtotal, Tax, and Highlighted TOTAL Box */}
          {showFinancials && (
            <div className="w-64 shrink-0">
              <div className="border border-gray-900 text-xs divide-y divide-gray-900">
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
                {/* Highlighted Total Box */}
                <div 
                  className="flex justify-between py-2.5 px-3 font-black text-sm text-gray-900"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="uppercase tracking-wider">{tr.labels.total}</span>
                  <span>{MT(calculations.total)}</span>
                </div>
              </div>

              {/* Authorised Sign Line */}
              <div className="mt-8 text-center">
                <div className="border-b border-gray-900 pb-1 mb-1 min-h-[35px] flex items-end justify-center">
                  {company?.signature_url ? (
                    <img src={company.signature_url} alt="Assinatura" className="h-9 object-contain" />
                  ) : null}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600">{tr.labels.authorisedSignature}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER STRIP (Solid Primary Color with Icons) --- */}
      <div 
        className="py-2.5 px-8 text-gray-900 font-bold text-[11px] flex justify-between items-center flex-wrap gap-2 shadow-inner"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          <span>{company?.phone || "+258 00 000 0000"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>{company?.address || "Maputo, Moçambique"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          <span>{company?.email || "contacto@empresa.com"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" />
          <span>{company?.website || (tr.labels.clientNuit + " " + (company?.nuit || "000000000"))}</span>
        </div>
      </div>
    </div>
  );
}
