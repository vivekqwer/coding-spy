import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-spy-gradient text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)] hover:brightness-110",
  secondary: "bg-card text-foreground border border-border hover:border-spy-cyan/50",
  outline: "border border-border bg-transparent hover:bg-card/60",
  ghost: "bg-transparent hover:bg-card/60",
  destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9",
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spy-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
