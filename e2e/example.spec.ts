import { test, expect, _electron } from "@playwright/test";

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>;

test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ["."],
    env: { NODE_ENV: "development" },
  });
  mainPage = await electronApp.firstWindow();
});

test.afterEach(async () => {
  await electronApp.close();
});

test("window has correct title", async () => {
  const title = await mainPage.title();
  expect(title).toContain("Electron");
});

test("custom frame should minimize the window", async () => {
  await mainPage.click("#minimize");
  const isMinimized = await electronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMinimized();
  });
  expect(isMinimized).toBe(true);
});

test("custom frame should maximize and unmaximize the window", async () => {
  await mainPage.click("#maximize");
  let isMaximized = await electronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMaximized();
  });
  expect(isMaximized).toBe(true);
  // Unmaximize
  await mainPage.click("#maximize");
  isMaximized = await electronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMaximized();
  });
  expect(isMaximized).toBe(false);
});

test("main UI elements are visible", async () => {
  await expect(
    mainPage.getByRole("heading", { name: /Electron \+ React/i })
  ).toBeVisible();
  await expect(mainPage.getByText(/System Info/i)).toBeVisible();
  await expect(mainPage.getByText(/CPU Usage/i)).toBeVisible();
  await expect(mainPage.getByText(/RAM Usage/i)).toBeVisible();
  await expect(mainPage.getByText(/Storage Usage/i)).toBeVisible();
  await expect(mainPage.getByText(/Developer Tools/i)).toBeVisible();
});

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
