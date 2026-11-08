// Older artwork stores CSS variables in presentation attributes. Transfer
// those declarations to inline CSS on preview copies. The source SVGs stay
// byte-for-byte identical to the family packs.
const paintAttribute = /(fill|stroke)="(var\(--usi-[\w-]+,\s*([\w#.-]+)\))"/g;
export function inlineSvg(svg) {
  return svg.replace(/<[^>]+>/g, (tag) => {
    const declarations = [];
    const normalized = tag.replace(paintAttribute, (_, property, variable, fallback) => {
      declarations.push(`${property}:${variable}`);
      return `${property}="${fallback}"`;
    });
    if (!declarations.length) return normalized;
    const style = declarations.join(';');
    if (normalized.includes(' style="')) {
      return normalized.replace(/ style="([^"]*)"/, (_, old) => ` style="${old};${style}"`);
    }
    return normalized.replace(/\s*(\/?)>$/, ` style="${style}"$1>`);
  });
}
