import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gp-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
      {
        "bg-gp-accent text-white hover:bg-gp-gold hover:shadow-lg hover:scale-105 hover:-translate-y-0.5": variant === "default",
        "border border-gp-accent text-gp-accent bg-transparent hover:bg-gp-accent/10 hover:border-gp-gold hover:scale-105": variant === "outline",
        "text-gp-accent hover:bg-gp-accent/10 hover:scale-105": variant === "ghost",
        "h-11 px-6 text-base": size === "default",
        "h-9 px-4 text-sm": size === "sm",
        "h-14 px-8 text-lg": size === "lg",
      },
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as any, {
        className: cn(buttonClasses, (children as any).props?.className),
        ...props,
      } as any);
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
