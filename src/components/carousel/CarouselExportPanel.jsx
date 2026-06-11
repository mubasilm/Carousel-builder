import { useRef, useState } from "react";
import CarouselSlide from "./CarouselSlide";
import { exportSlidesToPdf, exportSlidesToPngZip } from "@/lib/export-carousel";

export default function CarouselExportPanel({ project, slides, onExported }) {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const getExportElements = () => {
    if (!exportRef.current) return [];
    return Array.from(exportRef.current.querySelectorAll("[data-slide-export]"));
  };

  const handlePdf = async () => {
    setExporting(true);
    setError("");
    try {
      const elements = getExportElements();
      if (!elements.length) throw new Error("No slides to export");
      const safeName = (project.title || "linkedin-carousel").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
      await exportSlidesToPdf(elements, `${safeName}.pdf`);
      onExported?.();
    } catch (err) {
      setError(err.message || "PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleZip = async () => {
    setExporting(true);
    setError("");
    try {
      const elements = getExportElements();
      if (!elements.length) throw new Error("No slides to export");
      const safeName = (project.title || "linkedin-carousel").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
      await exportSlidesToPngZip(elements, `${safeName}-slides.zip`);
      onExported?.();
    } catch (err) {
      setError(err.message || "PNG export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-panel">
        <h3 className="text-lg font-semibold text-text">Export carousel</h3>
        <p className="mt-2 text-sm text-muted">
          Download a multi-page PDF (1080×1080 per slide) or a ZIP of individual PNG files, ready for LinkedIn.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handlePdf} disabled={exporting || !slides.length}>
            {exporting ? "Exporting..." : "Download PDF"}
          </button>
          <button type="button" className="btn-secondary" onClick={handleZip} disabled={exporting || !slides.length}>
            {exporting ? "Exporting..." : "Download PNG ZIP"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="card-panel border-dashed bg-page-soft">
        <p className="text-sm font-medium text-muted">Figma import</p>
        <p className="mt-1 text-sm text-muted-light">
          Coming in phase 2 — import slides to Figma for quick design fixes using reference frames.
        </p>
        {project.reference_urls?.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {project.reference_urls.map((url, i) => (
              <li key={i} className="truncate">
                {url}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Off-screen full-size slides for export capture */}
      <div
        ref={exportRef}
        aria-hidden
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          pointerEvents: "none",
        }}
      >
        {slides.map((slide, i) => (
          <CarouselSlide
            key={slide.index ?? i}
            slide={slide}
            slideIndex={i + 1}
            totalSlides={slides.length}
            forExport
          />
        ))}
      </div>
    </div>
  );
}
