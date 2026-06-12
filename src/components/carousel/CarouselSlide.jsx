import { getSlidePastel, getTheme } from "@/lib/design-themes";
import { parseBulletBody, resolveSlideLayout } from "@/lib/slide-layout";

const TYPE_LABELS = {
  hook: "Hook",
  problem: "Problem",
  insight: "Insight",
  takeaway: "Takeaway",
  cta: "CTA",
};

export default function CarouselSlide({
  slide,
  slideIndex,
  totalSlides,
  themeId = "editorial",
  visualArchetype = "editorial_memo",
  ctaSentence = "",
  ctaButton = "",
  forExport = false,
}) {
  const theme = getTheme(themeId);
  const layout = resolveSlideLayout(slide, visualArchetype);
  const isHook = slide.type === "hook";
  const isCta = slide.type === "cta";
  const isHookCover = isHook && slideIndex === 1;
  const bullets = parseBulletBody(slide.body);
  const pad = forExport ? 80 : "7.4%";
  const pastel = getSlidePastel(theme, slideIndex - 1);
  const eyebrowLabel = slide.eyebrow || TYPE_LABELS[slide.type] || "Slide";
  const textColor = isHookCover ? "#ffffff" : "var(--text)";
  const mutedColor = isHookCover ? "rgba(255,255,255,0.75)" : "var(--muted-light)";

  const canvasStyle = forExport
    ? { width: 1080, height: 1080, flexShrink: 0 }
    : { width: "100%", aspectRatio: "1 / 1" };

  const headlineSize = isHook
    ? forExport ? (theme.headerStyle === "band" ? 80 : 72) : "clamp(28px, 5.5vw, 48px)"
    : forExport ? 56 : "clamp(22px, 4vw, 36px)";

  const renderHeader = () => {
    if (theme.headerStyle === "dark-strip") {
      return (
        <div
          style={{
            background: "var(--green-950)",
            margin: forExport ? "-80px -80px 32px" : "-7.4% -7.4% 4%",
            padding: forExport ? "20px 80px" : "2% 7.4%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: forExport ? 12 : 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {eyebrowLabel}
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: forExport ? 14 : 12 }}>
            {slideIndex}/{totalSlides}
          </span>
        </div>
      );
    }

    if (theme.headerStyle === "band" && isHook) {
      return (
        <div style={{ background: "var(--green-band)", borderRadius: forExport ? 12 : 8, padding: forExport ? "16px 20px" : "3% 4%", marginBottom: forExport ? 24 : "3%" }}>
          <span style={{ color: theme.accent, fontSize: forExport ? 12 : 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {eyebrowLabel}
          </span>
        </div>
      );
    }

    if (theme.headerStyle === "step") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: forExport ? 16 : 12, marginBottom: forExport ? 24 : "3%" }}>
          <span
            style={{
              width: forExport ? 48 : 36,
              height: forExport ? 48 : 36,
              borderRadius: "50%",
              background: theme.accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: forExport ? 20 : 14,
              flexShrink: 0,
            }}
          >
            {slideIndex}
          </span>
          <span style={{ color: "var(--muted-light)", fontSize: forExport ? 14 : 12 }}>
            {slideIndex}/{totalSlides}
          </span>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: forExport ? 32 : "3%" }}>
        <span
          style={{
            background: theme.headerStyle === "minimal" ? "transparent" : "var(--green-soft)",
            color: theme.accent,
            fontSize: forExport ? 12 : 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: theme.headerStyle === "minimal" ? 0 : "4px 10px",
            borderRadius: 999,
          }}
        >
          {eyebrowLabel}
        </span>
        <span style={{ color: "var(--muted-light)", fontSize: forExport ? 14 : 12, fontWeight: 500 }}>
          {slideIndex}/{totalSlides}
        </span>
      </div>
    );
  };

  const renderDiagramStrip = () => {
    if (layout !== "diagram-strip" || isHookCover) return null;
    const steps = bullets?.length ? bullets : [slide.headline, slide.body].filter(Boolean).slice(0, 3);
    return (
      <div style={{ display: "flex", gap: forExport ? 12 : 8, marginTop: forExport ? 20 : "3%" }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: pastel,
              borderRadius: forExport ? 12 : 8,
              padding: forExport ? "16px 12px" : "3% 2%",
              borderTop: `4px solid ${theme.accent}`,
              fontSize: forExport ? 18 : 12,
              fontWeight: 600,
              color: "var(--text-soft)",
              textAlign: "center",
            }}
          >
            {i + 1}. {step}
          </div>
        ))}
      </div>
    );
  };

  const renderBody = () => {
    if (!slide.body && !bullets?.length) return null;

    if (layout === "two-column" && slide.body) {
      const parts = slide.body.split(/\n|\. /).filter(Boolean).slice(0, 2);
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: forExport ? 16 : 12, marginTop: forExport ? 16 : "2%" }}>
          {parts.map((part, i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? pastel : "#fff",
                border: "1px solid var(--border)",
                borderRadius: forExport ? 14 : 10,
                padding: forExport ? "20px 18px" : "4% 3%",
              }}
            >
              <p style={{ margin: 0, fontSize: forExport ? 24 : 14, lineHeight: 1.4, color: "var(--text-soft)" }}>{part}</p>
            </div>
          ))}
        </div>
      );
    }

    if (bullets?.length) {
      return (
        <ul style={{ margin: forExport ? "20px 0 0" : "3% 0 0", paddingLeft: forExport ? 28 : 20 }}>
          {bullets.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: forExport ? 28 : "clamp(14px, 2.2vw, 18px)",
                lineHeight: 1.45,
                color: "var(--text-soft)",
                marginBottom: forExport ? 12 : 8,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }

    const bodyStyles = {
      "pastel-card": { background: pastel, borderRadius: forExport ? 16 : 12, padding: forExport ? "28px 32px" : "4% 5%" },
      framed: { background: "#fff", border: "1px solid var(--border)", borderRadius: forExport ? 16 : 12, padding: forExport ? "28px 32px" : "4% 5%" },
      "workflow-row": { background: pastel, borderRadius: forExport ? 18 : 14, padding: forExport ? "32px 36px" : "5% 6%", borderLeft: `6px solid ${theme.accent}` },
      "surface-card": { background: "var(--surface)", boxShadow: "var(--shadow-card)", borderRadius: forExport ? 16 : 12, padding: forExport ? "28px 32px" : "4% 5%" },
      plain: { padding: forExport ? "8px 0" : "2% 0" },
      open: { padding: 0 },
    };

    const style = bodyStyles[theme.bodyStyle] || bodyStyles["pastel-card"];

    return (
      <div style={{ ...style, marginTop: forExport ? 0 : "2%" }}>
        <p
          style={{
            fontSize: forExport ? 32 : "clamp(14px, 2.2vw, 18px)",
            lineHeight: 1.45,
            color: "var(--text-soft)",
            margin: 0,
            whiteSpace: "pre-wrap",
            textAlign: theme.headlineAlign === "center" ? "center" : "left",
          }}
        >
          {slide.body}
        </p>
      </div>
    );
  };

  return (
    <div
      className="carousel-slide relative overflow-hidden"
      style={{
        ...canvasStyle,
        background: isHookCover ? "var(--green-950)" : theme.pageBg,
        fontFamily: "var(--font-body)",
      }}
      data-slide-export
    >
      {theme.showAccentBar && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: forExport ? 12 : "1.1%",
            background: theme.accent,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          paddingLeft: theme.showAccentBar ? (forExport ? 100 : "9%") : pad,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {renderHeader()}

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: headlineSize,
              fontWeight: 700,
              lineHeight: isHook ? 1.02 : 1.1,
              letterSpacing: "-0.04em",
              color: textColor,
              margin: 0,
              marginBottom: forExport ? 28 : "4%",
              textAlign: isHookCover ? "left" : theme.headlineAlign,
            }}
          >
            {slide.headline}
          </h2>

          {renderBody()}
          {renderDiagramStrip()}

          {(slide.closing_line || slide.footnote) && (
            <p
              style={{
                marginTop: forExport ? 20 : "3%",
                fontSize: forExport ? 22 : 14,
                fontWeight: slide.closing_line ? 600 : 400,
                color: isHookCover ? "rgba(255,255,255,0.9)" : "var(--green-800)",
              }}
            >
              {slide.closing_line || slide.footnote}
            </p>
          )}

          {slide.visual && !forExport && (
            <p style={{ marginTop: 12, fontSize: 11, color: mutedColor, fontStyle: "italic" }}>
              Visual: {slide.visual}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: forExport ? 24 : "4%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: forExport ? 12 : 8 }}>
            <div
              style={{
                width: forExport ? 36 : 24,
                height: forExport ? 36 : 24,
                borderRadius: 8,
                background: isHookCover ? "#18a957" : theme.accent,
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
            <span style={{ fontSize: forExport ? 16 : 12, fontWeight: 600, color: isHookCover ? "#fff" : theme.accent }}>
              GTM Buddy
            </span>
          </div>

          {isCta && (slide.cta || ctaButton) && (
            <div style={{ display: "flex", alignItems: "center", gap: forExport ? 16 : 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {(ctaSentence || slide.closing_line) && layout === "cta-split" && (
                <span style={{ fontSize: forExport ? 16 : 11, color: "var(--muted)", maxWidth: forExport ? 320 : 140 }}>
                  {ctaSentence || slide.closing_line}
                </span>
              )}
              <span
                style={{
                  background: theme.id === "minimal" ? "var(--cta-blue)" : "var(--cta)",
                  color: "white",
                  fontSize: forExport ? 18 : 13,
                  fontWeight: 600,
                  padding: forExport ? "14px 24px" : "8px 16px",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              >
                {slide.cta || ctaButton}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
