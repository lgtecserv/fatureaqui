import { MT } from "@/lib/format";
import type { Company, DocumentType, DocumentItemFormState } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { StampGenerator } from "@/components/stamp-generator";
import { QrCode } from "lucide-react";

interface DocumentPreviewProps {
  company: Company | null;
  client: any;
  documentData: {
    type: DocumentType;
    date: string;
    reference_invoice?: string;
    reference_date?: string;
    reason?: string;
    origin?: string;
    destination?: string;
    driver?: string;
    vehicle_plate?: string;
    observations?: string;
    number?: string;
  };
  items: DocumentItemFormState[];
  calculations: {
    subtotal: number;
    totalDiscount: number;
    totalIva: number;
    totalIspc: number;
    total: number;
  };
  hasIva?: boolean;
  ivaRate: number;
  hasIspc?: boolean;
  ispcRate?: number;
}

export function DocumentPreview({
  company,
  client,
  documentData,
  items,
  calculations,
  hasIva = true,
  ivaRate,
  hasIspc = false,
  ispcRate = 3,
}: DocumentPreviewProps) {
  const primaryColor = company?.primary_color || "#02664D";
  const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "Documento";
  const showFinancials = documentData.type !== "GR";

  return (
    <div 
      id="pdf-content" 
      className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[13px] text-gray-800 shadow-2xl border border-gray-100" 
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
      <div className="relative z-10 p-10 flex flex-col min-h-[1123px]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 z-10 relative px-4 mt-8">
          {/* Company Info */}
          <div className="flex flex-col max-w-[55%] break-words">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company?.name} className="h-20 mb-4 object-contain max-w-full" />
            ) : (
              <div 
                className="h-16 w-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-4 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {company?.name?.charAt(0) || "L"}
              </div>
            )}
            <h1 className="font-extrabold text-lg tracking-tight text-gray-900">{company?.name || "Sua Empresa, Lda"}</h1>
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
                <span className="text-gray-500 font-medium">Nº Doc:</span>
                <span className="font-bold text-gray-900">{documentData.number || "Em proc..."}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-gray-500 font-medium">Data:</span>
                <span className="font-bold text-gray-900">{documentData.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entities Info */}
        <div className="flex justify-between items-stretch mb-8 gap-6">
          {/* Client Box */}
          <div className="flex-1 rounded-xl p-5 border-l-4 bg-gray-50/80" style={{ borderLeftColor: primaryColor }}>
            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">Faturado A</h3>
            <p className="font-bold text-base text-gray-900 mb-1">{client?.name || "Nome do Cliente"}</p>
            {client?.company_name && <p className="text-gray-700 font-medium text-sm mb-1">{client.company_name}</p>}
            <p className="text-gray-500 mb-1">{client?.address || "Endereço do Cliente"}</p>
            <p className="text-gray-700"><strong className="text-gray-500 font-medium">NUIT:</strong> {client?.nuit || "—"}</p>
          </div>

          {/* Conditional Box */}
          {["RC", "NC", "ND"].includes(documentData.type) && (
            <div className="flex-1 rounded-xl p-5 border border-gray-100 bg-white shadow-sm">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">Referência Original</h3>
              <p className="mb-1"><strong className="text-gray-500 font-medium">Documento:</strong> <span className="font-semibold text-gray-900">{documentData.reference_invoice || "—"}</span></p>
              {documentData.reference_date && <p className="mb-1"><strong className="text-gray-500 font-medium">Data:</strong> {documentData.reference_date}</p>}
              {documentData.reason && <p className="mt-2 text-gray-600"><strong className="text-gray-500 font-medium">Motivo:</strong> {documentData.reason}</p>}
            </div>
          )}

          {documentData.type === "GR" && (
            <div className="flex-1 rounded-xl p-5 border border-gray-100 bg-white shadow-sm">
               <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">Detalhes de Transporte</h3>
               <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                 <p><strong className="text-gray-500 font-medium">Origem:</strong> {documentData.origin || "—"}</p>
                 <p><strong className="text-gray-500 font-medium">Destino:</strong> {documentData.destination || "—"}</p>
                 <p><strong className="text-gray-500 font-medium">Motorista:</strong> {documentData.driver || "—"}</p>
                 <p><strong className="text-gray-500 font-medium">Matrícula:</strong> {documentData.vehicle_plate || "—"}</p>
               </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-grow">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: primaryColor }} className="text-white">
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider w-12 text-center">#</th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Descrição do Artigo/Serviço</th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-center w-20">Qtd.</th>
                  {showFinancials && (
                    <>
                      <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-28">P. Unit.</th>
                      <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-24">Desc.</th>
                      <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-32">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white">
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
                    <tr key={item.id || index} className={`border-b border-gray-100 ${index % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-3 px-4 text-center text-gray-500">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{item.description || <span className="text-gray-300 italic">Item sem descrição...</span>}</td>
                      <td className="py-3 px-4 text-center">{qty}</td>
                      {showFinancials && (
                        <>
                          <td className="py-3 px-4 text-right text-gray-600">{MT(price)}</td>
                          <td className="py-3 px-4 text-right text-gray-500">{lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{MT(lineTotal)}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Financials & Observations */}
          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-8">
            {/* Observations */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 min-h-[100px] w-full">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">Observações / Termos</h3>
              <p className="text-gray-600 text-xs whitespace-pre-wrap leading-relaxed">
                {documentData.observations || "Obrigado pela sua preferência."}
              </p>
            </div>

            {/* Totals */}
            {showFinancials && (
              <div className="w-full md:w-[320px] shrink-0">
                <div className="space-y-3 p-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{MT(calculations.subtotal)}</span>
                  </div>
                  {calculations.totalDiscount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Desconto Total</span>
                      <span className="font-semibold">-{MT(calculations.totalDiscount)}</span>
                    </div>
                  )}
                  {hasIva && (
                    <div className="flex justify-between text-gray-600">
                      <span>IVA ({ivaRate}%)</span>
                      <span className="font-semibold text-gray-900">{MT(calculations.totalIva)}</span>
                    </div>
                  )}
                  {hasIspc && (
                    <div className="flex justify-between text-gray-600">
                      <span>ISPC ({ispcRate}%)</span>
                      <span className="font-semibold text-gray-900">{MT(calculations.totalIspc || 0)}</span>
                    </div>
                  )}
                </div>
                
                {/* Total Pill */}
                <div 
                  className="rounded-xl p-4 flex justify-between items-center text-white mt-2 shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="font-bold uppercase tracking-wider text-xs opacity-90">Total a Pagar</span>
                  <span className="text-xl font-black">{MT(calculations.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- BOTTOM SECTION (QR, STAMP, FOOTER WAVE) --- */}
        <div className="mt-auto pt-16 relative">
          
          {/* Bottom Geometric Accent */}
          <div className="absolute bottom-[-40px] left-[-40px] w-[calc(100%+80px)] h-32 pointer-events-none z-0">
            <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0,100 L800,100 L800,60 C500,100 300,0 0,40 Z" fill={primaryColor} fillOpacity="0.05" />
              <path d="M0,100 L800,100 L800,80 C600,120 400,20 0,60 Z" fill={primaryColor} fillOpacity="0.1" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-end items-end w-full">
            {/* Stamp Area */}
            <div className="flex flex-col items-center">
              {(company as any)?.use_digital_stamp !== false ? (
                <div className="w-32 h-32 opacity-95 relative" style={{ transform: "rotate(-3deg)", top: "10px" }}>
                  <StampGenerator 
                    companyName={company?.name || "SUA EMPRESA"} 
                    companyNuit={company?.nuit || "000000000"} 
                    companyCity={company?.city || "MAPUTO"}
                    companyPhone={company?.phone || "---"}
                    companyAddress={company?.address || ""}
                    color={primaryColor}
                    style={(company as any)?.stamp_style || "style1"}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-end h-32 pb-4">
                  <div className="w-48 border-b border-gray-400 border-dashed mb-2"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Assinatura / Carimbo</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6 relative z-10">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
              Processado por software certificado • FatureAqui.com • Válido sem assinatura original devido a selo digital
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
