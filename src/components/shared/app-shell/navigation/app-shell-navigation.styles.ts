import { cn } from "@fradelli/ui/cn";
import type { ShellNavigationPresentation } from "./navigation.types";

type NavigationItemClassNameOptions = Readonly<{
  presentation: ShellNavigationPresentation;
}>;

function getNavigationRootClassName(presentation: ShellNavigationPresentation) {
  return cn(
    presentation === "bottom" &&
      cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1",
        "fd-surface-glass-elevated border-t text-foreground",
        "px-[max(0.375rem,env(safe-area-inset-left))] pt-1.5",
        "pb-[calc(0.375rem+env(safe-area-inset-bottom))]",
        "md:hidden",
      ),
    presentation === "adaptive" &&
      "flex h-full flex-col gap-5 px-2 py-4 lg:px-4",
    presentation === "drawer" && "flex flex-col gap-6 px-5 pb-8",
  );
}

function getNavigationGroupClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    presentation === "bottom" && "contents",
    presentation === "adaptive" && "grid gap-1.5",
    presentation === "drawer" && "grid gap-2",
  );
}

function getNavigationGroupTitleClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    "text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase",
    presentation === "adaptive" && "sr-only lg:not-sr-only lg:px-3",
  );
}

function getNavigationItemsClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    presentation === "bottom" && "contents",
    presentation !== "bottom" && "grid gap-1",
  );
}

function getNavigationItemClassName({
  presentation,
}: NavigationItemClassNameOptions) {
  return cn(
    presentation === "bottom" &&
      "min-h-14 min-w-0 flex-col gap-1 px-1 py-1.5 text-xs",
    presentation === "adaptive" && "min-h-12 lg:justify-start",
    presentation === "drawer" && "min-h-12 justify-start",
  );
}

function getNavigationIconClassName(isCurrent: boolean) {
  return cn("size-5 shrink-0", isCurrent && "text-primary-foreground");
}

function getNavigationLabelClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    "text-center break-words",
    presentation === "adaptive" && "sr-only lg:not-sr-only",
  );
}

export {
  getNavigationGroupClassName,
  getNavigationGroupTitleClassName,
  getNavigationIconClassName,
  getNavigationItemClassName,
  getNavigationItemsClassName,
  getNavigationLabelClassName,
  getNavigationRootClassName,
};
