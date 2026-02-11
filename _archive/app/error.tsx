"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full btn-primary"
          >
            Try again
          </button>
          <a
            href="/login"
            className="block text-center text-blue-600 hover:underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}

