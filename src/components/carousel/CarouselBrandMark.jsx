import { SLIDE_SIZE } from "@/lib/slide-constants";

const LOGO_LIGHT = "/brand/gtm-buddy-logo-light.png";
const LOGO_DARK = "/brand/gtm-buddy-logo-dark.png";

export default function CarouselBrandMark({
  placement = "bottom_left",
  isHookCover = false,
  forExport = false,
  themeAccent = "#18a957",
}) {
  const logoSrc = isHookCover ? LOGO_LIGHT : LOGO_DARK;
  const width = forExport ? 160 : "38%";
  const maxWidth = forExport ? 200 : 140;

  if (placement === "top_right") {
    return (
      <img
        src={logoSrc}
        alt="GTM Buddy"
        style={{
          position: "absolute",
          top: forExport ? 24 : "3%",
          right: forExport ? 24 : "3%",
          width: forExport ? 120 : "28%",
          maxWidth: 120,
          height: "auto",
          opacity: isHookCover ? 0.95 : 0.85,
          zIndex: 5,
        }}
      />
    );
  }

  if (placement === "cover_footer_strip" && isHookCover) {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: forExport ? 72 : "10%",
          background: "var(--green-950)",
          padding: forExport ? "16px 89px" : "2% 7.4%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 4,
        }}
      >
        <img src={logoSrc} alt="GTM Buddy" style={{ width: forExport ? 180 : "42%", maxWidth: 180, height: "auto" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
      <img
        src={logoSrc}
        alt="GTM Buddy"
        style={{
          width: typeof width === "number" ? width : width,
          maxWidth,
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
}

export function getBrandMarkHeight(forExport) {
  return forExport ? 36 : 28;
}
