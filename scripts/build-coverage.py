"""Generate themed and one-ink variants for the expanded catalog."""

from dataclasses import dataclass
from hashlib import sha256
from html import escape
import json
from math import cos, pi, sin
from pathlib import Path
from runpy import run_path

ROOT = Path(__file__).resolve().parents[1]
GLYPHS = run_path(Path(__file__).with_name('coverage-artwork.py'))['GLYPHS']


@dataclass(frozen=True)
class Profile:
    ink: str
    accent: str
    width: float
    accent_width: float
    corner: str
    radius: float
    ring: int
    cap: str = 'round'
    join: str = 'round'
    transform: str = ''
    wash: str = ''
    relief: str = ''


# Existing family tokens are reused. Corner treatments, ring geometry, stroke,
# relief, and proportions follow each family's authored visual vocabulary.
PROFILES = {
    'minimal-saas': Profile('ink', 'ink', 1.72, 1.72, 'round', 1, 0),
    'bento': Profile('primary-ink', 'secondary-ink', 1.76, 1.82, 'round', 2.4, 0, wash='primary-wash'),
    'maximalist': Profile('ink', 'primary-ink', 2.38, 2.66, 'square', 0, 12, 'square', 'bevel'),
    'bauhaus': Profile('ink', 'primary-ink', 1.98, 2.1, 'square', 0, 0, 'square', 'bevel'),
    'tactile': Profile('ink', 'tactile-recess', 2.04, 1.92, 'round', 1.7, 0, relief='tactile-shade'),
    'brutalism': Profile('brutalism-body', 'brutalism-detail', 2.7, 2.54, 'cut', 1.65, 8, 'square', 'bevel'),
    'cyberpunk': Profile('cyberpunk-rail', 'cyberpunk-signal', 1.64, 1.91, 'slice', 2, 8, 'square', 'bevel'),
    'y2k': Profile('y2k-shell', 'y2k-pop', 2.1, 2.2, 'round', 2.9, 0, 'round', 'round',
                   'translate(.48 0) scale(.96 1)', wash='y2k-gel'),
    'retro-glass': Profile('retro-glass-rim', 'retro-glass-etch', 1.66, 1.52, 'round', 2, 0, wash='retro-glass-pane'),
    'editorial-luxe': Profile('editorial-luxe-ink', 'editorial-luxe-foil', 1.52, 1.58, 'cut', .95, 0, 'butt', 'bevel'),
    'organic-modern': Profile('organic-modern-body', 'organic-modern-inlay', 2.23, 2.38, 'round', 2.15, 0,
                              transform='translate(.36 .24) scale(.97 .98)'),
    'industrial-utility': Profile('industrial-utility-frame', 'industrial-utility-signal', 2.12, 2.13, 'cut', .7, 8, 'square', 'bevel'),
    'technical-blueprint': Profile('technical-blueprint-ink', 'technical-blueprint-datum', 1.48, 1.53, 'square', 0, 0, 'butt', 'bevel'),
    'art-deco': Profile('art-deco-ink', 'art-deco-metal', 1.83, 1.88, 'cut', 1.7, 8, 'square', 'bevel'),
    'clay': Profile('clay-rim', 'clay-face', 2.5, 2.43, 'round', 3.15, 0, relief='clay-rim'),
    'data-terminal': Profile('terminal-ink', 'terminal-signal', 1.9, 2.04, 'step', 1.65, 8, 'square', 'bevel'),
    'paper-editorial': Profile('paper-editorial-ink', 'paper-editorial-proof', 1.95, 1.7, 'square', 0, 0, 'square', 'bevel',
                               'translate(.12 .36) scale(.99 .97)'),
    'neo-noir': Profile('neo-noir-ink', 'neo-noir-light', 2.02, 2.15, 'slice', 1.1, 8, 'butt', 'bevel',
                        'translate(2.15 .36) scale(.94 .97) skewX(-7)'),
    'neumorphism': Profile('neumorphism-ink', 'neumorphism-relief', 2.18, 1.95, 'round', 2.8, 0, relief='neumorphism-relief'),
    'retrofuturism': Profile('retrofuturism-metal', 'retrofuturism-enamel', 2.04, 2.08, 'round', 2.12, 0,
                             transform='translate(.24 .12) scale(.98 .99)'),
}

