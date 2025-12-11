"use client";

import FormField from "./FormField";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  hint,
  className = "",
  disabled = false,
}: FormSelectProps) {
  return (
    <FormField label={label} name={name} required={required} error={error} hint={hint}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input-field ${error ? "border-red-500" : ""} ${className}`}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}


