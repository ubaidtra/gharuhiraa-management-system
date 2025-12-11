interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "warning" | "success";
}

export default function InfoCard({
  title,
  children,
  icon,
  className = "",
  variant = "default",
}: InfoCardProps) {
  const variantClasses = {
    default: "bg-white border-gray-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-orange-50 border-orange-200",
    success: "bg-green-50 border-green-200",
  };

  return (
    <div className={`card border-2 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start">
        {icon && <div className="mr-3 mt-1 flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
}


