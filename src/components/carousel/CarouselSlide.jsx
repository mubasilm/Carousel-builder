const TYPE_LABELS = {
  hook: "Hook",
  problem: "Problem",
  insight: "Insight",
  takeaway: "Takeaway",
  cta: "CTA",
};

const PASTEL_BY_TYPE = {
  hook: "var(--pastel-lavender)",
  problem: "var(--pastel-blush)",
  insight: "var(--pastel-aqua)",
  takeaway: "var(--pastel-butter)",
  cta: "var(--pastel-mint)",
};

export default function CarouselSlide({ slide, slideIndex, totalSlides, forExport = false }) {
  const isHook = slide.type === "hook";
  const isCta = slide.type === "cta";

  const style = forExport
    ? { width: 1080, height: 1080, flexShrink: 0 }
    : { width: "100%", aspectRatio: "1 / 1" };

  return (
    <div
      className="carousel-slide relative overflow-hidden"
      style={{
        ...style,
        background: "var(--page-bg)",
        fontFamily: "var(--font-body)",
      }}
      data-slide-export
    >
      <div
        className="absolute inset-0"
        style={{
          padding: forExport ? 80 : "7.4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: forExport ? 32 : "3%" }}>
            <span
              style={{
                background: "var(--green-soft)",
                color: "var(--green-accent)",
                fontSize: forExport ? 12 : "clamp(10px, 1.1vw, 12px)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {TYPE_LABELS[slide.type] || "Slide"}
            </span>
            <span
              style={{
                color: "var(--muted-light)",
                fontSize: forExport ? 14 : "clamp(12px, 1.2vw, 14px)",
                fontWeight: 500,
              }}
            >
              {slideIndex}/{totalSlides}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: isHook
                ? forExport
                  ? 72
                  : "clamp(28px, 5.5vw, 48px)"
                : forExport
                  ? 56
                  : "clamp(22px, 4vw, 36px)",
              fontWeight: 700,
              lineHeight: isHook ? 1.02 : 1.1,
              letterSpacing: "-0.04em",
              color: "var(--text)",
              margin: 0,
              marginBottom: forExport ? 28 : "4%",
            }}
          >
            {slide.headline}
          </h2>

          {slide.body && (
            <div
              style={{
                background: PASTEL_BY_TYPE[slide.type] || "var(--surface-warm)",
                borderRadius: forExport ? 16 : 12,
                padding: forExport ? "28px 32px" : "4% 5%",
                marginTop: forExport ? 0 : "2%",
              }}
            >
              <p
                style={{
                  fontSize: forExport ? 32 : "clamp(14px, 2.2vw, 18px)",
                  lineHeight: 1.45,
                  color: "var(--text-soft)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {slide.body}
              </p>
            </div>
          )}

          {slide.footnote && (
            <p
              style={{
                marginTop: forExport ? 20 : "3%",
                fontSize: forExport ? 18 : "clamp(11px, 1.4vw, 14px)",
                color: "var(--muted)",
              }}
            >
              {slide.footnote}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: forExport ? 24 : "4%" }}>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: forExport ? 36 : 24,
                height: forExport ? 36 : 24,
                borderRadius: 8,
                background: "var(--green-800)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: forExport ? 14 : 10,
                fontWeight: 700,
              }}
            >
              G
            </div>
            <span
              style={{
                fontSize: forExport ? 16 : "clamp(11px, 1.2vw, 13px)",
                fontWeight: 600,
                color: "var(--green-800)",
              }}
            >
              GTM Buddy
            </span>
          </div>

          {isCta && slide.cta && (
            <span
              style={{
                background: "var(--cta)",
                color: "white",
                fontSize: forExport ? 18 : "clamp(12px, 1.4vw, 14px)",
                fontWeight: 600,
                padding: forExport ? "14px 24px" : "8px 16px",
                borderRadius: 8,
              }}
            >
              {slide.cta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
