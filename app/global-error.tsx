"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Application error</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button onClick={reset} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
