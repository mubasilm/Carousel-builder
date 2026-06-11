import { useCallback, useState } from "react";
import { base44 } from "@/api/base44Client";
import CarouselExportPanel from "@/components/carousel/CarouselExportPanel";
import CarouselPreview from "@/components/carousel/CarouselPreview";
import StepInput from "@/components/wizard/StepInput";
import StepReview from "@/components/wizard/StepReview";
import { EMPTY_PROJECT, normalizeSlides } from "@/lib/carousel-schema";
import { useAuth } from "@/lib/AuthContext";

const STEPS = [
  { id: 1, label: "Input" },
  { id: 2, label: "Review" },
  { id: 3, label: "Preview" },
  { id: 4, label: "Export" },
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
      };

      if (projectId) {
        const updated = await base44.entities.CarouselProject.update(projectId, payload);
        setProject(updated);
        return updated;
      }

      const created = await base44.entities.CarouselProject.create(payload);
      setProjectId(created.id);
      setProject(created);
      return created;
    },
    [project, projectId, sourceType, sourceUrl, sourceText, slides, linkedinCaption, hashtags, referenceUrls],
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
        const fetched = await base44.functions.invoke("fetch-blog-content", { url: sourceUrl.trim() });
        if (!fetched.success) {
          throw new Error(fetched.error || "Could not fetch blog content");
        }
        blogText = fetched.body;
        title = fetched.title || title;
        setSourceText(blogText);
      } else if (!blogText.trim()) {
        throw new Error("Please paste the blog content");
      }

      const generated = await base44.functions.invoke("generate-carousel-slides", {
        blogText,
        title,
      });

      if (!generated.success) {
        throw new Error(generated.error || "Failed to generate slides");
      }

      const nextSlides = normalizeSlides(generated.slides);
      setSlides(nextSlides);
      setLinkedinCaption(generated.linkedin_caption || "");
      setHashtags(generated.hashtags || []);
      setProject((p) => ({ ...p, title: generated.title || title }));

      await saveProject({
        title: generated.title || title,
        slides: nextSlides,
        linkedin_caption: generated.linkedin_caption,
        hashtags: generated.hashtags,
        status: "draft",
      });

      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSlide = async (index) => {
    setRegeneratingIndex(index);
    setError("");
    try {
      const context = `Regenerate only slide ${index + 1} for this carousel. Keep the same topic. Current slides: ${JSON.stringify(slides)}`;
      const generated = await base44.functions.invoke("generate-carousel-slides", {
        blogText: `${sourceText}\n\n${context}`,
        title: project.title,
      });
      if (generated.success && generated.slides?.[index]) {
        const next = [...slides];
        next[index] = normalizeSlides([generated.slides[index]])[0];
        setSlides(next);
      }
    } catch (err) {
      setError(err.message || "Failed to regenerate slide");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      await saveProject({ slides, linkedin_caption: linkedinCaption, hashtags, status: "ready" });
    }
    if (step === 3) {
      await saveProject({ status: "ready" });
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const handleExported = async () => {
    await saveProject({ status: "exported" });
  };

  return (
    <div className="min-h-screen bg-page">
      <header
        className="border-b border-border bg-page-soft"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-accent">GTM Buddy Internal</p>
            <h1 className="text-xl font-bold text-text">Blog Carousel Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && <span className="text-sm text-muted">{user.email}</span>}
            <button type="button" className="btn-secondary text-sm" onClick={() => logout()}>
              Log out
            </button>
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

        {step === 3 && <CarouselPreview slides={slides} />}

        {step === 4 && (
          <CarouselExportPanel
            project={{ ...project, reference_urls: referenceUrls.filter(Boolean) }}
            slides={slides}
            onExported={handleExported}
          />
        )}

        {error && step !== 1 && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step > 1 && step < 4 && (
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

        {step === 4 && (
          <div className="mt-8">
            <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
              Back to preview
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
