import { appConfig } from '../config/appConfig';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

function buildUrl(path: string): string | null {
  const baseUrl = appConfig.apiBaseUrl.trim();
  if (!baseUrl) {
    return null;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function logApiError(context: string, message: string): void {
  if (__DEV__) {
    console.warn(`[ATMO API] ${context}: ${message}`);
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  const url = buildUrl(path);
  if (!url) {
    const error = 'API base URL is not configured';
    logApiError(method, error);
    return { ok: false, error };
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const payload = await parseJsonResponse(response);

    if (!response.ok) {
      const error =
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof (payload as { message?: unknown }).message === 'string'
          ? (payload as { message: string }).message
          : `Request failed with status ${response.status}`;

      logApiError(method, error);
      return { ok: false, error, status: response.status };
    }

    return { ok: true, data: payload as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    logApiError(method, message);
    return { ok: false, error: message };
  }
}

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>('GET', path);
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<ApiResult<TResponse>> {
  return request<TResponse>('POST', path, body);
}