ALIASES = {
    'chart': 'chart-bar',
    'login': 'log-in',
    'logout': 'log-out',
    'chat': 'message',
    'credit': 'credit-card',
    'card': 'credit-card',
    'media-image': 'image',
    'media-video': 'video',
    'brush': 'palette',
    'sticker': 'star',
    'stamp': 'target',
    'flag': 'target',
    'bolt': 'activity',
    'lightning': 'activity',
}

# A consumer alias can differ from a legacy package alias. In particular, SYS
# uses its legacy "phone" registry key for a mobile screen, not a handset.
SYS_ALIASES = {'phone': 'smartphone'}
LUCIDE_ALIASES = {
    'badge-check': 'success',
    'brush': 'paint-brush',
    'calendar-clock': 'shift',
    'calendar-days': 'calendar',
    'car-front': 'car',
    'chart-no-axes-column-increasing': 'chart-bar',
    'check-circle-2': 'success',
    'circle-arrow-up': 'arrow-up',
    'circle-check-big': 'success',
    'circle-help': 'help',
    'circle-parking': 'parking',
    'clipboard-list': 'clipboard',
    'clock-3': 'clock',
    'file-up': 'upload',
    'globe-2': 'globe',
    'grid-2x2': 'grid',
    'key-round': 'key',
    'layout-template': 'module',
    'locate-fixed': 'locate',
    'lock-keyhole': 'lock',
    'lock-open': 'unlock',
    'maximize-2': 'expand',
    'message-square-text': 'message',
    'mouse-pointer-2': 'cursor',
    'pencil': 'edit',
    'rectangle-horizontal': 'rectangle',
    'redo-2': 'redo',
    'refresh-ccw': 'refresh',
    'refresh-cw': 'refresh',
    'rotate-ccw': 'undo',
    'scan-line': 'scan',
    'shopping-cart': 'cart',
    'triangle-alert': 'warning',
    'undo-2': 'undo',
    'user-round': 'user',
    'x': 'close',
    'x-circle': 'error',
}


def coord(value):
    return f'{value:.3f}'.rstrip('0').rstrip('.')


def polygon(points):
    return 'M' + 'L'.join(f'{coord(x)} {coord(y)}' for x, y in points) + 'Z'


def panel(profile, x, y, w, h):
    right, bottom = x+w, y+h
    corner = min(profile.radius, w/3, h/3)
    if profile.corner in {'round', 'square'}:
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{coord(corner)}"'
    if profile.corner == 'slice':
        points = [(x,y), (right-corner,y), (right,y+corner),
                  (right,bottom), (x+corner,bottom), (x,bottom-corner)]
    elif profile.corner == 'step':
        points = [(x+corner,y), (right-corner,y), (right-corner,y+corner), (right,y+corner),
                  (right,bottom-corner), (right-corner,bottom-corner), (right-corner,bottom),
                  (x+corner,bottom), (x+corner,bottom-corner), (x,bottom-corner), (x,y+corner),
                  (x+corner,y+corner)]
    else:
        points = [(x+corner,y), (right-corner,y), (right,y+corner), (right,bottom-corner),
                  (right-corner,bottom), (x+corner,bottom), (x,bottom-corner), (x,y+corner)]
    return f'<path d="{polygon(points)}"'


def outline(profile, kind, args):
    if kind in {'path', 'solid'}:
        return f'<path d="{args[0]}"'
    if kind in {'box', 'block'}:
        return panel(profile, *args)
    x, y, r = args
    if profile.ring and r >= 2.3:
        rotation = pi / profile.ring if profile.corner in {'step', 'cut'} else 0
        angles = [rotation + i*2*pi/profile.ring for i in range(profile.ring)]
        return f'<path d="{polygon([(x+r*cos(a), y+r*sin(a)) for a in angles])}"'
    return f'<circle cx="{x}" cy="{y}" r="{r}"'


def paint(property_name, token, mono, default='currentColor'):
    if mono:
        return f'{property_name}="{default}"'
    return f'{property_name}="{default}" style="{property_name}:var(--usi-{token}, {default})"'


