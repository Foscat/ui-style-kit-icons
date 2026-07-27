import assert from "node:assert/strict";
import { packs } from "../dist/registry.js";

const companionStylesheets = [
  "https://unpkg.com/ui-style-kit-css@2.1.0/dist/ui-style-kit.visual.min.css",
  "https://unpkg.com/ui-style-kit-css@2.1.0/styles/interactive-surface-theme.css",
  "https://unpkg.com/interactive-surface-css@1.5.0/state-core.css",
  "https://unpkg.com/layout-style-css@2.1.0/dist/layout-style-css.min.css"
];
const packLayoutMappings = new Map(
  packs.map((pack) => [
    pack.id,
    { layout: pack.layoutStyle, ui: pack.uiStyle }
  ])
);

export async function assertDemoEcosystemOwnership(page) {
  const ownership = await page.evaluate(() => {
    const activeMode = document.querySelector(
      "[data-mode-value][aria-pressed='true']"
    );
    const inactiveMode = document.querySelector(
      "[data-mode-value][aria-pressed='false']"
    );
    const card = document.querySelector(".icon-card.interactive-surface");
    const demoSheet = [...document.styleSheets].find((sheet) =>
      sheet.href?.endsWith("/demo.css")
    );
    const layerSheet = [...document.styleSheets].find(
      (sheet) => sheet.ownerNode?.tagName === "STYLE"
    );

    return {
      stylesheetHrefs: [...document.styleSheets]
        .map((sheet) => sheet.href)
        .filter(Boolean),
      declaredLayers: layerSheet?.cssRules[0]?.cssText ?? "",
      demoLayer: demoSheet?.cssRules[0]?.name ?? "",
      bodyBackgroundImage: getComputedStyle(document.body).backgroundImage,
      appDisplay: getComputedStyle(
        document.querySelector(".app-layout.ly-sidebar")
      ).display,
      galleryDisplay: getComputedStyle(
        document.querySelector(".icon-grid:not(.ly-grid)")
      ).display,
      personalityDisplay: getComputedStyle(
        document.querySelector(".ecosystem-grid.ly-grid")
      ).display,
      cardBackground: getComputedStyle(card).backgroundColor,
      cardPosition: getComputedStyle(card).position,
      cardStateLayerContent: getComputedStyle(card, "::before").content,
      activeMode: surfaceState(activeMode),
      inactiveMode: surfaceState(inactiveMode),
      extrasDisabled: document.querySelector("#extrasToggle")?.disabled
    };

    function surfaceState(element) {
      return {
        level: element?.getAttribute("data-surface-level"),
        variant: element?.getAttribute("data-surface-variant")
      };
    }
  });

  assert.deepEqual(
    ownership.stylesheetHrefs.slice(0, companionStylesheets.length),
    companionStylesheets
  );
  assert.match(
    ownership.stylesheetHrefs.at(-2) ?? "",
    /\/dist\/ui-style-kit-icons\.css$/u
  );
  assert.match(ownership.stylesheetHrefs.at(-1) ?? "", /\/demo\.css$/u);
  assert.match(
    ownership.declaredLayers,
    /@layer demo, ui-style-kit, ly;/u
  );
  assert.equal(ownership.demoLayer, "demo");
  assert.notEqual(ownership.bodyBackgroundImage, "none");
  assert.equal(ownership.appDisplay, "flex");
  assert.equal(ownership.galleryDisplay, "grid");
  assert.equal(ownership.personalityDisplay, "grid");
  assert.notEqual(ownership.cardBackground, "rgba(0, 0, 0, 0)");
  assert.equal(ownership.cardPosition, "relative");
  assert.equal(ownership.cardStateLayerContent, '""');
  assert.deepEqual(ownership.activeMode, {
    level: "3",
    variant: "primary"
  });
  assert.deepEqual(ownership.inactiveMode, {
    level: "1",
    variant: "subtle"
  });
  assert.equal(ownership.extrasDisabled, true);

  await assertSkipLinkBehavior(page);

  const activeModeValue = await page
    .locator("[data-mode-value][aria-pressed='true']")
    .getAttribute("data-mode-value");
  const alternateMode = activeModeValue === "light" ? "dark" : "light";

  await page.locator(`[data-mode-value="${alternateMode}"]`).click();
  await assertPressedSurfaceState(page, alternateMode);
  await page.locator(`[data-mode-value="${activeModeValue}"]`).click();
  await assertPressedSurfaceState(page, activeModeValue);

  const card = page.locator(".icon-card.interactive-surface").first();

  await page.keyboard.press("Tab");
  await card.focus();
  const focusState = await card.evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      focusVisible: element.matches(":focus-visible"),
      outlineStyle: styles.outlineStyle,
      outlineWidth: Number.parseFloat(styles.outlineWidth)
    };
  });

  assert.equal(focusState.focusVisible, true);
  assert.equal(focusState.outlineStyle, "solid");
  assert.ok(
    focusState.outlineWidth >= 2,
    `Interactive Surface focus ring is ${focusState.outlineWidth}px.`
  );

  await card.evaluate((element) => element.blur());
  const hoverOpacityBefore = await card.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element, "::before").opacity)
  );
  await card.hover();
  await page.waitForTimeout(200);
  const hoverOpacityAfter = await card.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element, "::before").opacity)
  );

  assert.ok(
    hoverOpacityAfter > hoverOpacityBefore,
    `Interactive Surface hover opacity did not increase: ${hoverOpacityBefore} to ${hoverOpacityAfter}.`
  );
  await page.mouse.move(0, 0);

  await assertLayoutPersonalityIsolation(page);
  await assertPackLayoutMappings(page);
}

