import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-purple-600 text-white hover:bg-purple-500",
  secondary: "bg-neutral-700 text-neutral-100 hover:bg-neutral-600",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-medium transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
