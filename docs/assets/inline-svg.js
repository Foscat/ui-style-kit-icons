var IconPaint = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // icons-collection-work/ui-style-kit-icons-collection/paint/inline-svg.mjs
  var inline_svg_exports = {};
  __export(inline_svg_exports, {
    inlineSvg: () => inlineSvg
  });
  var paintAttribute = /(fill|stroke)="(var\(--usi-[\w-]+,\s*([\w#.-]+)\))"/g;
  function inlineSvg(svg) {
    return svg.replace(/<[^>]+>/g, (tag) => {
      const declarations = [];
      const normalized = tag.replace(paintAttribute, (_, property, variable, fallback) => {
        declarations.push(`${property}:${variable}`);
        return `${property}="${fallback}"`;
      });
      if (!declarations.length) return normalized;
      const style = declarations.join(";");
      if (normalized.includes(' style="')) {
        return normalized.replace(/ style="([^"]*)"/, (_, old) => ` style="${old};${style}"`);
      }
      return normalized.replace(/\s*(\/?)>$/, ` style="${style}"$1>`);
    });
  }
  return __toCommonJS(inline_svg_exports);
})();
