interface SkeletonLoaderProps {
  type?: "text" | "card" | "table" | "avatar";
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ type = "text", className = "", count = 1 }: SkeletonLoaderProps) {
  const render = () => {
    switch (type) {
      case "text":
        return <div className={`animate-pulse h-4 bg-gray-200 rounded w-3/4 ${className}`} />;
      case "card":
        return (
          <div className={`animate-pulse bg-white rounded-lg shadow p-6 ${className}`}>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        );
      case "table":
        return (
          <div className={`animate-pulse space-y-3 ${className}`}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        );
      case "avatar":
        return <div className={`animate-pulse h-12 w-12 bg-gray-200 rounded-full ${className}`} />;
      default:
        return null;
    }
  };
  if (count > 1) {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => <div key={i}>{render()}</div>)}
      </div>
    );
  }
  return render();
}
