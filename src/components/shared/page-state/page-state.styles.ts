import type { PageStateTone } from "./page-state.types";

const pageStateToneClasses: Record<PageStateTone, string> = {
  neutral: "border-border bg-surface text-muted-foreground",
  info: "border-status-info-border bg-status-info-subtle text-status-info",
  success:
    "border-status-success-border bg-status-success-subtle text-status-success",
  warning:
    "border-status-warning-border bg-status-warning-subtle text-status-warning",
  destructive:
    "border-status-destructive-border bg-status-destructive-subtle text-status-destructive",
};

const pageStateStyles = {
  root: "mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-12 text-center sm:px-8",
  iconContainer:
    "mb-6 flex size-14 items-center justify-center rounded-2xl border",
  icon: "size-7",
  eyebrow: "mb-3 text-sm font-medium text-primary",
  heading: "fd-text-display text-balance",
  description: "fd-text-body mt-4 max-w-xl text-muted-foreground",
  actions:
    "mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row",
} as const;

export { pageStateStyles, pageStateToneClasses };
