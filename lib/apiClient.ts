import { handleApiError } from "./utils/errors";

interface ApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseUrl: string = "";

  async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { timeout = 30000, retries = 0, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(endpoint, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(1000);
        return this.request<T>(endpoint, { ...options, retries: retries - 1 });
      }

      const { message } = handleApiError(error);
      throw new Error(message);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes("timeout") ||
        error.message.includes("network") ||
        error.message.includes("fetch")
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();


