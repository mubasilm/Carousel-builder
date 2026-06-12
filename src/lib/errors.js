import { getSetupErrorMessage, getSetupStatus } from "@/lib/setup-check";

export function formatApiError(error) {
  const message =
    error?.data?.error ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong";

  const { isReady, missing } = getSetupStatus();

  if (error?.status === 401 || error?.response?.status === 401) {
    return "Not authenticated. Log in via Base44 or open the app from your Base44 dashboard.";
  }

  if (error?.status === 404 || error?.response?.status === 404) {
    if (isReady) {
      return `${message}. Deploy backend functions: npx base44 functions deploy`;
    }
  }

  if (!isReady && /Missing Base44|VITE_BASE44|app_id/i.test(message)) {
    return getSetupErrorMessage(missing);
  }

  return message;
}
