import { useRef, useState } from "react";
import CarouselPreview from "./CarouselPreview";
import CarouselSlide from "./CarouselSlide";
import { exportSlidesToPdf, exportSlidesToPngZip, validateSlidesBeforeExport } from "@/lib/export-carousel";

export default function CarouselExportPanel({
  project,
  slides,
  themeId,
  visualArchetype = "editorial_memo",
  logoPlacement = "bottom_left",
  ctaSentence = "",
  ctaButton = "",
  onExported,
}) {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);

  const getExportElements = () => {
    if (!exportRef.current) return [];
    return Array.from(exportRef.current.querySelectorAll("[data-slide-export]"));
  };

  const runExport = async (fn) => {
    setExporting(true);
    setError("");
    setWarnings([]);
    try {
      const elements = getExportElements();
      if (!elements.length) throw new Error("No slides to export");
      const overflowWarnings = await validateSlidesBeforeExport(elements);
      if (overflowWarnings.length) setWarnings(overflowWarnings);
      const safeName = (project.title || "linkedin-carousel").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
      await fn(elements, safeName);
      onExported?.();
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handlePdf = () =>
    runExport(async (elements, safeName) => {
      await exportSlidesToPdf(elements, `${safeName}.pdf`);
    });

  const handleZip = () =>
    runExport(async (elements, safeName) => {
      await exportSlidesToPngZip(elements, `${safeName}-slides.zip`);
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Final carousel preview</h2>
        <p className="mt-1 text-sm text-muted">Review every slide before downloading. This matches your PDF and PNG export.</p>
      </div>

      <CarouselPreview
        slides={slides}
        themeId={themeId}
        visualArchetype={visualArchetype}
        logoPlacement={logoPlacement}
        ctaSentence={ctaSentence}
        ctaButton={ctaButton}
        readOnly
        centered
      />

      <div className="card-panel">
        <h3 className="text-base font-semibold text-text">Download</h3>
        <p className="mt-1 text-sm text-muted">
          Multi-page PDF (1200×1200 per slide) or ZIP of individual PNG files for LinkedIn.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handlePdf} disabled={exporting || !slides.length}>
            {exporting ? "Exporting..." : "Download PDF"}
          </button>
          <button type="button" className="btn-secondary" onClick={handleZip} disabled={exporting || !slides.length}>
            {exporting ? "Exporting..." : "Download PNG ZIP"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {warnings.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-amber-800">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
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
            themeId={themeId}
            visualArchetype={visualArchetype}
            logoPlacement={logoPlacement}
            ctaSentence={ctaSentence}
            ctaButton={ctaButton}
            forExport
          />
        ))}
      </div>
    </div>
  );
}
