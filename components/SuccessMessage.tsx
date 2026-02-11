interface SuccessMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export default function SuccessMessage({ message, className = "", onDismiss }: SuccessMessageProps) {
  return (
    <div
      className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start justify-between ${className}`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 text-green-500 hover:text-green-700" aria-label="Dismiss">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
