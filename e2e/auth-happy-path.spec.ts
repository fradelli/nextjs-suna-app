import { e2eGoogleCredential, expect, test } from "./fixtures/auth.fixture";

test("keeps the beta notice readable across supported widths", async ({
  page,
}) => {
  await page.goto("/sign-in");

  const betaAlert = page.locator(
    '[data-slot="alert"][aria-labelledby="beta-notice-title"]',
  );
  const betaTitle = betaAlert.locator(':scope > [data-slot="alert-title"]');
  const betaDescription = betaAlert.locator(
    ':scope > [data-slot="alert-description"]',
  );

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ height: 900, width });
    await expect(betaTitle).toBeVisible();
    await expect(betaDescription).toBeVisible();

    const titleBox = await betaTitle.boundingBox();
    const descriptionBox = await betaDescription.boundingBox();

    expect(titleBox).not.toBeNull();
    expect(descriptionBox).not.toBeNull();
    expect(Math.abs(titleBox!.x - descriptionBox!.x)).toBeLessThanOrEqual(1);
    expect(titleBox!.y + titleBox!.height).toBeLessThan(descriptionBox!.y);
  }
});

test("signs in and resumes the authenticated Player area", async ({
  authApi,
  page,
}) => {
  await page.goto("/app");

  await expect(page).toHaveURL(/\/sign-in\?returnTo=%2Fapp$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Entre para continuar" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continuar com Google" }).click();

  await expect
    .poll(() => authApi.googleCredentials)
    .toEqual([e2eGoogleCredential]);
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Seu próximo jogo começa aqui.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Abrir menu da conta de Jogadora E2E",
    }),
  ).toBeVisible();
});
