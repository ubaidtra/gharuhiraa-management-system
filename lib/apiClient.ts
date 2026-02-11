import { handleApiError } from "./utils/errors";

interface ApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiClient {
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { timeout = 30000, retries = 0, ...fetchOptions } = options;
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(endpoint, {
        ...fetchOptions,
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(fetchOptions.headers as object) },
      });
      clearTimeout(tid);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      clearTimeout(tid);
      if (e instanceof Error && e.name === "AbortError") throw new Error("Request timeout");
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 1000));
        return this.request<T>(endpoint, { ...options, retries: retries - 1 });
      }
      throw new Error(handleApiError(e).message);
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: "POST", body: data ? JSON.stringify(data) : undefined });
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: "PUT", body: data ? JSON.stringify(data) : undefined });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
