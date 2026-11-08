"""Fail when a catalog or consumer icon has no complete family coverage."""

import argparse
from hashlib import sha256
import json
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
SVG = '{http://www.w3.org/2000/svg}svg'


def read(path):
    return json.loads(path.read_text())


def check(usage=None):
    manifest = read(ROOT / 'manifest.json')
    icons, families = manifest['icons'], manifest['styles']
    aliases = manifest['aliases']
    if len(icons) != manifest['iconsPerStyle'] or len(families) != manifest['styleCount']:
        raise ValueError('Catalog counts do not match the manifest')
    if set(aliases) & icons.keys() or not set(aliases.values()) <= icons.keys():
        raise ValueError('Invalid alias target or canonical name collision')
    inventories = read(ROOT / 'reference/coverage-map.json')
    for scope, mappings in inventories.items():
        missing = set(mappings.values()) - icons.keys()
        if missing:
            raise ValueError(f'{scope} is missing canonical icons: {sorted(missing)}')
    if usage is not None:
        names = read(usage)
        if not isinstance(names, list) or not all(isinstance(name, str) for name in names):
            raise ValueError('Usage input must be a JSON array of icon names')
        missing = sorted({name for name in names if aliases.get(name, name) not in icons})
        if missing:
            raise ValueError(f'Unknown consumer icons: {", ".join(missing)}')

    hashes = read(ROOT / 'reference/asset-hashes.json')
    expected = {
        f'{variant}/{family}/{name}.svg'
        for variant in ('svg', 'monochrome')
        for family in families
        for name in icons
    }
    if set(hashes) != expected:
        raise ValueError('The asset hash registry and required matrix disagree')
    for relative in sorted(expected):
        variant, family, filename = relative.split('/')
        icon = icons[Path(filename).stem]
        data = (ROOT / relative).read_bytes()
        if sha256(data).hexdigest() != hashes[relative]:
            raise ValueError(f'Artwork checksum differs: {relative}')
        node = ElementTree.fromstring(data)
        if (node.tag, node.get('viewBox'), node.get('aria-label')) != (SVG, '0 0 24 24', icon['label']):
            raise ValueError(f'Invalid SVG metadata: {relative}')
        if variant == 'svg' and node.get('data-icon-style') != family:
            raise ValueError(f'Incorrect style ID: {relative}')
        if variant == 'monochrome' and (b'var(' in data or b'currentColor' not in data):
            raise ValueError(f'Invalid one-ink paint: {relative}')
    print(f'Verified {len(icons)} names × {len(families)} styles × 2 variants ({len(expected)} files).')
    print(', '.join(f'{name}: {len(mapping)} covered' for name, mapping in inventories.items()))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--usage', type=Path, metavar='ICON_NAMES_JSON')
    args = parser.parse_args()
    try:
        check(args.usage)
    except (OSError, ValueError, ElementTree.ParseError) as error:
        parser.exit(1, f'Coverage check failed: {error}\n')
