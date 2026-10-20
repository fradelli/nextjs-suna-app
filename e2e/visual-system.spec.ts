import { e2eAuthSession, expect, test } from "./fixtures/auth.fixture";

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
] as const;

test("keeps the visual foundation stable across target viewports", async ({
  page,
}) => {
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Encontre quadras, partidas e gente para jogar.",
      }),
    ).toBeVisible();

    const foundation = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const heading = document.querySelector("h1");

      return {
        primary: rootStyles.getPropertyValue("--fd-color-primary").trim(),
        fontSans: rootStyles.getPropertyValue("--fd-font-family-sans").trim(),
        headingFont: heading ? getComputedStyle(heading).fontFamily : "",
        horizontalOverflow:
          document.documentElement.scrollWidth - window.innerWidth,
        radius: rootStyles.getPropertyValue("--fd-radius-xl").trim(),
        surface: rootStyles.getPropertyValue("--fd-color-surface").trim(),
        successSubtle: rootStyles
          .getPropertyValue("--fd-color-status-success-subtle")
          .trim(),
      };
    });

    expect(foundation.radius).toBe("16px");
    expect(foundation.fontSans).toContain("Inter");
    expect(foundation.headingFont).toContain("Inter");
    expect(foundation.primary).toBe("#f2cf63");
    expect(foundation.surface).toBe("#141416");
    expect(foundation.successSubtle).toBeTruthy();
    expect(foundation.horizontalOverflow).toBeLessThanOrEqual(0);
  }
});

test("keeps semantic text pairs at WCAG AA contrast in the shared dark palette", async ({
  page,
}) => {
  await page.goto("/");

  const ratios = await page.evaluate(() => {
    const pairs = [
      ["foreground", "background"],
      ["foreground", "surface"],
      ["primary-foreground", "primary"],
      ["status-success-foreground", "status-success-solid"],
      ["status-success-solid", "status-success-subtle"],
      ["status-warning-foreground", "status-warning-solid"],
      ["status-warning-solid", "status-warning-subtle"],
      ["status-info-foreground", "status-info-solid"],
      ["status-info-solid", "status-info-subtle"],
      ["status-destructive-foreground", "status-destructive-solid"],
      ["status-destructive-solid", "status-destructive-subtle"],
    ] as const;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    canvas.width = 1;
    canvas.height = 1;

    function toRgb(color: string) {
      context!.clearRect(0, 0, 1, 1);
      context!.fillStyle = color;
      context!.fillRect(0, 0, 1, 1);
      return Array.from(context!.getImageData(0, 0, 1, 1).data.slice(0, 3));
    }

    function luminance([red, green, blue]: number[]) {
      const [r, g, b] = [red, green, blue].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    return ["dark"].flatMap((theme) => {
      const styles = getComputedStyle(document.documentElement);

      return pairs.map(([foreground, background]) => {
        const foregroundLuminance = luminance(
          toRgb(styles.getPropertyValue(`--fd-color-${foreground}`).trim()),
        );
        const backgroundLuminance = luminance(
          toRgb(styles.getPropertyValue(`--fd-color-${background}`).trim()),
        );
        const lighter = Math.max(foregroundLuminance, backgroundLuminance);
        const darker = Math.min(foregroundLuminance, backgroundLuminance);

        return {
          pair: `${theme}:${foreground}/${background}`,
          ratio: (lighter + 0.05) / (darker + 0.05),
        };
      });
    });
  });

  for (const { pair, ratio } of ratios) {
    expect(ratio, pair).toBeGreaterThanOrEqual(4.5);
  }
});

test("preserves Card geometry and transparency opt-out on real screens", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator('[data-slot="card"]');
  await expect(cards).toHaveCount(4);
  const geometry = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element);
      return {
        size: element.getAttribute("data-size"),
        padding: styles.padding,
        radius: styles.borderRadius,
      };
    }),
  );
  for (const card of geometry) {
    expect(card.padding).toBe(card.size === "sm" ? "16px" : "24px");
    expect(card.radius).toBe("16px");
  }
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-fd-transparency", "reduce"),
  );
  await expect(cards.first()).toHaveCSS("backdrop-filter", "none");
  await expect(cards.first()).toHaveCSS("background-color", "rgb(20, 20, 22)");
});

const MIGRATED_ROUTES = [
  "/",
  "/discovery",
  "/sign-in",
  "/player",
  "/app",
  "/app/courts",
  "/app/reservations",
  "/app/open-matches",
  "/app/profile",
  "/organizations/arena-sul",
  "/organizations/arena-sul/calendar",
  "/organizations/arena-sul/calendar/configuration",
  "/organizations/arena-sul/courts",
  "/organizations/arena-sul/reservations",
  "/organizations/arena-sul/payments",
  "/organizations/arena-sul/profile",
  "/prototypes/player-profile-onboarding",
  "/prototypes/brand",
];

for (const viewport of VIEWPORTS) {
  test(`keeps every migrated route readable at ${viewport.width}px`, async ({
    authApi,
    page,
  }) => {
    test.setTimeout(120_000);
    authApi.setSession(e2eAuthSession);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of MIGRATED_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1").first(), route).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(overflow, `${viewport.width}px:${route}`).toBeLessThanOrEqual(0);
      if (
        [
          "/",
          "/sign-in",
          "/prototypes/player-profile-onboarding",
          "/app",
        ].includes(route)
      ) {
        const name =
          route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
        await page.screenshot({
          path: `test-results/fradelli-${name}-${viewport.width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("reflows long content and preserves the safe action and focus in native confirmation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/prototypes/player-profile-onboarding");
  await page
    .getByRole("textbox", { name: "Nome de exibição" })
    .fill("Nome de exibição longo para validar o formulário");
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  const confirmation = page.getByRole("alertdialog");
  await expect(confirmation).toBeVisible();
  const cancel = confirmation.locator("[data-alert-dialog-cancel]");
  await expect(cancel).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(confirmation).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Sair", exact: true }),
  ).toBeFocused();
});

test("keeps zoomed content usable in forced colors", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  for (const route of ["/", "/prototypes/player-profile-onboarding"]) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    );
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expect(page.locator("h1").first()).toBeVisible();
});
