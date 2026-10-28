import type { ButtonHTMLAttributes, ComponentProps } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "onDark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-sm font-semibold transition duration-200 ease-out-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-deep disabled:pointer-events-none disabled:opacity-55";

const variantClasses: Record<ButtonVariant, string> = {
  // Teal call-to-action — the primary accent on both light and dark sections.
  primary: "bg-brand-teal text-brand-purple hover:bg-white hover:shadow-[0_14px_32px_-16px_rgba(33,22,47,0.65)]",
  // Deep purple call-to-action for light surfaces.
  dark: "bg-brand-purple text-white hover:bg-brand-ink",
  // Quiet bordered button for light surfaces.
  outline: "border border-brand-purple/20 bg-white text-brand-purple hover:border-brand-purple hover:bg-white",
  // Text-only affordance.
  ghost: "text-brand-purple hover:bg-brand-purple/[0.06]",
  // Border button tuned for dark sections.
  onDark: "border border-white/25 bg-transparent text-white hover:border-white hover:bg-white hover:text-brand-purple",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-xs",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-sm sm:text-base",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({ className = "", variant = "primary", size = "md", ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
