import { NAV_CHROME_HEIGHT } from "@/lib/slide-constants";

export default function SlideNavChrome({
  slideIndex,
  totalSlides,
  forExport = false,
  isCta = false,
}) {
  const isLast = slideIndex >= totalSlides;
  const progress = (slideIndex / totalSlides) * 100;
  const dotSize = forExport ? 8 : 6;
  const activeW = forExport ? 24 : 18;

  return (
    <div
      data-slide-nav
      style={{
        flexShrink: 0,
        height: forExport ? NAV_CHROME_HEIGHT : "auto",
        minHeight: forExport ? NAV_CHROME_HEIGHT : 48,
        paddingTop: forExport ? 12 : "2%",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: forExport ? 8 : 6,
      }}
    >
      <div
        style={{
          height: forExport ? 4 : 3,
          background: "var(--border)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--green-accent)",
            borderRadius: 999,
            transition: "width 0.2s",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: forExport ? 14 : 11,
            fontWeight: 600,
            color: "var(--muted-light)",
            letterSpacing: "0.02em",
          }}
        >
          {slideIndex} / {totalSlides}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: forExport ? 6 : 4 }}>
          {Array.from({ length: totalSlides }, (_, i) => {
            const active = i + 1 === slideIndex;
            return (
              <span
                key={i}
                style={{
                  width: active ? activeW : dotSize,
                  height: dotSize,
                  borderRadius: 999,
                  background: active ? "var(--green-accent)" : "var(--border-strong)",
                  display: "inline-block",
                  transition: "width 0.2s",
                }}
              />
            );
          })}
        </div>

        <span
          style={{
            fontSize: forExport ? 13 : 10,
            fontWeight: 600,
            color: "var(--green-800)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {isLast ? (isCta ? "End" : "End") : "Swipe →"}
        </span>
      </div>
    </div>
  );
}
