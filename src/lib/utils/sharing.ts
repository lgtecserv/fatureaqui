// ============================================================
// FatureAqui — Sharing Utilities (WhatsApp + Email)
// ============================================================

/**
 * Share document via WhatsApp
 * Opens wa.me with a pre-filled message
 */
export function shareViaWhatsApp(
  phone: string,
  documentNumber: string,
  total: string,
  companyName: string
): void {
  const message = encodeURIComponent(
    `Olá! Segue o documento ${documentNumber} no valor de ${total}, emitido por ${companyName}. Obrigado!`
  );

  // Clean phone number
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone}`;

  window.open(`https://wa.me/${fullPhone}?text=${message}`, '_blank');
}

/**
 * Share document via WhatsApp without specific number
 */
export function shareViaWhatsAppGeneric(
  documentNumber: string,
  total: string,
  companyName: string
): void {
  const message = encodeURIComponent(
    `Olá! Segue o documento ${documentNumber} no valor de ${total}, emitido por ${companyName}. Obrigado!`
  );

  window.open(`https://wa.me/?text=${message}`, '_blank');
}

/**
 * Share document via Email (mailto link)
 */
export function shareViaEmail(
  email: string,
  documentNumber: string,
  total: string,
  companyName: string
): void {
  const subject = encodeURIComponent(`Documento ${documentNumber} - ${companyName}`);
  const body = encodeURIComponent(
    `Prezado(a),\n\nSegue em anexo o documento ${documentNumber} no valor de ${total}.\n\nEmitido por: ${companyName}\n\nObrigado!`
  );

  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
}
