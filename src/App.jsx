import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { getSetupStatus } from "@/lib/setup-check";
import Home from "@/pages/Home";

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { isReady } = getSetupStatus();

  if (isReady && (isLoadingPublicSettings || isLoadingAuth)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-green-accent" />
      </div>
    );
  }

  if (isReady && authError?.type === "auth_required") {
    navigateToLogin();
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  if (isReady && authError?.type === "user_not_registered") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page px-6">
        <div className="card-panel max-w-md text-center">
          <h1 className="text-lg font-bold text-text">Access restricted</h1>
          <p className="mt-2 text-sm text-muted">
            Your account is not registered for this internal tool. Contact your GTM Buddy admin for access.
          </p>
        </div>
      </div>
    );
  }

  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
