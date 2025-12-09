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

