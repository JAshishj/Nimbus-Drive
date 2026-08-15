const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAcessToken = () => {
  return accessToken;
};


let refreshPromise = null;

export async function refreshAccessToken() {
  refreshPromise ??= fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).finally(() => {
    refreshPromise = null;
  });
  const response = await refreshPromise;
  if (!response.ok) {
    throw new Error("Refresh failed");
  }
  const data = await response.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}


export async function apiFetch(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const doFetch = (token) => {
    const headers = {
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await doFetch(accessToken);

  if (response.status === 401 && endpoint !== "/login" && endpoint !== "/register" && endpoint !== "/refresh") {
    try {
      await refreshAccessToken();
      response = await doFetch(accessToken);
    } catch {
      setAccessToken(null);
      if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.clone().json();
      message = errorData.message || errorData.error || message;
    } catch {
      // response might not be json
    }
    throw new Error(message);
  }

  return response;
}
