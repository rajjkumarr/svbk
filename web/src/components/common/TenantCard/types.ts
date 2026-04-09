import type { ReactNode } from "react";

export interface TenantCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export interface TenantCardHeaderProps {
  title: string;
  subtitle?: string;
  showCheckmark?: boolean;
  className?: string;
}

export interface TenantCardContentProps {
  children: ReactNode;
  className?: string;
}

export interface TenantCardFieldProps {
  label: string;
  value: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
