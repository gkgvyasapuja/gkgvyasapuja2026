import React from "react";

interface FormFieldProps {
  label: string;
  subLabel?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  subLabel,
  required,
  children,
  className = "space-y-3",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="text-base font-medium text-white flex flex-col gap-0.5">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {subLabel && (
          <span className="text-sm text-gray-400 font-normal">{subLabel}</span>
        )}
      </label>
      {children}
    </div>
  );
}
