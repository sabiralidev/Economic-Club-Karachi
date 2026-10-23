import type { ReactNode } from "react";

type FormFieldProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

export function FormField({ children, error, hint, id, label }: FormFieldProps) {
  const descriptionId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-brand-purple" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-sm text-brand-ink/65" id={descriptionId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-700" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
