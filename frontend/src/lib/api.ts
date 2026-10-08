export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data?: unknown;

  constructor(message: string, status: number, statusText: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private customFetch: typeof fetch;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL ?? '/api';
    this.defaultHeaders = config.headers ?? {};
    this.customFetch =
      config.fetch ??
      (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : (null as unknown as typeof fetch));
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const base = this.baseURL.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    const urlString = cleanPath ? `${base}/${cleanPath}` : base;

    if (!params) {
      return urlString;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }

    const qs = searchParams.toString();
    return qs ? `${urlString}?${qs}` : urlString;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers, ...restOptions } = options;
    const url = this.buildUrl(path, params);

    const mergedHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...this.defaultHeaders,
      ...(headers as Record<string, string>),
    };

    let serializedBody: BodyInit | undefined;
    if (body !== undefined) {
      if (
        typeof body === 'string' ||
        body instanceof Blob ||
        body instanceof FormData ||
        body instanceof URLSearchParams
      ) {
        serializedBody = body as BodyInit;
      } else {
        serializedBody = JSON.stringify(body);
        if (!mergedHeaders['Content-Type']) {
          mergedHeaders['Content-Type'] = 'application/json';
        }
      }
    }

    const response = await this.customFetch(url, {
      ...restOptions,
      headers: mergedHeaders,
      body: serializedBody,
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : undefined;
      } catch {
        errorData = undefined;
      }

      const errorMessage =
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData &&
        typeof (errorData as Record<string, unknown>).message === 'string'
          ? ((errorData as Record<string, unknown>).message as string)
          : `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError(errorMessage, response.status, response.statusText, errorData);
    }

    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as unknown as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body' | 'method'>
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body' | 'method'>
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body' | 'method'>
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export const createApiClient = (config?: ApiClientConfig): ApiClient => new ApiClient(config);
