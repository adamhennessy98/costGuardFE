import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground",
  secondary:
    "bg-muted text-foreground hover:bg-foreground/10 focus-visible:ring-foreground/30",
  ghost: "text-foreground hover:bg-foreground/10 focus-visible:ring-foreground/20",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
