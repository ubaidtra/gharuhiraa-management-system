export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    );
  }
  return false;
}

export function handleApiError(error: unknown): { message: string; retryable: boolean } {
  if (isNetworkError(error)) {
    return {
      message: "Network error. Please check your connection and try again.",
      retryable: true,
    };
  }

  const message = getErrorMessage(error);
  return {
    message,
    retryable: false,
  };
}

export function isRedirectError(error: unknown): boolean {
  if (!error) return false;
  
  if (error === "NEXT_REDIRECT") return true;
  
  const errorAny = error as any;
  
  if (errorAny?.digest) {
    const digest = String(errorAny.digest);
    if (digest.startsWith("NEXT_REDIRECT") || digest.includes("NEXT_REDIRECT")) {
      return true;
    }
  }
  
  if (errorAny?.message) {
    const message = String(errorAny.message);
    if (message === "NEXT_REDIRECT" || message.includes("NEXT_REDIRECT")) {
      return true;
    }
  }
  
  if (errorAny?.name === "RedirectError" || errorAny?.name === "NEXT_REDIRECT") {
    return true;
  }
  
  const errorString = String(error);
  if (errorString === "NEXT_REDIRECT" || errorString.includes("NEXT_REDIRECT")) {
    return true;
  }
  
  if (error instanceof Error && error.constructor.name === "RedirectError") {
    return true;
  }
  
  return false;
}






