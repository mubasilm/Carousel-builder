import { getSetupErrorMessage, getSetupStatus } from "@/lib/setup-check";

export default function SetupBanner() {
  const { isReady, missing, localLlmHint } = getSetupStatus();

  if (isReady) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-sm font-semibold text-amber-900">Running locally without Base44</p>
          <p className="mt-1 text-sm text-amber-800">
            Carousel copy uses the blog-to-linkedin-carousel skill. For full AI generation, add an API key below.
            Base44 is optional.
          </p>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-white p-3 text-xs text-text-soft">
{`# .env.local
${localLlmHint}
ANTHROPIC_API_KEY=sk-ant-...

# Optional Base44 (URL fetch + cloud storage)
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app-name.base44.app`}
        </pre>

        {missing.length > 0 && (
          <p className="text-xs text-amber-700">{getSetupErrorMessage(missing)}</p>
        )}

        <p className="text-xs text-amber-700">
          After saving .env.local, restart: <code className="rounded bg-white px-1">npm run dev</code>
        </p>
      </div>
    </div>
  );
}
