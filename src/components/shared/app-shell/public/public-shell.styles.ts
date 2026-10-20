import { cn } from "@fradelli/ui/cn";

const publicShellStyles = {
  root: "min-h-screen text-foreground",
  header: cn("fd-surface-glass-elevated border-b text-foreground"),
  headerContent:
    "mx-auto flex min-h-18 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8",
  navigation: "ml-auto flex items-center gap-1 sm:gap-2",
  exploreText: "hidden sm:inline",
  exploreTextMobile: "sr-only sm:hidden",
  authActionSkeleton: "h-8 w-16",
  sessionBadge: "max-w-44 truncate",
} as const;

export { publicShellStyles };
