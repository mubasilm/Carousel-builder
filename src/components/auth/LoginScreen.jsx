import { useAuth } from "@/lib/AuthContext";

export default function LoginScreen() {
  const { authError, authConfig, loginWithGoogle, loginWithSso, navigateToLogin, isLoadingAuth } = useAuth();

  const showGoogle = authConfig?.enable_google_login !== false;
  const showSso = authConfig?.enable_sso_login !== false;
  const ssoLabel = authConfig?.sso_provider_name
    ? `Continue with ${authConfig.sso_provider_name}`
    : "Continue with company email (SSO)";

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 py-12">
      <div className="card-panel w-full max-w-md text-center shadow-soft">
        <p className="text-xs font-bold uppercase tracking-widest text-green-accent">GTM Buddy Internal</p>
        <h1 className="mt-2 text-2xl font-bold text-text">Blog Carousel Studio</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in with your GTM Buddy account to create LinkedIn carousels from blog content.
        </p>

        {authError?.type === "user_not_registered" && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
            Your account is not registered for this internal tool. Contact your GTM Buddy admin for access.
          </div>
        )}

        <div className="mt-8 space-y-3">
          {showGoogle && (
            <button
              type="button"
              className="btn-primary w-full"
              disabled={isLoadingAuth}
              onClick={() => loginWithGoogle()}
            >
              Continue with Google
            </button>
          )}

          {showSso && (
            <button
              type="button"
              className="btn-secondary w-full"
              disabled={isLoadingAuth}
              onClick={() => loginWithSso()}
            >
              {ssoLabel}
            </button>
          )}

          <button
            type="button"
            className="w-full text-sm font-medium text-green-800 underline-offset-2 hover:underline"
            disabled={isLoadingAuth}
            onClick={() => navigateToLogin()}
          >
            Sign in with email
          </button>
        </div>

        <p className="mt-6 text-xs text-muted-light">
          Access is limited to approved @gtmbuddy.ai team members.
        </p>
      </div>
    </div>
  );
}
