import { useLayoutEffect, useRef, useState } from "react";
import CarouselBrandMark from "@/components/carousel/CarouselBrandMark";
import SlideNavChrome from "@/components/carousel/SlideNavChrome";
import { getThemeHeadlineSize, renderThemeHeader } from "@/lib/carousel-themes/render-header";
import { getSlidePastel, getTheme } from "@/lib/design-themes";
import { parseBulletBody, resolveSlideLayout } from "@/lib/slide-layout";
import { SLIDE_PAD, SLIDE_PAD_PERCENT, SLIDE_SIZE } from "@/lib/slide-constants";

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
  logoPlacement = "bottom_left",
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
  const pad = forExport ? SLIDE_PAD : SLIDE_PAD_PERCENT;
  const pastel = getSlidePastel(theme, slideIndex - 1);
  const eyebrowLabel = slide.eyebrow || TYPE_LABELS[slide.type] || "Slide";
  const textColor = isHookCover ? "#ffffff" : "var(--text)";
  const mutedColor = isHookCover ? "rgba(255,255,255,0.75)" : "var(--muted-light)";

  const contentRef = useRef(null);
  const [fontScale, setFontScale] = useState(1);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let scale = 1;
    const minScale = 0.8;
    while (scale > minScale && el.scrollHeight > el.clientHeight + 2) {
      scale -= 0.05;
    }
    setFontScale(scale);
  }, [slide, themeId, forExport, logoPlacement]);

  const canvasStyle = forExport
    ? { width: SLIDE_SIZE, height: SLIDE_SIZE, flexShrink: 0 }
    : { width: "100%", aspectRatio: "1 / 1" };

  const headlineSize = getThemeHeadlineSize({ theme, isHook, forExport, fontScale });
  const bodyBase = forExport ? Math.round(32 * fontScale) : "clamp(14px, 2.2vw, 18px)";
  const showBottomLogo = logoPlacement === "bottom_left" || (logoPlacement === "cover_footer_strip" && !isHookCover);

  const renderDiagramStrip = () => {
    if (layout !== "diagram-strip" || isHookCover) return null;
    const steps = bullets?.length ? bullets : [slide.headline, slide.body].filter(Boolean).slice(0, 3);
    return (
      <div style={{ display: "flex", gap: forExport ? 12 : 8, marginTop: forExport ? 16 : "2%" }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: pastel,
              borderRadius: forExport ? 12 : 8,
              padding: forExport ? "14px 10px" : "3% 2%",
              borderTop: `4px solid ${theme.accent}`,
              fontSize: forExport ? Math.round(18 * fontScale) : 12,
              fontWeight: 600,
              color: "var(--text-soft)",
              textAlign: "center",
              overflow: "hidden",
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: forExport ? 16 : 12, marginTop: forExport ? 12 : "2%" }}>
          {parts.map((part, i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? pastel : "#fff",
                border: "1px solid var(--border)",
                borderRadius: forExport ? 14 : 10,
                padding: forExport ? "18px 16px" : "4% 3%",
                overflow: "hidden",
              }}
            >
              <p style={{ margin: 0, fontSize: forExport ? Math.round(24 * fontScale) : 14, lineHeight: 1.4, color: "var(--text-soft)" }}>
                {part}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (bullets?.length) {
      return (
        <ul style={{ margin: forExport ? "16px 0 0" : "2% 0 0", paddingLeft: forExport ? 28 : 20 }}>
          {bullets.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: bodyBase,
                lineHeight: 1.4,
                color: "var(--text-soft)",
                marginBottom: forExport ? 10 : 6,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }

    const bodyStyles = {
      "pastel-card": { background: pastel, borderRadius: forExport ? 16 : 12, padding: forExport ? "24px 28px" : "4% 5%" },
      framed: {
        background: "#fff",
        border: "2px solid var(--border-strong)",
        borderRadius: forExport ? 16 : 12,
        padding: forExport ? "24px 28px" : "4% 5%",
        ...(theme.id === "split_frame" ? { marginLeft: forExport ? 8 : 4 } : {}),
      },
      "workflow-row": {
        background: pastel,
        borderRadius: forExport ? 18 : 14,
        padding: forExport ? "28px 32px" : "5% 6%",
        borderLeft: `6px solid ${theme.accent}`,
      },
      "surface-card": { background: "var(--surface)", boxShadow: "var(--shadow-card)", borderRadius: forExport ? 16 : 12, padding: forExport ? "24px 28px" : "4% 5%" },
      plain: { padding: forExport ? "8px 0" : "2% 0" },
      open: { padding: 0 },
    };

    const style = bodyStyles[theme.bodyStyle] || bodyStyles["pastel-card"];

    return (
      <div style={{ ...style, marginTop: forExport ? 0 : "2%", overflow: "hidden" }}>
        <p
          style={{
            fontSize: bodyBase,
            lineHeight: 1.4,
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
      {logoPlacement === "top_right" && (
        <CarouselBrandMark placement="top_right" isHookCover={isHookCover} forExport={forExport} themeAccent={theme.accent} />
      )}

      {logoPlacement === "cover_footer_strip" && isHookCover && (
        <CarouselBrandMark placement="cover_footer_strip" isHookCover forExport={forExport} themeAccent={theme.accent} />
      )}

      {theme.showAccentBar && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: forExport ? 14 : "1.2%",
            background: theme.accent,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          paddingLeft: theme.showAccentBar ? (forExport ? SLIDE_PAD + 14 : "9.5%") : pad,
          paddingBottom: forExport ? SLIDE_PAD : pad,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          ref={contentRef}
          data-slide-content
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderThemeHeader({
            theme,
            slide,
            slideIndex,
            totalSlides,
            isHook,
            isHookCover,
            forExport,
            eyebrowLabel,
          })}

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: headlineSize,
              fontWeight: 700,
              lineHeight: isHook ? 1.02 : 1.1,
              letterSpacing: "-0.04em",
              color: textColor,
              margin: 0,
              marginBottom: forExport ? 20 : "3%",
              textAlign: isHookCover ? "left" : theme.headlineAlign,
              overflow: "hidden",
            }}
          >
            {slide.headline}
          </h2>

          {renderBody()}
          {renderDiagramStrip()}

          {(slide.closing_line || slide.footnote) && (
            <p
              style={{
                marginTop: forExport ? 16 : "2%",
                fontSize: forExport ? Math.round(22 * fontScale) : 14,
                fontWeight: slide.closing_line ? 600 : 400,
                color: isHookCover ? "rgba(255,255,255,0.9)" : "var(--green-800)",
                overflow: "hidden",
              }}
            >
              {slide.closing_line || slide.footnote}
            </p>
          )}

          {slide.visual && !forExport && (
            <p style={{ marginTop: 8, fontSize: 10, color: mutedColor, fontStyle: "italic" }}>
              Visual: {slide.visual}
            </p>
          )}

          <div style={{ flex: 1, minHeight: 8 }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: forExport ? 16 : "2%",
              gap: 12,
            }}
          >
            {showBottomLogo ? (
              <CarouselBrandMark
                placement="bottom_left"
                isHookCover={isHookCover}
                forExport={forExport}
                themeAccent={theme.accent}
              />
            ) : (
              <div />
            )}

            {isCta && (slide.cta || ctaButton) && (
              <div style={{ display: "flex", alignItems: "center", gap: forExport ? 16 : 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {(ctaSentence || slide.closing_line) && layout === "cta-split" && (
                  <span style={{ fontSize: forExport ? 16 : 11, color: "var(--muted)", maxWidth: forExport ? 360 : 140 }}>
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

        <SlideNavChrome slideIndex={slideIndex} totalSlides={totalSlides} forExport={forExport} isCta={isCta} />
      </div>
    </div>
  );
}
