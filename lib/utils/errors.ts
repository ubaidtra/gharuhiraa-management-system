export class AppError extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export function handleApiError(error: unknown): { message: string; retryable: boolean } {
  if (error instanceof Error && /fetch|network/i.test(error.message)) {
    return { message: "Network error. Please check your connection.", retryable: true };
  }
  return { message: getErrorMessage(error), retryable: false };
}

export function isRedirectError(error: unknown): boolean {
  if (!error) return false;
  if (error === "NEXT_REDIRECT") return true;
  const e = error as { digest?: string; message?: string; name?: string };
  if (e.digest?.includes("NEXT_REDIRECT")) return true;
  if (e.message?.includes("NEXT_REDIRECT")) return true;
  if (e.name === "RedirectError") return true;
  return String(error).includes("NEXT_REDIRECT");
}
