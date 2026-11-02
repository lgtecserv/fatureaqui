import { MT } from "@/lib/format";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { StampGenerator } from "@/components/stamp-generator";
import { QrCode, Phone, MapPin, Mail, Globe } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateGeometric({
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
  const primaryColor = company?.primary_color || "#F59E0B"; // Yellow/amber or company color
  const darkNavy = "#1E2238"; // Deep complementary navy from Image 3
  const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "INVOICE";
  const showFinancials = documentData.type !== "GR";

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-800 shadow-2xl border border-gray-100 flex flex-col justify-between" 
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* --- TOP-RIGHT ANGULAR DIAGONAL BANNER (Exact Image 3 Style) --- */}
      <div className="absolute top-0 right-0 w-[420px] h-28 pointer-events-none z-0">
        <svg viewBox="0 0 420 120" className="w-full h-full" preserveAspectRatio="none">
          {/* Main Diagonal Primary Color Block */}
          <polygon points="50,0 420,0 420,100 20,100" fill={primaryColor} />
          {/* Dark Accent Triangle Wedge */}
          <polygon points="0,0 60,0 30,100 0,100" fill={darkNavy} />
        </svg>

        {/* Contact details embedded in top-right colored banner */}
        <div className="absolute top-3 right-6 text-right text-gray-900 font-bold text-[10px] space-y-0.5">
          <p className="flex items-center justify-end gap-1.5"><MapPin className="h-3 w-3" /> {company?.address || "Endereço da Empresa"}</p>
          <p className="flex items-center justify-end gap-1.5"><Mail className="h-3 w-3" /> {company?.email || "contacto@empresa.com"}</p>
          <p className="flex items-center justify-end gap-1.5"><Phone className="h-3 w-3" /> {company?.phone || "+258 000 000 000"}</p>
          <p className="flex items-center justify-end gap-1.5"><Globe className="h-3 w-3" /> {company?.website || "NUIT: " + (company?.nuit || "000000000")}</p>
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
                <span className="font-black text-lg tracking-wider text-gray-900 uppercase block">{company?.name || "LOGO HERE"}</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">EMPRESA COMERCIAL</span>
              </div>
            </div>
          )}
        </div>

        {/* --- INVOICE TITLE (Centered / Right-aligned) --- */}
        <div className="text-right mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">
            {docTypeName}
          </h1>
        </div>

        {/* --- TWO-COLUMN DETAILS GRID --- */}
        <div className="grid grid-cols-2 gap-10 mb-8 text-xs">
          {/* Invoice Details */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-2">INVOICE DETAILS</h3>
            <div className="space-y-1.5 text-gray-700">
              <p className="border-b border-gray-200 pb-1">INVOICE NUMBER : <strong className="text-gray-900">{documentData.number || "0000"}</strong></p>
              <p className="border-b border-gray-200 pb-1">INVOICE DATE : <strong className="text-gray-900">{documentData.date}</strong></p>
              {documentData.reference_invoice && (
                <p className="border-b border-gray-200 pb-1">REF. DOCUMENTO : <strong className="text-gray-900">{documentData.reference_invoice}</strong></p>
              )}
            </div>
          </div>

          {/* Invoice To */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-2">INVOICE TO</h3>
            <div className="space-y-1.5 text-gray-700">
              <p className="border-b border-gray-200 pb-1">NAME : <strong className="text-gray-900">{client?.name || "Consumidor Final"}</strong></p>
              <p className="border-b border-gray-200 pb-1">PHONE : <strong className="text-gray-900">{client?.phone || "—"}</strong></p>
              <p className="border-b border-gray-200 pb-1">ADDRESS : <span className="text-gray-800">{client?.address || "—"}</span></p>
              <p className="border-b border-gray-200 pb-1">NUIT : <strong className="text-gray-900">{client?.nuit || "—"}</strong></p>
            </div>
          </div>
        </div>

        {/* --- STRUCTURED TABLE WITH CELL BORDERS (Exact Image 3 Style) --- */}
        <div className="flex-1">
          <table className="w-full border-collapse border border-gray-900 text-left">
            <thead>
              <tr 
                className="text-white text-[11px] uppercase font-bold tracking-wider"
                style={{ backgroundColor: darkNavy }}
              >
                <th className="border border-gray-900 py-2.5 px-3 w-14 text-center">SL NO</th>
                <th className="border border-gray-900 py-2.5 px-3">ITEM DESCRIPTION</th>
                <th className="border border-gray-900 py-2.5 px-2 text-center w-16">UN.</th>
                <th className="border border-gray-900 py-2.5 px-3 text-center w-20">QUANTITY</th>
                {showFinancials && (
                  <>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-28">UNIT PRICE</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-24">DESC.</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-32">TOTAL</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={showFinancials ? 7 : 4} className="border border-gray-900 py-6 text-center text-gray-400 italic">
                    Sem itens
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
                  <tr key={item.id || index} className="text-xs">
                    <td className="border border-gray-900 py-2 px-3 text-center text-gray-600 font-semibold">{index + 1}</td>
                    <td className="border border-gray-900 py-2 px-3 font-semibold text-gray-900">
                      {item.description || <span className="text-gray-300 italic">Sem descrição...</span>}
                    </td>
                    <td className="border border-gray-900 py-2 px-2 text-center uppercase text-gray-600">{item.unit || "un"}</td>
                    <td className="border border-gray-900 py-2 px-3 text-center font-bold text-gray-900">{qty}</td>
                    {showFinancials && (
                      <>
                        <td className="border border-gray-900 py-2 px-3 text-right text-gray-700">{MT(price)}</td>
                        <td className="border border-gray-900 py-2 px-3 text-right text-gray-500">{lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"}</td>
                        <td className="border border-gray-900 py-2 px-3 text-right font-black text-gray-900">{MT(lineTotal)}</td>
                      </>
                    )}
                  </tr>
                );
              })}

              {/* Extra spacing rows to maintain structure */}
              {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                <tr key={`geo-empty-${i}`} className="h-6">
                  <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                  <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                  <td className="border border-gray-900 py-1.5 px-2">&nbsp;</td>
                  <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                  {showFinancials && (
                    <>
                      <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                      <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                      <td className="border border-gray-900 py-1.5 px-3">&nbsp;</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- TOTALS BOX & TERMS --- */}
          <div className="flex justify-between items-start mt-4 gap-8">
            {/* Left: Payment Info & Thanks */}
            <div className="flex-1 space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-1">PAYMENT INFO</h4>
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <p>ACCOUNT NUMBER : <span className="text-gray-900 font-semibold">{company?.bank_account || "0000 0000 0000"}</span></p>
                  <p>A/C NAME : <span className="text-gray-900 font-semibold">{company?.bank_holder || company?.name}</span></p>
                  <p>BANK DETAILS : <span className="text-gray-900 font-semibold">{company?.bank_name ? `${company.bank_name} - ${company.bank_iban || ""}` : "Transferência / Depósito"}</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-0.5">Terms & Conditions / Note</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
                  {documentData.observations || "Documento emitido ao abrigo da legislação fiscal em vigor. Obrigado pela preferência."}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <StampGenerator company={company} date={documentData.date} />
                <div className="p-1 border border-gray-200 rounded">
                  <QrCode className="h-10 w-10 text-gray-600" />
                </div>
              </div>

              <div className="pt-4">
                <p className="font-black text-sm uppercase tracking-wider text-gray-900">
                  THANKS FOR YOUR BUSINESS
                </p>
              </div>
            </div>

            {/* Right: Totals Box & Signature */}
            {showFinancials && (
              <div className="w-64 shrink-0 text-xs">
                <div className="border border-gray-900 divide-y divide-gray-900">
                  <div className="flex justify-between py-2 px-3 bg-white font-medium">
                    <span>Sub Total</span>
                    <span className="font-bold">{MT(calculations.subtotal)}</span>
                  </div>
                  {calculations.totalDiscount > 0 && (
                    <div className="flex justify-between py-2 px-3 bg-white text-red-600">
                      <span>Desconto</span>
                      <span>-{MT(calculations.totalDiscount)}</span>
                    </div>
                  )}
                  {hasIva && (
                    <div className="flex justify-between py-2 px-3 bg-white font-medium">
                      <span>Tax ({ivaRate}%)</span>
                      <span>{MT(calculations.totalIva)}</span>
                    </div>
                  )}
                  {hasIspc && (
                    <div className="flex justify-between py-2 px-3 bg-white font-medium">
                      <span>ISPC ({ispcRate}%)</span>
                      <span>{MT(calculations.totalIspc)}</span>
                    </div>
                  )}
                  <div 
                    className="flex justify-between py-2 px-3 font-black text-gray-900 text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Total</span>
                    <span>{MT(calculations.total)}</span>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <div className="border-b border-gray-900 pb-1 mb-1 min-h-[35px] flex items-end justify-center">
                    {company?.signature_url ? (
                      <img src={company.signature_url} alt="Assinatura" className="h-9 object-contain" />
                    ) : null}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Authorised Signature</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM-LEFT ANGULAR GEOMETRIC ACCENT (Exact Image 3 Style) --- */}
      <div className="relative w-full h-10 pointer-events-none z-0">
        <svg viewBox="0 0 794 40" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="0,0 240,0 200,40 0,40" fill={primaryColor} />
          <polygon points="200,10 320,10 300,40 180,40" fill={darkNavy} />
        </svg>
      </div>
    </div>
  );
}
