import type { HttpClient, HttpRequestOptions } from './interfaces';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface FetchHttpClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
  fetchImpl?: typeof fetch;
}

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => string | null;
  private readonly fetchImpl: typeof fetch;

  constructor(config: FetchHttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.getToken = config.getToken;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const token = this.getToken?.();
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    };

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const errorBody = (await response.json()) as { message?: string; detail?: string };
        message = errorBody.message ?? errorBody.detail ?? message;
      } catch {
        // Keep HTTP status fallback when response is not JSON.
      }
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  }
}
