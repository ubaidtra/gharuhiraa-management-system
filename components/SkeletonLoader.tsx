interface SkeletonLoaderProps {
  type?: "text" | "card" | "table" | "avatar";
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ 
  type = "text", 
  className = "", 
  count = 1 
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        );
      case "card":
        return (
          <div className={`animate-pulse bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        );
      case "table":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        );
      case "avatar":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
}


