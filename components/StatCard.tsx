interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  color?: "blue" | "green" | "red" | "purple" | "orange";
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  className = "",
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  const valueColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className={`card border-2 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
          <p className={`text-3xl font-bold ${valueColorClasses[color]}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value} {trend.label}
            </p>
          )}
        </div>
        {icon && <div className={`${valueColorClasses[color]} opacity-50`}>{icon}</div>}
      </div>
    </div>
  );
}

