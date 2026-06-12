/** Theme-specific header renderers for CarouselSlide */

export function renderThemeHeader({
  theme,
  slide,
  slideIndex,
  totalSlides,
  isHook,
  isHookCover,
  forExport,
  eyebrowLabel,
}) {
  const mb = forExport ? 32 : "3%";
  const fsSm = forExport ? 12 : 11;
  const fsMd = forExport ? 14 : 12;

  if (theme.headerStyle === "rail") {
    return (
      <div style={{ display: "flex", gap: forExport ? 20 : 12, marginBottom: mb, alignItems: "flex-start" }}>
        <div
          style={{
            width: forExport ? 48 : 36,
            minHeight: forExport ? 48 : 36,
            background: theme.accent,
            borderRadius: forExport ? 8 : 6,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              color: theme.accent,
              fontSize: fsSm,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {eyebrowLabel}
          </span>
          <span style={{ color: "var(--muted-light)", fontSize: fsMd, fontWeight: 500 }}>
            {slideIndex}/{totalSlides}
          </span>
        </div>
      </div>
    );
  }

  if (theme.headerStyle === "dark-strip") {
    return (
      <div
        style={{
          background: "var(--green-950)",
          margin: forExport ? "-89px -89px 32px" : "-7.4% -7.4% 4%",
          padding: forExport ? "20px 89px" : "2% 7.4%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: fsSm, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {eyebrowLabel}
        </span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: fsMd }}>{slideIndex}/{totalSlides}</span>
      </div>
    );
  }

  if (theme.headerStyle === "band" && isHook) {
    return (
      <div
        style={{
          background: "var(--green-band)",
          borderRadius: forExport ? 12 : 8,
          padding: forExport ? "16px 20px" : "3% 4%",
          marginBottom: forExport ? 24 : "3%",
        }}
      >
        <span style={{ color: theme.accent, fontSize: fsSm, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
        <span style={{ color: "var(--muted-light)", fontSize: fsMd }}>{slideIndex}/{totalSlides}</span>
      </div>
    );
  }

  if (theme.headerStyle === "minimal") {
    return (
      <div style={{ textAlign: "center", marginBottom: mb }}>
        <span style={{ color: theme.accent, fontSize: fsSm, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {eyebrowLabel}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: mb }}>
      <span
        style={{
          background: "var(--green-soft)",
          color: theme.accent,
          fontSize: fsSm,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 999,
        }}
      >
        {eyebrowLabel}
      </span>
      {!isHookCover && (
        <span style={{ color: "var(--muted-light)", fontSize: fsMd, fontWeight: 500 }}>
          {slideIndex}/{totalSlides}
        </span>
      )}
    </div>
  );
}

export function getThemeHeadlineSize({ theme, isHook, forExport, fontScale = 1 }) {
  const scale = (n) => Math.round(n * fontScale);
  if (isHook) {
    if (theme.id === "bold_hook") return forExport ? scale(88) : "clamp(30px, 6vw, 52px)";
    if (theme.id === "minimal") return forExport ? scale(64) : "clamp(26px, 5vw, 44px)";
    return forExport ? scale(76) : "clamp(28px, 5.5vw, 48px)";
  }
  if (theme.id === "minimal") return forExport ? scale(48) : "clamp(20px, 3.8vw, 32px)";
  return forExport ? scale(56) : "clamp(22px, 4vw, 36px)";
}
