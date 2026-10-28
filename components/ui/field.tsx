import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Shared control styling so every form field across the site stays visually identical.
 * Uses a 1px hairline border with a teal focus ring tuned for the paper background.
 */
export const controlClasses =
  "w-full min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 py-3 text-sm font-normal text-brand-ink outline-none transition duration-200 ease-out-soft placeholder:text-brand-ink/40 focus:border-brand-teal-deep focus:ring-2 focus:ring-brand-teal-deep/15 disabled:cursor-not-allowed disabled:opacity-60";

export const controlInvalidClasses = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClasses} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClasses} resize-y leading-6 ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${controlClasses} appearance-none bg-white pr-10 ${className}`} {...props} />;
}

type FieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Label + control + error message wrapper. Mirrors the `id`-based
 * `aria-describedby` contract used by every form in the app.
 */
export function Field({ className = "", children, error, hint, id, label }: FieldProps) {
  return (
    <div className={`grid gap-2 text-sm font-semibold text-brand-purple ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <span className="text-xs font-normal text-red-700" id={`${id}-error`}>{error}</span>
      ) : hint ? (
        <span className="text-xs font-normal text-brand-ink/55">{hint}</span>
      ) : null}
    </div>
  );
}
