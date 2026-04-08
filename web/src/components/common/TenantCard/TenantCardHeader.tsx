import { cn } from "@/lib/utils";
import type { TenantCardHeaderProps } from "./types";

/**
 * TenantCardHeader - Header section of TenantCard with title and optional checkmark
 */
export function TenantCardHeader({
  title,
  subtitle,
  showCheckmark = false,
  className,
}: TenantCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-2", className)}>
      <div>
        <p className="text-lg font-semibold text-[var(--app-text-primary)]">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--app-text-secondary)]">{subtitle}</p>
        )}
      </div>
      {showCheckmark && (
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background flex-shrink-0"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </div>
  );
}
