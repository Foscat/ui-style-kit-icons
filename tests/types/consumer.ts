import {
  contractVersion,
  getPack,
  packRegistry,
  packageVersion,
  type IconLoadDetail,
  type IconPack,
  type UiStyleKitCssMode,
  type UiStyleKitCssTheme
} from "ui-style-kit-icons";

const pack = getPack("retrofuturism");
const packId: IconPack = pack.id;
const packVersion: string = pack.version;
const packTags: string[] = pack.tags;
const mode: UiStyleKitCssMode = "light";
const theme: UiStyleKitCssTheme = "arctic-indigo";
const icon = document.createElement("usk-icon");

icon.name = "dashboard";
icon.frame = "none";
icon.addEventListener("usk-icon-load", (event) => {
  const detail: IconLoadDetail = event.detail;

  console.log(detail.name, detail.pack, detail.url);
});

console.log(
  packageVersion,
  contractVersion,
  packRegistry[packId],
  packVersion,
  packTags,
  mode,
  theme
);
