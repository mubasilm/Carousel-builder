const isNode = typeof window === "undefined";
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

function getAppIdFromPath() {
  if (isNode) return null;
  const match = window.location.pathname.match(/\/apps\/([a-f0-9]{8,})/i);
  return match?.[1] || null;
}

function getHostedAppBaseUrl() {
  if (isNode) return null;
  const { hostname, origin } = window.location;
  if (hostname.endsWith(".base44.app")) return origin;
  if (hostname === "app.base44.com") return origin;
  return null;
}

export function isBase44Hosted() {
  if (isNode) return false;
  const { hostname } = window.location;
  return hostname.endsWith(".base44.app") || hostname === "app.base44.com";
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) return defaultValue;

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }
  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }
  return storage.getItem(storageKey) || null;
};

const getAppParams = () => {
  if (getAppParamValue("clear_access_token") === "true") {
    storage.removeItem("base44_access_token");
    storage.removeItem("token");
  }

  const pathAppId = getAppIdFromPath();
  const hostedBaseUrl = getHostedAppBaseUrl();
  const envAppId = import.meta.env.VITE_BASE44_APP_ID;
  const envBaseUrl = import.meta.env.VITE_BASE44_APP_BASE_URL;

  return {
    appId: getAppParamValue("app_id", { defaultValue: pathAppId || envAppId }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: getAppParamValue("from_url", { defaultValue: isNode ? "" : window.location.href }),
    functionsVersion: getAppParamValue("functions_version", {
      defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
    }),
    appBaseUrl: getAppParamValue("app_base_url", {
      defaultValue: hostedBaseUrl || envBaseUrl,
    }),
  };
};

export const appParams = { ...getAppParams() };
