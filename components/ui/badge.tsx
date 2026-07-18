import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-spy-amber/40 bg-spy-amber/10 px-2.5 py-0.5 text-xs font-semibold text-spy-amber",
        className
      )}
      {...props}
    />
  );
}
