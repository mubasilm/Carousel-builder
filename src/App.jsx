import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { isBase44Hosted } from "@/lib/app-params";
import { getSetupStatus } from "@/lib/setup-check";
import LoginScreen from "@/components/auth/LoginScreen";
import Home from "@/pages/Home";

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, isAuthenticated } = useAuth();
  const { isReady } = getSetupStatus();
  const hosted = isBase44Hosted();

  if ((hosted || isReady) && (isLoadingPublicSettings || isLoadingAuth)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-green-accent" />
      </div>
    );
  }

  const requireAuth = hosted || isReady;
  if (requireAuth && !isAuthenticated) {
    return <LoginScreen />;
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
