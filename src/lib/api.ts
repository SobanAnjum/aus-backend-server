/// <reference types="vite/client" />

// Central API Configuration & Helper for Vercel / Heroku deployment

export const API_BASE_URL: string = (
  (import.meta as any).env?.VITE_API_URL ||
  (typeof process !== 'undefined' ? process.env?.VITE_API_URL : '') ||
  ''
).replace(/\/+$/, '');

/**
 * Returns full URL for an API endpoint.
 * In local dev (when VITE_API_URL is empty), returns relative path e.g. "/api/appointments".
 * In production (when VITE_API_URL is "https://your-api.herokuapp.com"), returns "https://your-api.herokuapp.com/api/appointments".
 */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Standard fetch wrapper that automatically handles:
 * - Prepending the base API URL
 * - Attaching Supabase Bearer auth token if user is logged in
 * - Setting default JSON headers
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(path);
  const headers = new Headers(options.headers || {});

  // Set Content-Type to JSON if not specified and not FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData) && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Supabase / Auth Token if present
  const token = (window as any).firebaseToken || (typeof localStorage !== 'undefined' ? (localStorage.getItem('supabase_token') || localStorage.getItem('idToken')) : null);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (_) {}
    throw new Error(errorMessage);
  }

  // Return parsed JSON or true for 204 No Content
  if (response.status === 204) {
    return true as any;
  }

  return response.json();
}
