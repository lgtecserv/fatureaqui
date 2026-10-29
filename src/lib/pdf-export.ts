import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// @ts-ignore
import domtoimage from "dom-to-image-more";

/**
 * Utilitário robusto para exportar elemento HTML como PDF de alta qualidade.
 * Funciona tanto em telas mobile/tablet quanto em computadores desktop.
 */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<boolean> {
  if (!element) {
    throw new Error("Elemento para geração de PDF não encontrado.");
  }

  // Garantir que imagens dentro do elemento tenham carregamento concluído
  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true); // Não travar se a imagem falhar
      });
    })
  );

  let imgDataUrl: string | null = null;

  // Tentativa 1: html2canvas (suporta CORS e não quebra com @font-face do Google Fonts)
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 794,
    });
    imgDataUrl = canvas.toDataURL("image/png");
  } catch (canvasErr) {
    console.warn("html2canvas falhou, tentando fallback com dom-to-image:", canvasErr);
    
    // Tentativa 2: dom-to-image-more
    try {
      imgDataUrl = await domtoimage.toPng(element, {
        quality: 0.98,
        bgcolor: "#ffffff",
        scale: 2,
      });
    } catch (domErr) {
      console.error("Ambos os métodos de captura falharam:", domErr);
      throw new Error("Não foi possível renderizar a fatura para imagem.");
    }
  }

  if (!imgDataUrl || imgDataUrl === "data:,") {
    throw new Error("A imagem gerada da fatura está vazia.");
  }

  // Montar PDF A4 perfeito
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgDataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);

  return true;
}

/**
 * Imprime o elemento diretamente via janela temporária/iframe sem fechar a tela atual.
 */
export function printInvoiceElement(element: HTMLElement, title: string = "Fatura"): void {
  if (!element) return;

  const printWindow = window.open("", "_blank", "width=850,height=1150");
  if (!printWindow) {
    // Se o popup for bloqueado, usa print nativo
    window.print();
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-wrapper {
            width: 794px;
            margin: 0 auto;
            background: white;
          }
        </style>
      </head>
      <body>
        <div class="invoice-wrapper">
          ${element.outerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 300);
          };
        <\/script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
