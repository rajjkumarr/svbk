import { cn } from "@/lib/utils";
import type { TenantCardProps } from "./types";

/**
 * TenantCard - Composable card component for tenants
 * 
 * Usage:
 * ```tsx
 * <TenantCard isSelected={true} onClick={handleSelect}>
 *   <TenantCardHeader title="School Name" subtitle="Campus" showCheckmark />
 *   <TenantCardContent>
 *     <TenantCardField label="Code" value="TNT001" />
 *   </TenantCardContent>
 * </TenantCard>
 * ```
 */
export function TenantCard({
  isSelected = false,
  onClick,
  className,
  children,
}: TenantCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group text-left rounded-xl border p-4 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60",
        isSelected
          ? "border-foreground bg-[var(--app-card-bg)] shadow-lg"
          : "border-zinc-200 bg-white hover:border-foreground",
        className
      )}
      style={{
        boxShadow: isSelected ? "0 0 0 2px var(--app-brand)" : undefined,
      }}
    >
      {children}
    </button>
  );
}
