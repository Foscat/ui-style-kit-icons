import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const uiPackage = require("ui-style-kit-css/package.json");
const interactivePackage = require("interactive-surface-css/package.json");
const layoutPackage = require("layout-style-css/package.json");
const stylesheetRoutes = [
  {
    url: `https://unpkg.com/ui-style-kit-css@${uiPackage.version}/dist/ui-style-kit.visual.min.css`,
    path: require.resolve("ui-style-kit-css/visual.min.css")
  },
  {
    url: `https://unpkg.com/ui-style-kit-css@${uiPackage.version}/styles/interactive-surface-theme.css`,
    path: require.resolve("ui-style-kit-css/interactive-surface-theme.css")
  },
  {
    url: `https://unpkg.com/interactive-surface-css@${interactivePackage.version}/state-core.css`,
    path: require.resolve("interactive-surface-css/state-core.css")
  },
  {
    url: `https://unpkg.com/layout-style-css@${layoutPackage.version}/dist/layout-style-css.min.css`,
    path: require.resolve("layout-style-css/min.css")
  }
];

export async function installDemoDependencyRoutes(page) {
  // Browser checks use the exact installed releases while production keeps CDN URLs.
  await Promise.all(
    stylesheetRoutes.map(({ url, path }) =>
      page.route(url, (route) =>
        route.fulfill({
          path,
          contentType: "text/css; charset=utf-8"
        })
      )
    )
  );
}