async function assertSkipLinkBehavior(page) {
  const shell = page.locator(".skip-link-shell");
  const link = shell.locator(".interactive-surface");
  const resting = await shell.boundingBox();

  assert.ok(resting, "Skip-link geometry is unavailable.");
  assert.ok(
    resting.y + resting.height <= 0,
    `Skip link is visible without focus: ${JSON.stringify(resting)}.`
  );

  await link.focus();
  const focused = await shell.boundingBox();

  assert.ok(focused, "Focused skip-link geometry is unavailable.");
  assert.ok(
    focused.y >= 0,
    `Skip link did not enter the viewport on focus: ${JSON.stringify(focused)}.`
  );
  await link.evaluate((element) => element.blur());
}

async function assertPressedSurfaceState(page, mode) {
  await page.waitForFunction(
    (expectedMode) => document.body.dataset.mode === expectedMode,
    mode
  );
  const states = await page.evaluate(() =>
    [...document.querySelectorAll("[data-mode-value]")].map((button) => ({
      value: button.getAttribute("data-mode-value"),
      pressed: button.getAttribute("aria-pressed"),
      level: button.getAttribute("data-surface-level"),
      variant: button.getAttribute("data-surface-variant")
    }))
  );

  for (const state of states) {
    const active = state.value === mode;

    assert.equal(state.pressed, String(active));
    assert.equal(state.level, active ? "3" : "1");
    assert.equal(state.variant, active ? "primary" : "subtle");
  }
}

async function assertLayoutPersonalityIsolation(page) {
  const originalPack = await page.locator("#packSelect").inputValue();

  await selectPack(page, "minimal-saas");
  const minimal = await measureDemoLayout(page);
  await selectPack(page, "cyberpunk");
  const cyberpunk = await measureDemoLayout(page);
  await selectPack(page, originalPack);

  const stableGallery = Math.max(
    Math.abs(minimal.sidebarWidth - cyberpunk.sidebarWidth),
    Math.abs(minimal.galleryWidth - cyberpunk.galleryWidth),
    Math.abs(minimal.firstCardWidth - cyberpunk.firstCardWidth)
  );
  const personalityGrid = Math.max(
    ...minimal.ecosystemWidths.map((width, index) =>
      Math.abs(width - cyberpunk.ecosystemWidths[index])
    )
  );

  assert.ok(
    stableGallery <= 1,
    `Pack switching moved stable lab geometry by ${stableGallery}px.`
  );
  assert.notEqual(minimal.gridMinimum, cyberpunk.gridMinimum);
  assert.ok(
    personalityGrid >= 24,
    `Layout personality changed the ecosystem grid by only ${personalityGrid}px.`
  );
}

async function assertPackLayoutMappings(page) {
  const originalPack = await page.locator("#packSelect").inputValue();

  for (const [pack, expected] of packLayoutMappings) {
    await selectPack(page, pack);
    const state = await page.evaluate(() => ({
      layout: document.body.dataset.lyLayout,
      pack: document.body.dataset.iconPack,
      ui: document.body.dataset.ui
    }));

    assert.deepEqual(state, {
      layout: expected.layout,
      pack,
      ui: expected.ui
    });
  }

  await selectPack(page, originalPack);
}

async function selectPack(page, pack) {
  await page.selectOption("#packSelect", pack);
  await page.waitForFunction(
    (expectedPack) =>
      document.body.dataset.iconPack === expectedPack &&
      document.querySelector(".icon-card usk-icon")?.dataset.pack ===
        expectedPack,
    pack
  );
}

async function measureDemoLayout(page) {
  return page.evaluate(() => {
    const rect = (selector) =>
      document.querySelector(selector).getBoundingClientRect();

    return {
      sidebarWidth: rect(".control-rail.ly-stack").width,
      galleryWidth: rect(".icon-grid:not(.ly-grid)").width,
      firstCardWidth: rect(".icon-grid .icon-card").width,
      gridMinimum: getComputedStyle(document.body)
        .getPropertyValue("--ly-grid-min")
        .trim(),
      ecosystemWidths: [
        ...document.querySelectorAll(".ecosystem-grid.ly-grid > *")
      ].map((element) => element.getBoundingClientRect().width)
    };
  });
}
