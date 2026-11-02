import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// @ts-ignore
import domtoimage from "dom-to-image-more";

/**
 * Utilitário ultrarrápido e robusto para exportar elemento HTML como PDF em alta resolução.
 * Otimizado para geração em < 1 segundo, com suporte a cores modernas e saída A4 perfeita.
 */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<boolean> {
  if (!element) {
    throw new Error("Elemento para geração de PDF não encontrado.");
  }

  // Garantir que imagens internas estejam carregadas
  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      });
    })
  );

  let imgDataUrl: string | null = null;

  // Tentativa 1: dom-to-image-more com toJpeg (altíssima velocidade, suporte nativo a oklch e fontes SVG)
  try {
    imgDataUrl = await domtoimage.toJpeg(element, {
      quality: 0.95,
      bgcolor: "#ffffff",
      width: 794,
      height: 1123,
      style: {
        transform: "none",
        margin: "0",
        padding: "0",
      },
    });
  } catch (domErr) {
    console.warn("dom-to-image falhou, tentando fallback com html2canvas:", domErr);
    
    // Tentativa 2: html2canvas com onclone defensivo para converter cores não suportadas
    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        onclone: (clonedDoc) => {
          // Remover variáveis com oklch no clone para evitar exceções do html2canvas
          const cloneRoot = clonedDoc.documentElement;
          if (cloneRoot) {
            cloneRoot.style.setProperty("--primary", "#02664D");
            cloneRoot.style.setProperty("--background", "#ffffff");
            cloneRoot.style.setProperty("--foreground", "#111827");
          }
        },
      });
      imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    } catch (canvasErr) {
      console.error("Ambos os métodos de captura falharam:", canvasErr);
      throw new Error("Não foi possível renderizar a fatura para imagem.");
    }
  }

  if (!imgDataUrl || imgDataUrl === "data:," || imgDataUrl.length < 100) {
    throw new Error("A imagem gerada da fatura está vazia.");
  }

  // Montar PDF A4 de forma ultrarrápida (JPEG + compressão FAST)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // "FAST" com "JPEG" adiciona o stream DCT diretamente no PDF em ~15ms
  pdf.addImage(imgDataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
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
          #print-container {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="print-container">
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
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
