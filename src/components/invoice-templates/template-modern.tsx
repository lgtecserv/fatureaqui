import { MT } from "@/lib/format";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { StampGenerator } from "@/components/stamp-generator";
import { Phone, MapPin, Mail, QrCode } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateModern({
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
  const primaryColor = company?.primary_color || "#2A2E35";
  const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "INVOICE";
  const showFinancials = documentData.type !== "GR";

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[12px] text-gray-700 shadow-2xl border border-gray-100 flex flex-col justify-between" 
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="p-12 flex-1 flex flex-col">
        {/* --- HEADER (Square Brand Tag on Left, Bold Clean Title on Right) --- */}
        <div className="flex justify-between items-start mb-10">
          {/* Brand Tag Container */}
          <div className="flex items-center gap-3">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company?.name} 
                crossOrigin="anonymous"
                className="h-16 object-contain" 
              />
            ) : (
              <div 
                className="h-16 w-16 rounded-md flex flex-col items-center justify-center p-2 text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="font-black text-xl leading-none">{company?.name?.charAt(0) || "K"}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-80 mt-1">Corporate</span>
              </div>
            )}
            <div>
              <h2 className="font-extrabold text-base text-gray-900 tracking-tight">{company?.name || "Corporate Lda"}</h2>
              <p className="text-[10px] text-gray-400 font-medium">NUIT: {company?.nuit || "000000000"}</p>
            </div>
          </div>

          {/* INVOICE Title */}
          <h1 className="text-3xl font-black uppercase tracking-[0.25em] text-gray-900">
            {docTypeName}
          </h1>
        </div>

        {/* --- 2-COLUMN METADATA BLOCK --- */}
        <div className="grid grid-cols-2 gap-10 mb-8 border-b border-gray-100 pb-8 text-xs">
          {/* Invoice To */}
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400 block mb-2">INVOICE TO</span>
            <p className="font-black text-base text-gray-900 mb-1">{client?.name || "Consumidor Final"}</p>
            {client?.company_name && <p className="text-gray-600 font-medium mb-1">{client.company_name}</p>}
            <p className="text-gray-500 mb-2">{client?.address || "Endereço não informado"}</p>
            
            <div className="space-y-0.5 text-[11px] text-gray-500">
              <p>NUIT: <strong className="text-gray-800">{client?.nuit || "—"}</strong></p>
              {client?.phone && <p>Phone: <strong className="text-gray-800">{client.phone}</strong></p>}
              {client?.email && <p>E-mail: <strong className="text-gray-800">{client.email}</strong></p>}
            </div>
          </div>

          {/* Invoice Numbers & Details */}
          <div className="space-y-1.5 text-right flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Invoice No</span>
                <span className="font-bold text-gray-900">:{documentData.number || "0000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Invoice Date</span>
                <span className="font-semibold text-gray-900">:{documentData.date}</span>
              </div>
              {documentData.reference_invoice && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Ref. Doc</span>
                  <span className="text-gray-900">:{documentData.reference_invoice}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-800">{company?.bank_name || "Transferência / Depósito"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account ID</span>
                <span className="font-medium text-gray-800">{company?.bank_account || company?.nuit || "—"}</span>
              </div>
              {company?.bank_iban && (
                <div className="flex justify-between">
                  <span className="text-gray-400">IBAN / NIB</span>
                  <span className="font-medium text-gray-800">{company.bank_iban}</span>
                </div>
              )}
            </div>
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
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">DESCRIPTION</th>
                <th className="py-3 px-2 text-center w-16">UN.</th>
                {showFinancials && (
                  <th className="py-3 px-3 text-right w-28">PRICE</th>
                )}
                <th className="py-3 px-3 text-center w-20">QUANTITY</th>
                {showFinancials && (
                  <>
                    <th className="py-3 px-3 text-right w-24">DESC.</th>
                    <th className="py-3 px-3 text-right w-32">AMOUNT</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={showFinancials ? 7 : 4} className="py-8 text-center text-gray-400 italic">
                    Sem itens para apresentar
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
                    {showFinancials && (
                      <td className="py-3 px-3 text-right text-gray-600">{MT(price)}</td>
                    )}
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{qty}</td>
                    {showFinancials && (
                      <>
                        <td className="py-3 px-3 text-right text-gray-500">{lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"}</td>
                        <td className="py-3 px-3 text-right font-black text-gray-900">{MT(lineTotal)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* --- TOTAL DUE & SUMMARY BREAKDOWN --- */}
          <div className="flex justify-between items-start mt-8 gap-8">
            {/* Left Column: Prominent Total Due Display */}
            {showFinancials && (
              <div className="w-64 pt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Due</span>
                <p className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                  {MT(calculations.total)}
                </p>
                <div className="w-48 h-0.5 bg-gray-900 mb-2" />
                <p className="text-[10px] text-gray-400 italic">
                  Documento processado por computador com validade legal.
                </p>
              </div>
            )}

            {/* Right Column: Detailed Breakdown Table */}
            {showFinancials && (
              <div className="w-64 text-xs space-y-2">
                <div className="flex justify-between py-1 text-gray-500 font-medium">
                  <span>Sub Total</span>
                  <span className="font-bold text-gray-800">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-red-500 font-medium">
                    <span>Desconto</span>
                    <span>-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between py-1 text-gray-500 font-medium">
                    <span>Tax ({ivaRate}%)</span>
                    <span className="font-bold text-gray-800">{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between py-1 text-gray-500 font-medium">
                    <span>ISPC ({ispcRate}%)</span>
                    <span className="font-bold text-gray-800">{MT(calculations.totalIspc)}</span>
                  </div>
                )}
                {/* Solid Dark Total Box */}
                <div 
                  className="flex justify-between py-2.5 px-4 rounded text-white font-black text-sm tracking-wide shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="uppercase tracking-widest text-xs">TOTAL</span>
                  <span>{MT(calculations.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Terms & Signature Section */}
          <div className="flex justify-between items-end mt-10 pt-6 border-t border-gray-100">
            <div className="max-w-sm space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-900 block">Terms & Conditions</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {documentData.observations || "O pagamento deverá ser efetuado de acordo com as condições combinadas. Agradecemos a confiança depositada."}
              </p>
              <div className="pt-2">
                <StampGenerator company={company} date={documentData.date} />
              </div>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-gray-300 pb-1 mb-1 min-h-[35px] flex items-end justify-center">
                {company?.signature_url ? (
                  <img src={company.signature_url} alt="Assinatura" className="h-10 object-contain" />
                ) : (
                  <span className="text-[11px] text-gray-300 italic font-serif">Kazuma J.</span>
                )}
              </div>
              <p className="font-bold text-xs text-gray-900">{company?.name || "Responsável"}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Diretor Comercial</p>
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
              <p className="text-[9px] text-gray-400">Atendimento Geral</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-gray-200 pl-6">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate">{company?.address || "Maputo, Moçambique"}</p>
              <p className="text-[9px] text-gray-400">Escritório Central</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-gray-200 pl-6">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <Mail className="h-3.5 w-3.5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate">{company?.email || "info@empresa.com"}</p>
              <p className="text-[9px] text-gray-400">{company?.website || "Website Oficial"}</p>
            </div>
          </div>
        </div>

        {/* Solid bottom colored bar */}
        <div className="h-3.5 w-full" style={{ backgroundColor: primaryColor }} />
      </div>
    </div>
  );
}
