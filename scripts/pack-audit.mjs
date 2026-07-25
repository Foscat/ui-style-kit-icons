#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contract = JSON.parse(fs.readFileSync(path.join(root, "contract/icon-contract.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(root, "dist/registry.json"), "utf8"));
const required = contract.icons.map((icon) => icon.id);
const requiredSet = new Set(required);

function sortedIconIds(pack) {
  return [...pack.coreIcons, ...pack.optionalIcons].map((icon) => icon.id).sort();
}

const packs = registry.packs.map((pack) => {
  const ids = sortedIconIds(pack);
  const idSet = new Set(ids);
  const normalizedCore = required.filter((id) => idSet.has(id));
  const exactExtra = ids.filter((id) => !requiredSet.has(id));
  const missing = required.filter((id) => !idSet.has(id));
  const aliasRenames = Object.entries(contract.aliases ?? {})
    .filter(([alias]) => idSet.has(alias))
    .map(([alias, canonical]) => `${alias} -> ${canonical}`);

  return {
    pack: pack.name,
    id: pack.id,
    iconCount: ids.length,
    normalizedCoreCount: normalizedCore.length,
    missing,
    aliasRenames,
    exactMissing: missing,
    exactExtra
  };
});

const audit = {
  schemaVersion: contract.schemaVersion,
  requiredIconCount: contract.requiredIconCount,
  packCount: packs.length,
  packs
};

const tableRows = packs
  .map((pack) =>
    `| \`${pack.pack}\` | ${pack.iconCount} | ${pack.normalizedCoreCount}/${contract.requiredIconCount} | ${pack.missing.length} | ${pack.aliasRenames.length} | ${pack.exactExtra.length} |`
  )
  .join("\n");
const detailRows = packs
  .map(
    (pack) => `### ${pack.pack}

- Pack ID: \`${pack.id}\`
- Missing required IDs: ${pack.missing.length ? pack.missing.map((id) => `\`${id}\``).join(", ") : "None"}
- Alias renames: ${pack.aliasRenames.length ? pack.aliasRenames.map((id) => `\`${id}\``).join(", ") : "None"}
- Extra IDs: ${pack.exactExtra.length ? pack.exactExtra.map((id) => `\`${id}\``).join(", ") : "None"}`
  )
  .join("\n\n");
const markdown = `# UI Style Kit Icon Pack Audit

Contract version: \`${contract.schemaVersion}\`

Required core icons: **${contract.requiredIconCount}**

Selectable packs: **${packs.length}**

| Pack | Icons | Normalized Core Coverage | Missing Required | Alias Renames | Exact Extras |
| --- | ---: | ---: | ---: | ---: | ---: |
${tableRows}

## Pack Details

${detailRows}
`;

fs.writeFileSync(path.join(root, "contract/pack-audit.json"), `${JSON.stringify(audit, null, 2)}\n`);
fs.writeFileSync(path.join(root, "contract/pack-audit.md"), markdown);
console.log(`Wrote contract audit for ${packs.length} packs.`);
