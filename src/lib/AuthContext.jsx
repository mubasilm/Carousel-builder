import React, { createContext, useContext, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { appParams, isBase44Hosted } from "@/lib/app-params";
import { createAxiosClient } from "@base44/sdk/dist/utils/axios-client";

const AuthContext = createContext(null);

const DEFAULT_AUTH_CONFIG = {
  enable_google_login: true,
  enable_sso_login: true,
  sso_provider_name: "Company SSO",
};

async function fetchPublicAuthConfig() {
  if (!appParams.appId) return DEFAULT_AUTH_CONFIG;
  try {
    const appClient = createAxiosClient({
      baseURL: "/api/apps/public",
      headers: { "X-App-Id": appParams.appId },
      token: appParams.token,
      interceptResponses: true,
    });
    const res = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
    return { ...DEFAULT_AUTH_CONFIG, ...(res?.auth_config || {}) };
  } catch {
    return DEFAULT_AUTH_CONFIG;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authConfig, setAuthConfig] = useState(DEFAULT_AUTH_CONFIG);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      if (!isBase44Hosted()) {
        setAuthError({ type: "auth_required", message: "Authentication required" });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkAppState = async () => {
    const config = await fetchPublicAuthConfig();
    setAuthConfig(config);

    if (isBase44Hosted()) {
      setAuthError(null);
      setIsLoadingPublicSettings(false);
      await checkUserAuth();
      return;
    }

    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      const appClient = createAxiosClient({
        baseURL: "/api/apps/public",
        headers: { "X-App-Id": appParams.appId },
        token: appParams.token,
        interceptResponses: true,
      });

      try {
        await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
      } catch (appError) {
        const reason = appError.data?.extra_data?.reason;
        if (reason === "auth_required") {
          setAuthError({ type: "auth_required", message: "Authentication required" });
        } else if (reason === "user_not_registered") {
          setAuthError({ type: "user_not_registered", message: "User not registered for this app" });
        } else {
          setAuthError({ type: "unknown", message: appError.message || "Failed to load app" });
        }
        setIsLoadingAuth(false);
      } finally {
        setIsLoadingPublicSettings(false);
      }
    } catch (error) {
      setAuthError({ type: "unknown", message: error.message });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const returnUrl = () => (typeof window !== "undefined" ? window.location.href : "/");

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(returnUrl());
  };

  const loginWithGoogle = () => {
    base44.auth.loginWithProvider("google", returnUrl());
  };

  const loginWithSso = () => {
    base44.auth.loginWithProvider("sso", returnUrl());
  };

  const logout = () => base44.auth.logout(returnUrl());

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authConfig,
        navigateToLogin,
        loginWithGoogle,
        loginWithSso,
        logout,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
