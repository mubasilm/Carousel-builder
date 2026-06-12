import { getSetupErrorMessage, getSetupStatus } from "@/lib/setup-check";

export function formatApiError(error) {
  const { isReady, missing } = getSetupStatus();
  if (!isReady) {
    return getSetupErrorMessage(missing);
  }

  if (error?.status === 401 || error?.response?.status === 401) {
    return "Not authenticated. Log in via Base44 or open the app from your Base44 dashboard.";
  }

  if (error?.status === 404 || error?.response?.status === 404) {
    return "Base44 API not found. Check VITE_BASE44_APP_BASE_URL in .env.local matches your app URL (e.g. https://your-app.base44.app), restart the dev server, and deploy functions with: npx base44 functions deploy";
  }

  return (
    error?.data?.error ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
}
