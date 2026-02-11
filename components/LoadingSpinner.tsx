interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-8 h-8 border-2", lg: "w-12 h-12 border-3" };
  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}
