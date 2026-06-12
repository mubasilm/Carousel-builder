const isNode = typeof window === "undefined";
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

function getAppIdFromPath() {
  if (isNode) return null;
  const match = window.location.pathname.match(/\/apps\/([a-f0-9]{8,})/i);
  return match?.[1] || null;
}

function getAppIdFromSubdomain() {
  if (isNode) return null;
  const match = window.location.hostname.match(/^([a-f0-9]{8,})\.base44\.app$/i);
  return match?.[1] || null;
}

function getAppIdFromQuery() {
  if (isNode) return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("app_id") || params.get("appId") || null;
}

function getAppIdFromReferrer() {
  if (isNode || !document.referrer) return null;
  try {
    const ref = new URL(document.referrer);
    const pathMatch = ref.pathname.match(/\/apps\/([a-f0-9]{8,})/i);
    if (pathMatch?.[1]) return pathMatch[1];
    const hostMatch = ref.hostname.match(/^([a-f0-9]{8,})\.base44\.app$/i);
    return hostMatch?.[1] || null;
  } catch {
    return null;
  }
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

export function resolveAppId() {
  const envAppId = import.meta.env.VITE_BASE44_APP_ID;
  return (
    getAppIdFromQuery() ||
    getAppIdFromPath() ||
    getAppIdFromSubdomain() ||
    getAppIdFromReferrer() ||
    envAppId ||
    null
  );
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

  const hostedBaseUrl = getHostedAppBaseUrl();
  const envBaseUrl = import.meta.env.VITE_BASE44_APP_BASE_URL;

  return {
    appId: getAppParamValue("app_id", { defaultValue: resolveAppId() }),
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
