"use client";

import FormField from "./FormField";

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  hint,
  maxLength,
  rows = 4,
  className = "",
  disabled = false,
  placeholder,
}: FormTextareaProps) {
  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <FormField label={label} name={name} required={required} error={error} hint={hint}>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`input-field ${error ? "border-red-500" : ""} ${className}`}
        required={required}
      />
      {maxLength && (
        <p className={`mt-1 text-xs ${remainingChars && remainingChars < 50 ? "text-orange-600" : "text-gray-500"}`}>
          {remainingChars !== null ? `${remainingChars} characters remaining` : ""}
        </p>
      )}
    </FormField>
  );
}


