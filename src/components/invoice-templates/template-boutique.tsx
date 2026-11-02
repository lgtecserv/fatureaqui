import { MT } from "@/lib/format";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { StampGenerator } from "@/components/stamp-generator";
import { QrCode } from "lucide-react";
import type { TemplateProps } from "./types";

export function TemplateBoutique({
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
  const primaryColor = company?.primary_color || "#1E3A8A"; // Deep Navy or company color
  const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "FATURA";
  const showFinancials = documentData.type !== "GR";

  return (
    <div 
      id={id} 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[13px] text-gray-800 shadow-2xl border border-gray-100 flex flex-col justify-between p-12" 
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="flex-1 flex flex-col">
        {/* --- TOP HEADER (Huge FATURA title on left, circular logo on right) --- */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 
              className="text-5xl font-black uppercase tracking-tight mb-3"
              style={{ color: primaryColor }}
            >
              {docTypeName}
            </h1>
            <div className="text-gray-700 text-xs space-y-0.5">
              {!company?.logo_url && (
                <p className="font-bold text-sm text-gray-900">{company?.name || "Empresa Lda"}</p>
              )}
              <p>{company?.address || "Endereço da Empresa"}</p>
              <p>NUIT: <strong>{company?.nuit || "000000000"}</strong> | Tel: {company?.phone || "+258 00 000 0000"}</p>
              <p>{company?.email || "contacto@empresa.com"}</p>
            </div>
          </div>

          {/* Circular Logo Container (Exact Image 4 Style) */}
          <div>
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company?.name} 
                crossOrigin="anonymous"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 shadow-sm" 
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-400/90 text-white flex items-center justify-center font-bold text-xs uppercase tracking-widest shadow-sm">
                LOGO
              </div>
            )}
          </div>
        </div>

        {/* --- 4-COLUMN ENTITY & METADATA BAR (Exact Image 4 Style) --- */}
        <div className="grid grid-cols-4 gap-6 mb-8 text-xs border-t border-gray-100 pt-6">
          {/* COBRAR A */}
          <div>
            <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-1.5">
              COBRAR A
            </span>
            <p className="font-bold text-gray-900">{client?.name || "Cliente Final"}</p>
            <p className="text-gray-600">{client?.address || "Endereço"}</p>
            <p className="text-gray-600">NUIT: {client?.nuit || "—"}</p>
          </div>

          {/* ENVIAR PARA */}
          <div>
            <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-1.5">
              ENVIAR PARA
            </span>
            <p className="font-bold text-gray-900">{client?.company_name || client?.name || "—"}</p>
            <p className="text-gray-600">{client?.address || "—"}</p>
            {client?.phone && <p className="text-gray-600">Tel: {client.phone}</p>}
          </div>

          {/* FATURA # / DATA */}
          <div>
            <div className="mb-2">
              <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-0.5">
                {documentData.type} #
              </span>
              <p className="font-bold text-gray-800">{documentData.number || "0000"}</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-0.5">
                DATA DA FATURA
              </span>
              <p className="text-gray-700">{documentData.date}</p>
            </div>
          </div>

          {/* REFERENCIA / VENCIMENTO */}
          <div>
            {documentData.reference_invoice && (
              <div className="mb-2">
                <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-0.5">
                  REF. ORIGINAL
                </span>
                <p className="font-semibold text-gray-800">{documentData.reference_invoice}</p>
              </div>
            )}
            <div>
              <span className="font-extrabold uppercase text-[11px] text-gray-900 tracking-wider block mb-0.5">
                P.O. / REGISTO
              </span>
              <p className="text-gray-700">{documentData.reference_date || "À Vista"}</p>
            </div>
          </div>
        </div>

        {/* --- SWISS MINIMALIST TABLE (No vertical lines, colored border rules) --- */}
        <div className="flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-[11px] font-extrabold uppercase tracking-wider text-gray-900"
                style={{ borderTop: `2px solid ${primaryColor}`, borderBottom: `2px solid ${primaryColor}` }}
              >
                <th className="py-3 px-2 w-16 text-center">QTD</th>
                <th className="py-3 px-4">DESCRIÇÃO</th>
                <th className="py-3 px-2 text-center w-16">UN.</th>
                {showFinancials && (
                  <>
                    <th className="py-3 px-4 text-right w-32">PREÇO POR UNIDADE</th>
                    <th className="py-3 px-3 text-right w-24">DESC.</th>
                    <th className="py-3 px-4 text-right w-32">VALOR</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={showFinancials ? 6 : 3} className="py-8 text-center text-gray-400 italic">
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
                  <tr 
                    key={item.id || index}
                    className="border-b border-gray-100 text-xs"
                  >
                    <td className="py-3.5 px-2 text-center font-bold text-gray-900">{qty}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {item.description || <span className="text-gray-300 italic">Sem descrição...</span>}
                    </td>
                    <td className="py-3.5 px-2 text-center uppercase text-gray-500 font-semibold">{item.unit || "un"}</td>
                    {showFinancials && (
                      <>
                        <td className="py-3.5 px-4 text-right text-gray-700">{MT(price)}</td>
                        <td className="py-3.5 px-3 text-right text-gray-500">{lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-gray-900">{MT(lineTotal)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* --- RIGHT-ALIGNED FINANCIAL TOTALS (Exact Image 4 Style) --- */}
          {showFinancials && (
            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">{MT(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span>Desconto</span>
                    <span>-{MT(calculations.totalDiscount)}</span>
                  </div>
                )}
                {hasIva && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span className="font-medium">IVA {ivaRate.toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{MT(calculations.totalIva)}</span>
                  </div>
                )}
                {hasIspc && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span className="font-medium">ISPC {ispcRate.toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{MT(calculations.totalIspc)}</span>
                  </div>
                )}
                <div 
                  className="flex justify-between py-2.5 border-t border-gray-900 text-base font-black"
                  style={{ color: primaryColor }}
                >
                  <span className="uppercase tracking-wider">TOTAL</span>
                  <span className="text-xl">{MT(calculations.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* --- CALLIGRAPHY "OBRIGADO" + SIGNATURE + TERMS (Exact Image 4 Style) --- */}
          <div className="flex justify-between items-end mt-12 pt-6">
            {/* Left side: Script Obrigado + Terms */}
            <div className="flex items-start gap-8">
              {/* Calligraphy word: Obrigado */}
              <div 
                className="text-5xl font-normal select-none italic"
                style={{ 
                  fontFamily: "'Brush Script MT', 'Dancing Script', 'Segoe Script', cursive",
                  color: primaryColor,
                  lineHeight: "1"
                }}
              >
                Obrigado
              </div>

              {/* Vertical divider + Terms and Bank details */}
              <div className="border-l-2 border-red-500 pl-4 space-y-1 text-xs">
                <span className="font-black text-[11px] uppercase tracking-wider text-red-600 block">
                  TERMOS E CONDIÇÕES
                </span>
                <p className="text-gray-600 text-[11px] max-w-xs leading-relaxed">
                  {documentData.observations || "O pagamento é devido no prazo acordado."}
                </p>
                {(company?.bank_name || company?.bank_account || company?.bank_iban || company?.mpesa_number || company?.emola_number) && (
                  <div className="text-[10px] text-gray-700 pt-1 font-medium space-y-0.5">
                    {company.bank_name && <p>Banco: <strong>{company.bank_name}</strong></p>}
                    {company.bank_account && <p>Conta: <strong>{company.bank_account}</strong></p>}
                    {company.bank_iban && <p>IBAN/NIB: <strong>{company.bank_iban}</strong></p>}
                    {company.mpesa_number && <p><span className="text-red-600 font-bold">M-Pesa:</span> <strong>{company.mpesa_number}</strong></p>}
                    {company.emola_number && <p><span className="text-orange-600 font-bold">e-Mola:</span> <strong>{company.emola_number}</strong></p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Stamp & Handwritten Signature */}
            <div className="flex items-end gap-6">
              <StampGenerator company={company} className="h-28 w-28" />
              <div className="text-center w-40">
                <div className="min-h-[45px] flex items-end justify-center pb-1">
                  {company?.signature_url ? (
                    <img src={company.signature_url} alt="Assinatura" className="h-12 object-contain" />
                  ) : (
                    <span 
                      className="text-3xl text-gray-800 italic" 
                      style={{ fontFamily: "'Brush Script MT', cursive" }}
                    >
                      {company?.name?.split(' ')[0] || "BPoulos"}
                    </span>
                  )}
                </div>
                <div className="w-full h-0.5 bg-gray-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mt-1 block">
                  Assinatura Autorizada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
