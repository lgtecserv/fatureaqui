import type { DocumentType } from "@/types";

export type InvoiceLanguage = "pt" | "en" | "zh" | "es";

export interface InvoiceTranslations {
  documentTypes: Record<DocumentType, string>;
  labels: {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    referenceDoc: string;
    invoiceTo: string;
    clientName: string;
    clientAddress: string;
    clientNuit: string;
    clientPhone: string;
    clientEmail: string;
    // Table
    itemNumber: string;
    description: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    discount: string;
    total: string;
    noItems: string;
    // Summary
    subtotal: string;
    totalDiscount: string;
    vat: string;
    ispc: string;
    totalToPay: string;
    // Payment
    paymentInfo: string;
    bank: string;
    accountNumber: string;
    nibIban: string;
    accountHolder: string;
    mpesa: string;
    emola: string;
    paymentMethods: string;
    // Transport
    transportOrigin: string;
    transportDestination: string;
    driver: string;
    vehiclePlate: string;
    // Footer / Legal
    termsAndConditions: string;
    defaultTerms: string;
    thanksForBusiness: string;
    authorisedSignature: string;
    softwareCertification: string;
  };
}

export const INVOICE_DICTIONARY: Record<InvoiceLanguage, InvoiceTranslations> = {
  pt: {
    documentTypes: {
      FT: "FATURA",
      VD: "VENDA A DINHEIRO",
      RC: "RECIBO",
      NC: "NOTA DE CRÉDITO",
      ND: "NOTA DE DÉBITO",
      CT: "COTAÇÃO / PROFORMA",
      GR: "GUIA DE REMESSA",
    },
    labels: {
      invoiceNumber: "Nº Documento:",
      date: "Data de Emissão:",
      dueDate: "Data de Vencimento:",
      referenceDoc: "Doc. de Referência:",
      invoiceTo: "Faturado a:",
      clientName: "Nome do Cliente",
      clientAddress: "Endereço do Cliente",
      clientNuit: "NUIT:",
      clientPhone: "Tel:",
      clientEmail: "Email:",
      itemNumber: "No",
      description: "Descrição do Artigo / Serviço",
      unit: "Un.",
      quantity: "Qtd.",
      unitPrice: "Preço Unit.",
      discount: "Desc.",
      total: "Total",
      noItems: "Nenhum artigo adicionado",
      subtotal: "Subtotal",
      totalDiscount: "Desconto Total",
      vat: "IVA",
      ispc: "ISPC",
      totalToPay: "Total a Pagar",
      paymentInfo: "Coordenadas de Pagamento",
      bank: "Banco:",
      accountNumber: "Nº da Conta:",
      nibIban: "NIB / IBAN:",
      accountHolder: "Titular:",
      mpesa: "M-Pesa (Vodacom):",
      emola: "e-Mola (Movitel):",
      paymentMethods: "Transferência Bancária / Pagamento Móvel",
      transportOrigin: "Local de Carga:",
      transportDestination: "Local de Descarga:",
      driver: "Motorista:",
      vehiclePlate: "Matrícula:",
      termsAndConditions: "Observações / Termos & Condições",
      defaultTerms: "Documento emitido ao abrigo da legislação fiscal em vigor. Obrigado pela preferência.",
      thanksForBusiness: "OBRIGADO PELA PREFERÊNCIA",
      authorisedSignature: "Assinatura Autorizada",
      softwareCertification: "Processado por programa certificado nº 01/AT/2026",
    },
  },
  en: {
    documentTypes: {
      FT: "TAX INVOICE",
      VD: "CASH SALE",
      RC: "OFFICIAL RECEIPT",
      NC: "CREDIT NOTE",
      ND: "DEBIT NOTE",
      CT: "QUOTATION / PROFORMA",
      GR: "DELIVERY NOTE",
    },
    labels: {
      invoiceNumber: "Invoice No:",
      date: "Issue Date:",
      dueDate: "Due Date:",
      referenceDoc: "Reference Doc:",
      invoiceTo: "Invoice To:",
      clientName: "Customer Name",
      clientAddress: "Customer Address",
      clientNuit: "Tax ID / NUIT:",
      clientPhone: "Phone:",
      clientEmail: "Email:",
      itemNumber: "No",
      description: "Item / Service Description",
      unit: "Unit",
      quantity: "Qty",
      unitPrice: "Unit Price",
      discount: "Disc.",
      total: "Total",
      noItems: "No items added",
      subtotal: "Subtotal",
      totalDiscount: "Total Discount",
      vat: "VAT",
      ispc: "ISPC",
      totalToPay: "Total Due",
      paymentInfo: "Payment Coordinates",
      bank: "Bank:",
      accountNumber: "Account No:",
      nibIban: "IBAN / SWIFT:",
      accountHolder: "Account Name:",
      mpesa: "M-Pesa (Vodacom):",
      emola: "e-Mola (Movitel):",
      paymentMethods: "Bank Transfer / Mobile Money",
      transportOrigin: "Loading Location:",
      transportDestination: "Delivery Location:",
      driver: "Driver:",
      vehiclePlate: "Vehicle Plate:",
      termsAndConditions: "Terms & Conditions / Notes",
      defaultTerms: "Document processed in compliance with prevailing fiscal legislation. Thank you for your business.",
      thanksForBusiness: "THANKS FOR YOUR BUSINESS",
      authorisedSignature: "Authorised Signature",
      softwareCertification: "Processed by certified billing software nº 01/AT/2026",
    },
  },
  zh: {
    documentTypes: {
      FT: "正式发票",
      VD: "现金销售单",
      RC: "收据",
      NC: "贷记凭单",
      ND: "借记凭单",
      CT: "报价单 / 形式发票",
      GR: "发货单 / 运送凭单",
    },
    labels: {
      invoiceNumber: "发票号码:",
      date: "开票日期:",
      dueDate: "付款截止日:",
      referenceDoc: "关联单据:",
      invoiceTo: "客户信息:",
      clientName: "客户姓名 / 公司名",
      clientAddress: "客户地址",
      clientNuit: "税号 (NUIT):",
      clientPhone: "联系电话:",
      clientEmail: "电子邮箱:",
      itemNumber: "序号",
      description: "商品或服务描述",
      unit: "单位",
      quantity: "数量",
      unitPrice: "单价",
      discount: "折扣",
      total: "金额",
      noItems: "暂无明细项目",
      subtotal: "小计",
      totalDiscount: "折扣总额",
      vat: "增值税 (IVA)",
      ispc: "简易税 (ISPC)",
      totalToPay: "应付总额",
      paymentInfo: "付款账号信息",
      bank: "开户银行:",
      accountNumber: "银行账号:",
      nibIban: "国际汇款号 (IBAN):",
      accountHolder: "账户名称:",
      mpesa: "M-Pesa 移动支付:",
      emola: "e-Mola 移动支付:",
      paymentMethods: "银行转账 / 移动电子支付",
      transportOrigin: "起运地:",
      transportDestination: "目的地:",
      driver: "司机姓名:",
      vehiclePlate: "车牌号:",
      termsAndConditions: "条款与说明 / 备注",
      defaultTerms: "本单据根据现行商业税收法规生成。感谢惠顾！",
      thanksForBusiness: "感谢您的光临与合作",
      authorisedSignature: "授权签署 / 盖章",
      softwareCertification: "通过官方认证税务开票软件生成 nº 01/AT/2026",
    },
  },
  es: {
    documentTypes: {
      FT: "FACTURA",
      VD: "VENTA AL CONTADO",
      RC: "RECIBO OFICIAL",
      NC: "NOTA DE CRÉDITO",
      ND: "NOTA DE DÉBITO",
      CT: "COTIZACIÓN / PROFORMA",
      GR: "GUÍA DE REMISIÓN",
    },
    labels: {
      invoiceNumber: "Nº Factura:",
      date: "Fecha de Emisión:",
      dueDate: "Fecha de Vencimiento:",
      referenceDoc: "Doc. de Referencia:",
      invoiceTo: "Facturado a:",
      clientName: "Nombre del Cliente",
      clientAddress: "Dirección del Cliente",
      clientNuit: "NIF / NUIT:",
      clientPhone: "Teléfono:",
      clientEmail: "Correo:",
      itemNumber: "No",
      description: "Descripción del Artículo / Servicio",
      unit: "Unid.",
      quantity: "Cant.",
      unitPrice: "Precio Unit.",
      discount: "Desc.",
      total: "Total",
      noItems: "Sin artículos",
      subtotal: "Subtotal",
      totalDiscount: "Descuento Total",
      vat: "IVA",
      ispc: "ISPC",
      totalToPay: "Total a Pagar",
      paymentInfo: "Coordenadas de Pago",
      bank: "Banco:",
      accountNumber: "Nº de Cuenta:",
      nibIban: "NIB / IBAN:",
      accountHolder: "Titular:",
      mpesa: "M-Pesa (Vodacom):",
      emola: "e-Mola (Movitel):",
      paymentMethods: "Transferencia Bancaria / Pago Móvil",
      transportOrigin: "Lugar de Carga:",
      transportDestination: "Lugar de Descarga:",
      driver: "Conductor:",
      vehiclePlate: "Matrícula:",
      termsAndConditions: "Observaciones / Términos & Condiciones",
      defaultTerms: "Documento emitido conforme a la legislación fiscal vigente. Gracias por su preferencia.",
      thanksForBusiness: "GRACIAS POR SU PREFERENCIA",
      authorisedSignature: "Firma Autorizada",
      softwareCertification: "Procesado por software certificado nº 01/AT/2026",
    },
  },
};

export function getInvoiceTranslations(lang: InvoiceLanguage = "pt"): InvoiceTranslations {
  return INVOICE_DICTIONARY[lang] || INVOICE_DICTIONARY.pt;
}
