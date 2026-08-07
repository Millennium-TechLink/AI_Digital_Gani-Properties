import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    // Was a bare <select> with no custom arrow, relying entirely on
    // whatever the browser draws natively - on a wide box (this is w-full,
    // and every caller stretches it across a flex row with no flex-basis
    // of its own) that arrow ends up sitting far from the text, out at the
    // edge of mostly empty space, which is what read as "stuck in the
    // corner". appearance-none removes the native one so this ChevronDown
    // - positioned a fixed 16px from the edge - is the only one that ever
    // renders, regardless of how wide the box gets. w-full on the wrapper
    // div (not just the <select>) matters too: this div is now the actual
    // flex/grid child everywhere Select is used, so without it explicitly
    // filling its container the way the bare <select> used to, callers
    // that relied on it stretching (FiltersBar's row, the grid-cols-2
    // form fields in Dashboard) would end up sized to content instead.
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-2xl border border-gp-ink/20 bg-white px-4 pr-10 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gp-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gp-ink-muted" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