def render(name, glyph, family, profile, mono):
    nodes = []
    for kind, role, *args in glyph.parts:
        element = outline(profile, kind, args)
        token = profile.accent if role == 'accent' else profile.ink
        width = profile.accent_width if role == 'accent' else profile.width
        if kind in {'solid', 'block', 'dot'}:
            nodes.append(f'{element} {paint("fill", token, mono)} stroke="none"/>')
            continue
        if not mono and kind in {'box', 'ring'} and profile.wash:
            nodes.append(f'{element} {paint("fill", profile.wash, mono, "none")} stroke="none"/>')
        if not mono and role == 'main' and profile.relief:
            nodes.append(f'{element} {paint("stroke", profile.relief, mono)} stroke-width="{width}" transform="translate(0 .45)"/>')
        nodes.append(f'{element} {paint("stroke", token, mono)} stroke-width="{width}"/>')
    inner = ''.join(nodes)
    if profile.transform:
        inner = f'<g transform="{profile.transform}">{inner}</g>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" '
            f'role="img" aria-label="{escape(glyph.label, quote=True)}" focusable="false" class="usk-icon" '
            f'data-icon-style="{family}" fill="none" stroke-linecap="{profile.cap}" stroke-linejoin="{profile.join}" '
            f'stroke-miterlimit="2">{inner}</svg>\n')


def load(path):
    return json.loads(path.read_text())


def write(path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False)+'\n')


def coverage(existing, evidence):
    names = set(existing) | set(GLYPHS)
    if set(ALIASES) & names:
        raise ValueError('An alias cannot replace a canonical icon name')
    if ALIASES.keys() != evidence['package']['aliases'].keys() | {'chart', 'login', 'logout'}:
        raise ValueError('The compatibility alias list changed')
    lucide = sorted({name for source in evidence['sys']['lucideFiles'] for name in source['imports']})
    mappings = {}
    inventories = (
        ('publishedV1', evidence['package']['required'] + list(evidence['package']['aliases']), {}),
        ('sysAppIcon', evidence['sys']['appIcon'], SYS_ALIASES),
        ('sysLucideSample', lucide, LUCIDE_ALIASES),
    )
    for group, inputs, overrides in inventories:
        mapping = {name: overrides.get(name, ALIASES.get(name, name)) for name in inputs}
        missing = {key: value for key, value in mapping.items() if value not in names}
        if missing:
            raise ValueError(f'Missing coverage for {group}: {missing}')
        mappings[group] = mapping
    return mappings


def build():
    path = ROOT / 'manifest.json'
    manifest = load(path)
    if PROFILES.keys() != manifest['styles'].keys():
        raise ValueError('Every icon family must have a profile')
    hashes_path = ROOT / 'reference/asset-hashes.json'
    hashes = load(hashes_path)
    locked = {k: v for k, v in hashes.items() if Path(k).stem not in GLYPHS}
    for filename, digest in locked.items():
        if sha256((ROOT / filename).read_bytes()).hexdigest() != digest:
            raise ValueError(f'Baseline artwork changed: {filename}')
    existing = {name: data for name, data in manifest['icons'].items() if name not in GLYPHS}
    evidence = load(ROOT / 'reference/coverage-evidence.json')
    mappings = coverage(existing, evidence)
    manifest['icons'] = {**existing, **{
        name: {'label': glyph.label, 'category': glyph.category,
               'keywords': glyph.keywords.split() + [alias for alias, target in ALIASES.items() if target == name],
               'slice': 5}
        for name, glyph in GLYPHS.items()
    }}
    manifest['aliases'] = ALIASES
    manifest['iconsPerStyle'] = len(manifest['icons'])

    for family, profile in PROFILES.items():
        for name, glyph in GLYPHS.items():
            for variant in ('svg', 'monochrome'):
                filename = f'{variant}/{family}/{name}.svg'
                artwork = render(name, glyph, family, profile, mono=variant == 'monochrome').encode()
                (ROOT / filename).write_bytes(artwork)
                hashes[filename] = sha256(artwork).hexdigest()
    write(path, manifest)
    write(hashes_path, hashes)
    write(ROOT / 'reference/coverage-map.json', mappings)
    print(f'Built {len(GLYPHS)} new icons in {len(PROFILES)} families. {len(hashes)} total SVG assets.')


if __name__ == '__main__':
    build()
