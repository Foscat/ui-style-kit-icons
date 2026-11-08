"""Regenerate the static demo from the bundled collection."""

import argparse
from base64 import b64encode
import json
from mimetypes import guess_type
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
site = root / 'docs'


def build_catalog():
    manifest = json.loads((root / 'manifest.json').read_text())
    styles = manifest['styles']
    icons = manifest['icons']
    artwork = {
        style: {
            variant: {
                icon: (root / variant / style / f'{icon}.svg').read_text(encoding='utf-8')
                for icon in icons
            }
            for variant in ('svg', 'monochrome')
        }
        for style in styles
    }
    catalog = dict(styles=styles, themes=manifest['themes'], icons=icons, artwork=artwork, aliases=manifest.get('aliases', {}))
    data = json.dumps(catalog, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    (site / 'assets/catalog.js').write_text(f'window.IconCatalog = {data};\n', encoding='utf-8')

    paint = root / 'paint'
    names = ['icon-themes.css', *(f'{style}-paint.css' for style in styles)]
    css = '\n'.join((paint / name).read_text(encoding='utf-8') for name in names if (paint / name).exists())
    (paint / 'all.css').write_text(css, encoding='utf-8')
    (site / 'assets/icon-paint.css').write_text(css, encoding='utf-8')


def data_uri(path):
    media, _ = guess_type(path.name)
    if not media:
        raise ValueError(f'No media type for {path}')
    return f'data:{media};base64,{b64encode(path.read_bytes()).decode()}'


def write_standalone(destination):
    html = (site / 'index.html').read_text(encoding='utf-8')

    def embed_style(match):
        path = site / match[1]
        css = path.read_text(encoding='utf-8')
        css = re.sub(r'url\(\./assets/([^)]*)\)', lambda asset: f'url({data_uri(path.parent / "assets" / asset[1])})', css)
        return '<style>\n' + css + '\n</style>'

    def embed_script(match):
        script = (site / match[1]).read_text(encoding='utf-8').replace('</script', r'<\/script')
        return '<script>\n' + script + '\n</script>'

    html = re.sub(r'<link rel="stylesheet" href="\./([^"]+)">', embed_style, html)
    scripts = re.compile(r'<script defer src="\./([^"]+)"></script>')
    embedded = '\n'.join(embed_script(match) for match in scripts.finditer(html))
    html = scripts.sub('', html).replace('</body>', embedded + '\n</body>')
    # Embed the tab and header marks in the portable offline copy.
    brand_links = re.compile(r'(href|src)="\./(assets/brand/[^"]+)"')
    html = brand_links.sub(lambda match: f'{match[1]}="{data_uri(site / match[2])}"', html)
    html = html.replace('  <link rel="manifest" href="./site.webmanifest">\n', '')

    licenses = sorted((site / 'assets/vendor').rglob('*.txt'))
    notice = '\n\n'.join(f'{p.relative_to(site)}\n{p.read_text(encoding="utf-8")}' for p in licenses).replace('-->', '-- >')
    html = html.replace('<head>', '<head>\n<!-- Bundled dependency licenses\n' + notice + '\n-->')
    destination.write_text(html, encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--standalone', type=Path, metavar='FILE')
    args = parser.parse_args()
    build_catalog()
    if args.standalone:
        write_standalone(args.standalone)
