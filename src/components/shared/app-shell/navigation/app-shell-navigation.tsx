import Link from "next/link";
import { NavigationItem } from "@fradelli/ui/navigation-item";
import {
  getNavigationGroupClassName,
  getNavigationGroupTitleClassName,
  getNavigationIconClassName,
  getNavigationItemClassName,
  getNavigationItemsClassName,
  getNavigationLabelClassName,
  getNavigationRootClassName,
} from "./app-shell-navigation.styles";
import type { ShellNavigationProps } from "./navigation.types";
import { getActiveNavigationItem } from "./navigation.utils";

function AppShellNavigation({
  ariaLabel,
  groups,
  pathname,
  presentation,
  onNavigate,
}: ShellNavigationProps) {
  const activeItem = getActiveNavigationItem(pathname, groups);

  return (
    <nav
      aria-label={ariaLabel}
      data-navigation-presentation={presentation}
      className={getNavigationRootClassName(presentation)}
    >
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={
            group.id === "player" ? undefined : `${presentation}-${group.id}`
          }
          className={getNavigationGroupClassName(presentation)}
        >
          {group.id === "player" ? null : (
            <h2
              id={`${presentation}-${group.id}`}
              className={getNavigationGroupTitleClassName(presentation)}
            >
              {group.label}
            </h2>
          )}
          <div className={getNavigationItemsClassName(presentation)}>
            {group.items.map((item) => {
              const isCurrent = activeItem?.id === item.id;

              return (
                <NavigationItem asChild key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isCurrent ? "page" : undefined}
                    title={presentation === "adaptive" ? item.label : undefined}
                    className={getNavigationItemClassName({
                      presentation,
                    })}
                  >
                    <item.Icon
                      className={getNavigationIconClassName(isCurrent)}
                      weight={isCurrent ? "fill" : "regular"}
                      aria-hidden="true"
                    />
                    <span className={getNavigationLabelClassName(presentation)}>
                      {item.label}
                    </span>
                  </Link>
                </NavigationItem>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

export { AppShellNavigation };
