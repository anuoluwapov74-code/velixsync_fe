import { BACKEND_URL } from "./constants";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token using the refresh_token cookie.
 * Returns true if refresh succeeded, false otherwise.
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch wrapper that always includes credentials for HTTPOnly cookie auth.
 * Automatically retries once on 401 by refreshing the access token.
 *
 * @param endpoint - The API endpoint path (e.g., "/login/")
 * @param options - Standard fetch options (method, body, etc.)
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${BACKEND_URL}${endpoint}`;

  // Don't force JSON on a FormData body — the browser needs to set its own
  // multipart/form-data boundary header, which a manual Content-Type here
  // would stomp on and break the upload.
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const doFetch = () =>
    fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

  const response = await doFetch();

  // If 401 and not already a refresh/login/register call, try refreshing
  if (
    response.status === 401 &&
    !endpoint.includes("/token/refresh") &&
    !endpoint.includes("/login") &&
    !endpoint.includes("/register")
  ) {
    // Deduplicate concurrent refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshed = await (refreshPromise ?? Promise.resolve(false));

    if (refreshed) {
      // Retry the original request with the new access token cookie
      return doFetch();
    }
  }

  return response;
}
