import { MT } from "@/lib/format";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { StampGenerator } from "@/components/stamp-generator";
import { QrCode, Phone, MapPin, Mail, Globe } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateCorporate({
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
  const primaryColor = company?.primary_color || "#EAB308"; // Gold/Yellow default from image or company color
  const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "INVOICE";
  const showFinancials = documentData.type !== "GR";

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-800 shadow-2xl border border-gray-200 flex flex-col justify-between" 
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="p-10 flex-1 flex flex-col">
        {/* --- HEADER (Brand Name on Left, Colored Block on Right) --- */}
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
                    {company?.name || "Brand Name"}
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
            <span className="font-bold text-gray-900 text-xs block mb-1">Invoice to:</span>
            <p className="font-bold text-sm text-gray-900">{client?.name || "Nome do Cliente"}</p>
            {client?.company_name && <p className="text-gray-600 text-xs">{client.company_name}</p>}
            <p className="text-gray-500 text-xs">{client?.address || "Endereço do Cliente"}</p>
            <p className="text-gray-600 text-xs mt-1">
              {client?.nuit && <span><strong>NUIT:</strong> {client.nuit} </span>}
              {client?.phone && <span>| Tel: {client.phone}</span>}
            </p>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
            <h2 className="font-black text-2xl text-gray-900 uppercase tracking-wide mb-2">
              {docTypeName}
            </h2>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-6">
                <span className="font-bold text-gray-700">Invoice #:</span>
                <span className="text-gray-900 font-semibold">{documentData.number || "0000"}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="font-bold text-gray-700">Date:</span>
                <span className="text-gray-900">{documentData.date}</span>
              </div>
              {documentData.reference_invoice && (
                <div className="flex justify-between gap-6">
                  <span className="font-bold text-gray-700">Ref. Doc:</span>
                  <span className="text-gray-900">{documentData.reference_invoice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- BORDERED GRID TABLE (Exact Image 1 Style) --- */}
        <div className="flex-1">
          <table className="w-full border-collapse border border-gray-900 text-left">
            <thead>
              <tr className="bg-gray-900 text-white text-[11px] uppercase font-bold tracking-wider">
                <th className="border border-gray-900 py-2.5 px-3 w-12 text-center">No</th>
                <th className="border border-gray-900 py-2.5 px-3">Item Description</th>
                <th className="border border-gray-900 py-2.5 px-2 text-center w-16">Un.</th>
                <th className="border border-gray-900 py-2.5 px-3 text-center w-16">Qty</th>
                {showFinancials && (
                  <>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-28">Price</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-24">Desc.</th>
                    <th className="border border-gray-900 py-2.5 px-3 text-right w-32">Total</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={showFinancials ? 7 : 4} className="border border-gray-900 py-6 text-center text-gray-400 italic">
                    Sem itens adicionados
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
                    <td className="border border-gray-900 py-2 px-3 text-center text-gray-700">{index + 1}</td>
                    <td className="border border-gray-900 py-2 px-3 font-medium text-gray-900">
                      {item.description || <span className="text-gray-300 italic">Sem descrição...</span>}
                    </td>
                    <td className="border border-gray-900 py-2 px-2 text-center uppercase text-gray-600">{item.unit || "un"}</td>
                    <td className="border border-gray-900 py-2 px-3 text-center text-gray-900 font-semibold">{qty}</td>
                    {showFinancials && (
                      <>
                        <td className="border border-gray-900 py-2 px-3 text-right text-gray-700">{MT(price)}</td>
                        <td className="border border-gray-900 py-2 px-3 text-right text-gray-500">{lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"}</td>
                        <td className="border border-gray-900 py-2 px-3 text-right font-bold text-gray-900">{MT(lineTotal)}</td>
                      </>
                    )}
                  </tr>
                );
              })}

              {/* Extra empty rows to match the paper invoice look if items are few */}
              {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-7 text-xs">
                  <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                  <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                  <td className="border border-gray-900 py-2 px-2">&nbsp;</td>
                  <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                  {showFinancials && (
                    <>
                      <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                      <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                      <td className="border border-gray-900 py-2 px-3">&nbsp;</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- TOTALS BOX & PAYMENT INFO (Exact Image 1 Style) --- */}
          <div className="flex justify-between items-start mt-4 gap-8">
            {/* Payment Info & Terms */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-1">Payment Info:</h4>
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  {company?.bank_account && <p>Account #: <span className="text-gray-900 font-semibold">{company.bank_account}</span></p>}
                  {company?.bank_holder && <p>A/C Name: <span className="text-gray-900 font-semibold">{company.bank_holder}</span></p>}
                  {company?.bank_name && <p>Bank Details: <span className="text-gray-900 font-semibold">{company.bank_name} {company?.bank_iban && `(${company.bank_iban})`}</span></p>}
                  {company?.mpesa_number && <p><span className="text-red-600 font-bold">M-Pesa:</span> <span className="text-gray-900 font-bold">{company.mpesa_number}</span></p>}
                  {company?.emola_number && <p><span className="text-orange-600 font-bold">e-Mola:</span> <span className="text-gray-900 font-bold">{company.emola_number}</span></p>}
                  {!company?.bank_account && !company?.mpesa_number && (
                    <p>Details: <span className="text-gray-900 font-medium">Transferência Bancária / Numerário</span></p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-1">Term & Condition:</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
                  {documentData.observations || "O pagamento é devido conforme acordado. Documento fiscal processado por computador."}
                </p>
              </div>

              <div className="pt-2">
                <StampGenerator company={company} className="h-28 w-28" />
              </div>
            </div>

            {/* Subtotal, Tax, and Highlighted TOTAL Box */}
            {showFinancials && (
              <div className="w-64 shrink-0">
                <div className="border border-gray-900 text-xs divide-y divide-gray-900">
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
                  {/* Highlighted Total Box */}
                  <div 
                    className="flex justify-between py-2.5 px-3 font-black text-sm text-gray-900"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="uppercase tracking-wider">TOTAL</span>
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
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600">Authorised Sign</span>
                </div>
              </div>
            )}
          </div>
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
          <span>{company?.website || "NUIT: " + (company?.nuit || "000000000")}</span>
        </div>
      </div>
    </div>
  );
}
