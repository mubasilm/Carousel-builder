import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { SLIDE_SIZE } from "@/lib/slide-constants";
import { detectSlideOverflow } from "@/lib/slide-content-budget";

async function waitForFonts() {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
}

export async function validateSlidesBeforeExport(slideElements) {
  const warnings = [];
  slideElements.forEach((el, i) => {
    if (detectSlideOverflow(el)) {
      warnings.push(`Slide ${i + 1} content may be clipped — shorten copy before export.`);
    }
  });
  return warnings;
}

export async function captureSlideElement(element) {
  await waitForFonts();
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f8f6ed",
    width: SLIDE_SIZE,
    height: SLIDE_SIZE,
    windowWidth: SLIDE_SIZE,
    windowHeight: SLIDE_SIZE,
  });
}

export async function exportSlidesToPdf(slideElements, filename = "linkedin-carousel.pdf") {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [SLIDE_SIZE, SLIDE_SIZE],
    compress: true,
  });

  for (let i = 0; i < slideElements.length; i++) {
    const canvas = await captureSlideElement(slideElements[i]);
    const imgData = canvas.toDataURL("image/png", 1.0);
    if (i > 0) pdf.addPage([SLIDE_SIZE, SLIDE_SIZE]);
    pdf.addImage(imgData, "PNG", 0, 0, SLIDE_SIZE, SLIDE_SIZE);
  }

  pdf.save(filename);
}

export async function exportSlidesToPngZip(slideElements, filename = "linkedin-carousel-slides.zip") {
  const zip = new JSZip();

  for (let i = 0; i < slideElements.length; i++) {
    const canvas = await captureSlideElement(slideElements[i]);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1.0));
    zip.file(`slide-${String(i + 1).padStart(2, "0")}.png`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
