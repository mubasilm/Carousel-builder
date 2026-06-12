import { useCallback, useState } from "react";
import CarouselExportPanel from "@/components/carousel/CarouselExportPanel";
import CarouselPreview from "@/components/carousel/CarouselPreview";
import DesignOutputsPanel from "@/components/carousel/DesignOutputsPanel";
import DesignThemePicker from "@/components/carousel/DesignThemePicker";
import SetupBanner from "@/components/SetupBanner";
import StepInput from "@/components/wizard/StepInput";
import StepReview from "@/components/wizard/StepReview";
import {
  fetchBlogContent,
  generateCarouselSlides,
  saveCarouselProject,
} from "@/lib/carousel-api";
import { EMPTY_PROJECT, normalizeSlides } from "@/lib/carousel-schema";
import {
  ARCHETYPE_LABELS,
  buildExternalDesignPrompt,
  buildInAppDesignPrompt,
} from "@/lib/design-prompt";
import { DESIGN_THEMES, THEME_IDS } from "@/lib/design-themes";
import { formatApiError } from "@/lib/errors";
import { getGenerationModeLabel } from "@/lib/setup-check";
import { useAuth } from "@/lib/AuthContext";

const STEPS = [
  { id: 1, label: "Input" },
  { id: 2, label: "Review" },
  { id: 3, label: "Design" },
  { id: 4, label: "Preview" },
  { id: 5, label: "Export" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState(null);
  const [project, setProject] = useState({ ...EMPTY_PROJECT });
  const [sourceType, setSourceType] = useState("paste");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [referenceUrls, setReferenceUrls] = useState([]);
  const [slides, setSlides] = useState([]);
  const [linkedinCaption, setLinkedinCaption] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [designTheme, setDesignTheme] = useState("editorial");
  const [visualArchetype, setVisualArchetype] = useState("editorial_memo");
  const [figmaMakePrompt, setFigmaMakePrompt] = useState("");
  const [externalDesignPrompt, setExternalDesignPrompt] = useState("");
  const [inAppDesignPrompt, setInAppDesignPrompt] = useState("");
  const [carouselStrategy, setCarouselStrategy] = useState(null);
  const [ctaSentence, setCtaSentence] = useState("");
  const [ctaButton, setCtaButton] = useState("");
  const [generationSource, setGenerationSource] = useState("");
  const [generationNotice, setGenerationNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const saveProject = useCallback(
    async (updates = {}) => {
      const payload = {
        title: updates.title ?? project.title ?? "Untitled Carousel",
        source_type: sourceType,
        source_url: sourceUrl || undefined,
        source_text: sourceText,
        slides: normalizeSlides(updates.slides ?? slides),
        linkedin_caption: updates.linkedin_caption ?? linkedinCaption,
        hashtags: updates.hashtags ?? hashtags,
        status: updates.status ?? project.status ?? "draft",
        reference_urls: referenceUrls.filter(Boolean),
        design_theme: updates.design_theme ?? designTheme,
        visual_archetype: updates.visual_archetype ?? visualArchetype,
        figma_make_prompt: updates.figma_make_prompt ?? figmaMakePrompt,
        external_design_prompt: updates.external_design_prompt ?? externalDesignPrompt,
        in_app_design_prompt: updates.in_app_design_prompt ?? inAppDesignPrompt,
        carousel_strategy: updates.carousel_strategy ?? carouselStrategy,
        cta_sentence: updates.cta_sentence ?? ctaSentence,
        cta_button: updates.cta_button ?? ctaButton,
      };

      const saved = await saveCarouselProject({ projectId, payload });
      if (!projectId && saved.id) {
        setProjectId(saved.id);
      }
      setProject(saved);
      return saved;
    },
    [project, projectId, sourceType, sourceUrl, sourceText, slides, linkedinCaption, hashtags, referenceUrls, designTheme, visualArchetype, figmaMakePrompt, externalDesignPrompt, inAppDesignPrompt, carouselStrategy, ctaSentence, ctaButton],
  );

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      let blogText = sourceText;
      let title = project.title || "Untitled Carousel";

      if (sourceType === "url") {
        if (!sourceUrl.trim()) {
          throw new Error("Please enter a blog URL");
        }
        const fetched = await fetchBlogContent(sourceUrl.trim());
        if (!fetched.success) {
          throw new Error(fetched.error || "Could not fetch blog content");
        }
        blogText = fetched.body;
        title = fetched.title || title;
        setSourceText(blogText);
      } else if (!blogText.trim()) {
        throw new Error("Please paste the blog content");
      }

      const generated = await generateCarouselSlides({
        blogText,
        title,
        referenceUrls: referenceUrls.filter(Boolean),
      });
      const nextSlides = normalizeSlides(generated.slides);

      setSlides(nextSlides);
      setLinkedinCaption(generated.linkedin_caption || "");
      setHashtags(generated.hashtags || []);
      setDesignTheme(generated.design_theme || "editorial");
      setVisualArchetype(generated.visual_archetype || "editorial_memo");
      setFigmaMakePrompt(generated.figma_make_prompt || "");
      setExternalDesignPrompt(generated.external_design_prompt || "");
      setInAppDesignPrompt(generated.in_app_design_prompt || "");
      setCarouselStrategy(generated.carousel_strategy || null);
      setCtaSentence(generated.cta_sentence || "");
      setCtaButton(generated.cta_button || "");
      setGenerationSource(generated._source || "unknown");
      setGenerationNotice(generated._fallbackReason || "");
      setProject((p) => ({
        ...p,
        title: generated.title || title,
        design_theme: generated.design_theme,
        visual_archetype: generated.visual_archetype,
      }));

      await saveProject({
        title: generated.title || title,
        slides: nextSlides,
        linkedin_caption: generated.linkedin_caption,
        hashtags: generated.hashtags,
        design_theme: generated.design_theme,
        visual_archetype: generated.visual_archetype,
        figma_make_prompt: generated.figma_make_prompt,
        external_design_prompt: generated.external_design_prompt,
        in_app_design_prompt: generated.in_app_design_prompt,
        carousel_strategy: generated.carousel_strategy,
        cta_sentence: generated.cta_sentence,
        cta_button: generated.cta_button,
        status: "draft",
      });

      setStep(2);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSlide = async (index) => {
    setRegeneratingIndex(index);
    setError("");
    try {
      const context = `Regenerate only slide ${index + 1} for this carousel. Keep the same topic. Current slides: ${JSON.stringify(slides)}`;
      const generated = await generateCarouselSlides({
        blogText: `${sourceText}\n\n${context}`,
        title: project.title,
      });
      if (generated.slides?.[index]) {
        const next = [...slides];
        next[index] = normalizeSlides([generated.slides[index]])[0];
        setSlides(next);
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const shuffleDesign = () => {
    const others = THEME_IDS.filter((id) => id !== designTheme);
    const next = others[Math.floor(Math.random() * others.length)];
    setDesignTheme(next);
    setProject((p) => ({ ...p, design_theme: next }));
  };

  const handleNext = async () => {
    if (step === 2) {
      const promptOpts = {
        title: project.title,
        slides,
        visualArchetype,
        carouselStrategy: carouselStrategy || { thesis: project.title },
        referenceUrls: referenceUrls.filter(Boolean),
        themeId: designTheme,
        ctaSentence,
        ctaButton,
      };
      const refreshedFigma = buildExternalDesignPrompt({ ...promptOpts, target: "figma" });
      const refreshedClaude = buildExternalDesignPrompt({ ...promptOpts, target: "claude" });
      const refreshedInApp = buildInAppDesignPrompt(promptOpts);
      setFigmaMakePrompt(refreshedFigma);
      setExternalDesignPrompt(refreshedClaude);
      setInAppDesignPrompt(refreshedInApp);
      await saveProject({
        slides,
        linkedin_caption: linkedinCaption,
        hashtags,
        design_theme: designTheme,
        figma_make_prompt: refreshedFigma,
        external_design_prompt: refreshedClaude,
        in_app_design_prompt: refreshedInApp,
        status: "ready",
      });
    }
    if (step === 3) {
      await saveProject({
        design_theme: designTheme,
        visual_archetype: visualArchetype,
        figma_make_prompt: figmaMakePrompt,
        external_design_prompt: externalDesignPrompt,
        in_app_design_prompt: inAppDesignPrompt,
        status: "ready",
      });
    }
    if (step === 4) {
      await saveProject({ status: "ready" });
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleExported = async () => {
    await saveProject({ status: "exported" });
  };

  return (
    <div className="min-h-screen bg-page">
      <SetupBanner />
      <header className="border-b border-border bg-page-soft" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-accent">GTM Buddy Internal</p>
            <h1 className="text-xl font-bold text-text">Blog Carousel Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            {generationSource && (
              <span className="rounded-full bg-green-soft px-2.5 py-1 text-xs font-medium text-green-800">
                {getGenerationModeLabel(generationSource)}
              </span>
            )}
            {user?.email && <span className="text-sm text-muted">{user.email}</span>}
            {user && (
              <button type="button" className="btn-secondary text-sm" onClick={() => logout()}>
                Log out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => s.id <= step && setStep(s.id)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition"
              style={{
                background: step === s.id ? "var(--green-soft)" : "transparent",
                color: step === s.id ? "var(--green-800)" : "var(--muted)",
                border: `1px solid ${step >= s.id ? "var(--green-accent)" : "var(--border)"}`,
                cursor: s.id <= step ? "pointer" : "default",
              }}
            >
              {s.id}. {s.label}
            </button>
          ))}
        </nav>

        {step === 1 && (
          <StepInput
            sourceType={sourceType}
            setSourceType={setSourceType}
            sourceUrl={sourceUrl}
            setSourceUrl={setSourceUrl}
            sourceText={sourceText}
            setSourceText={setSourceText}
            referenceUrls={referenceUrls}
            setReferenceUrls={setReferenceUrls}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
          />
        )}

        {generationNotice && step === 2 && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {generationNotice}
          </div>
        )}

        {step === 2 && (
          <StepReview
            slides={slides}
            setSlides={setSlides}
            linkedinCaption={linkedinCaption}
            setLinkedinCaption={setLinkedinCaption}
            hashtags={hashtags}
            setHashtags={setHashtags}
            onRegenerateSlide={handleRegenerateSlide}
            regeneratingIndex={regeneratingIndex}
          />
        )}

        {step === 3 && (
          <div className="space-y-6">
            <DesignOutputsPanel
              figmaMakePrompt={figmaMakePrompt}
              externalDesignPrompt={externalDesignPrompt}
              inAppDesignPrompt={inAppDesignPrompt}
              visualArchetype={visualArchetype}
              carouselStrategy={carouselStrategy}
            />
            <DesignThemePicker
              themeId={designTheme}
              onChange={setDesignTheme}
              onShuffle={shuffleDesign}
              visualArchetype={visualArchetype}
            />
            <div className="card-panel space-y-2">
              <p className="text-sm text-muted">
                Layout theme: <strong className="text-text">{DESIGN_THEMES[designTheme]?.label}</strong>
              </p>
              <p className="text-sm text-muted">
                Visual archetype: <strong className="text-text">{ARCHETYPE_LABELS[visualArchetype] || visualArchetype}</strong>
              </p>
              {ctaSentence && (
                <p className="text-sm text-muted">
                  CTA pair: <em>{ctaSentence}</em> / <strong>{ctaButton}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <CarouselPreview
            slides={slides}
            setSlides={setSlides}
            themeId={designTheme}
            visualArchetype={visualArchetype}
            ctaSentence={ctaSentence}
            ctaButton={ctaButton}
          />
        )}

        {step === 5 && (
          <CarouselExportPanel
            project={{ ...project, reference_urls: referenceUrls.filter(Boolean), design_theme: designTheme }}
            slides={slides}
            themeId={designTheme}
            visualArchetype={visualArchetype}
            ctaSentence={ctaSentence}
            ctaButton={ctaButton}
            onExported={handleExported}
          />
        )}

        {error && step !== 1 && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step > 1 && step < 5 && (
          <div className="mt-8 flex justify-between">
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={step === 2 && !slides.length}
            >
              Continue
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="mt-8">
            <button type="button" className="btn-secondary" onClick={() => setStep(4)}>
              Back to preview
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
