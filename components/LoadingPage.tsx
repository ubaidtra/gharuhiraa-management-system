import LoadingSpinner from "./LoadingSpinner";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
}


