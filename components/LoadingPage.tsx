import LoadingSpinner from "./LoadingSpinner";

export default function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
}
