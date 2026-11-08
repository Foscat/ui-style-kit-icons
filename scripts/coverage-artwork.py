"""Artwork for the coverage expansion, on the collection's 24 px grid."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Glyph:
    label: str
    category: str
    keywords: str
    parts: tuple


def glyph(label, category, keywords, *parts):
    return Glyph(label, category, keywords, parts)


def line(d, role='main'):
    return ('path', role, d)


def solid(d, role='main'):
    return ('solid', role, d)


def box(x, y, width, height, role='main', filled=False):
    return ('block' if filled else 'box', role, x, y, width, height)


def ring(cx, cy, radius, role='main', filled=False):
    return ('dot' if filled else 'ring', role, cx, cy, radius)


def arrow(x1, y1, x2, y2, head=3, role='accent'):
    # Diagonal heads stay proportional when the arrow rotates.
    from math import hypot
    length = hypot(x2-x1, y2-y1)
    ux, uy = (x2-x1)/length, (y2-y1)/length
    bx, by = x2-ux*head, y2-uy*head
    return line(f'M{x1} {y1}L{x2} {y2}M{bx-uy*head:.2f} {by+ux*head:.2f}L{x2} {y2}'
                f'L{bx+uy*head:.2f} {by-ux*head:.2f}', role)


def document(*detail):
    return (line('M6 3H14L19 8V21H6Z M14 3V8H19'), *detail)


def calendar(*detail):
    return (box(3.8, 5.7, 16.4, 14.7), line('M8 3.5V7.4M16 3.5V7.4M4 10H20', 'accent'), *detail)


def clipboard(*detail):
    return (line('M9 5.5H5.5V20.5H18.5V5.5H15'), box(9, 3.3, 6, 4, 'accent'), *detail)


def package_status(mark):
    return (line('M3.5 7.5L10.5 3.8L17.5 7.5V12M3.5 7.5V16L10.5 20M3.5 7.5L10.5 11.3L17.5 7.5M10.5 11.3V20'),
            ring(17.1, 16.8, 4.25), mark)


def scan_frame(*detail):
    return (line('M8 4H4V8M16 4H20V8M4 16V20H8M20 16V20H16'), *detail)


def face(hands='M12 7V12L15.2 14.2'):
    return (ring(12, 12, 8.15), line(hands, 'accent'))


def device(x, y, w, h, *detail):
    return (box(x, y, w, h), *detail)


NAV, ACTION, UI, STATE = 'navigation', 'actions', 'interface', 'feedback'
FILES, MEDIA, BIZ, STOCK = 'files', 'media', 'business', 'inventory'
COM, LOC, REPORT = 'commerce', 'location', 'reports'

GLYPHS = {
    'dashboard': glyph('Dashboard', NAV, 'overview admin layout',
        box(3.7, 4.5, 16.6, 15), line('M4 9H20M10 9V19'),
        line('M13 13H17M13 16H18', 'accent')),
    'list': glyph('List', UI, 'rows display catalog',
        ring(5, 6, 1.05, 'accent', True), ring(5, 12, 1.05, 'accent', True),
        ring(5, 18, 1.05, 'accent', True), line('M9 6H20M9 12H20M9 18H20')),
    'table': glyph('Table', UI, 'spreadsheet rows columns data',
        box(3.8, 4.7, 16.4, 14.6), line('M4 9.6H20M4 14.4H20M10 5V19'),
        line('M13 7.1H17', 'accent')),
    'sort': glyph('Sort', ACTION, 'ascending descending order',
        arrow(7, 18.5, 7, 5.5, 2.7), arrow(17, 5.5, 17, 18.5, 2.7, 'main')),
    'clock': glyph('Clock', STATE, 'time pending timer', *face()),
    'history': glyph('History', STATE, 'activity previous recent audit',
        line('M4.3 9.7A8 8 0 1 1 4.9 16'), line('M4 5.1V10.2H9', 'accent'),
        line('M12 7.6V12L15.2 14.2', 'accent')),
    'spinner': glyph('Spinner', STATE, 'progress loading busy',
        line('M4 12A8 8 0 0 1 12 4', 'accent'), line('M20 12A8 8 0 0 1 12 20'),
        ring(18.1, 6.8, 1.12, 'accent', True), ring(5.9, 17.2, 1.12, 'main', True)),
    'log-in': glyph('Log in', ACTION, 'login sign in session',
        line('M13 4H20V20H13'), arrow(3.8, 12, 15.4, 12, 3.25)),
    'log-out': glyph('Log out', ACTION, 'logout sign out exit session',
        line('M11 4H4V20H11'), arrow(8.6, 12, 20.2, 12, 3.25)),
    'shield-check': glyph('Shield check', STATE, 'verified safe permission',
        line('M12 3.4L19.5 6.3V11.3C19.5 15.6 16.2 19 12 21C7.8 19 4.5 15.6 4.5 11.3V6.3Z'),
        line('M8.6 12L11 14.4L15.5 9.8', 'accent')),
    'key': glyph('Key', UI, 'credential password token access',
        ring(8.2, 8.1, 4), line('M11 11L19.4 19.4M15.2 15.3L17.2 13.3M17.7 17.8L19.7 15.8', 'accent')),
    'phone': glyph('Phone', UI, 'contact call telephone handset',
        line('M6.2 4.1L9.3 7.2L8.2 10.1C9.6 12.6 11.6 14.6 14.2 16L17.1 14.9L20 17.9L18.1 20.1C17.5 20.8 16.4 21 15.5 20.7C9.8 18.9 5.1 14.2 3.3 8.5C3 7.6 3.2 6.5 3.9 5.9Z'),
        line('M13 4.2C16.6 4.7 19.3 7.4 19.8 11', 'accent')),
    'map': glyph('Map', LOC, 'yard navigation route folded',
        line('M3.8 6.4L9.3 4L14.7 6.4L20.2 4V17.6L14.7 20L9.3 17.6L3.8 20Z'),
        line('M9.3 4V17.6M14.7 6.4V20', 'accent')),
    'layers': glyph('Layers', LOC, 'map overlay depth levels',
        line('M3.9 8L12 3.9L20.1 8L12 12.1Z'),
        line('M4 12.4L12 16.5L20 12.4M4 16.8L12 20.8L20 16.8', 'accent')),
    'locate': glyph('Locate', LOC, 'target location recenter position',
        ring(12, 12, 5.8), ring(12, 12, 1.65, 'accent', True),
        line('M12 3.4V6.2M12 17.8V20.6M3.4 12H6.2M17.8 12H20.6')),
    'shelf': glyph('Shelf', STOCK, 'storage rack warehouse shelving',
        line('M4 4V20M20 4V20M4 11.4H20M4 18.3H20'),
        box(7, 6.4, 4, 4.8, 'accent', True), box(13.3, 12.7, 4, 5.5, 'accent', True)),
    'bin-location': glyph('Bin location', STOCK, 'storage slot placement pin',
        line('M4.4 13.5V20H19.6V13.5M4 13.5H8.2M15.8 13.5H20'),
        line('M16 7.4C16 9.7 12 13.4 12 13.4S8 9.7 8 7.4A4 4 0 1 1 16 7.4Z', 'accent'),
        ring(12, 7.3, 1, 'accent', True)),
    'vin-scan': glyph('VIN scan', STOCK, 'vehicle identification scanner intake',
        *scan_frame(line('M7 13.5L8.6 9.2H15.4L17 13.5V16H7Z'),
                    line('M7.3 13.2H16.7M8.6 16V17M15.4 16V17', 'accent'))),
    'shift': glyph('Shift', BIZ, 'schedule calendar clock workforce',
        line('M4 19V6H19V10M8 3.6V7.8M15.5 3.6V7.8M4 10.4H11.4M4 19H9.2'),
        ring(16.2, 16.1, 4.75), line('M16.2 13.2V16.1L18.2 17.2', 'accent')),
    'timesheet': glyph('Timesheet', BIZ, 'hours time approval attendance',
        line('M9 5.7H5.4V20.4H10.1M14.8 5.7H18.6V10.6'),
        box(9, 3.5, 6, 4.2), ring(16.5, 16.4, 4.65),
        line('M16.5 13.5V16.4L18.4 17.5', 'accent')),
    'payroll': glyph('Payroll', BIZ, 'payslip compensation pay run',
        *document(line('M9 11.4H16M9 14.7H16M9 18H11.8', 'accent'),
                  ring(15.9, 18, 1.18, 'accent', True))),
    'calendar-range': glyph('Calendar range', BIZ, 'schedule dates period',
        *calendar(line('M8 15.4H16', 'accent'), ring(7.2, 15.4, 1.1, 'accent', True),
                  ring(16.8, 15.4, 1.1, 'accent', True))),
    'invoice': glyph('Invoice', COM, 'billing statement amount due',
        *document(line('M9 11.7H15.9M9 15.1H11.9M14.1 17.7H16.3', 'accent'),
                  line('M15.2 16.6V18.8', 'accent'))),
    'refund': glyph('Refund', COM, 'return payment reversal',
        line('M5 10.2V5.3H20V17.1H15.8M5 7.9H20'),
        line('M11 12.5L7.3 16.2L11 19.9M7.3 16.2H12.8', 'accent')),
    'payout': glyph('Payout', COM, 'transfer withdrawal disbursement',
        line('M4.5 7.4H19.5V4.5H4.5Z M4.5 7.4V15H10'),
        arrow(12.5, 11.4, 20.4, 19.3, 2.7)),
    'wallet': glyph('Wallet', COM, 'balance payment cash',
        line('M20 9V6.2H5C4.1 6.2 3.6 6.8 3.6 7.7V17.8H20V14.8M6 6.2L16.4 4V6.2'),
        box(13.8, 9.2, 7.1, 5.4, 'accent'), ring(16.2, 11.9, .85, 'accent', True)),
}

GLYPHS.update({
    'browser': glyph('Browser', UI, 'web window site app',
        box(3.4, 5.2, 17.2, 13.8), line('M3.8 9.2H20', 'accent'),
        ring(6.7, 7.25, .72, 'accent', True), ring(9.3, 7.25, .72, 'accent', True)),
    'message': glyph('Message', UI, 'chat conversation reply comment',
        line('M4.2 4.7H19.8V16.9H10.5L6.1 20V16.9H4.2Z'),
        line('M8 9.3H16M8 12.7H14', 'accent')),
    'video': glyph('Video', MEDIA, 'record movie camera',
        box(3.6, 6.4, 11.6, 11.2), line('M15.2 9.5L20.4 6.7V17.3L15.2 14.5', 'accent')),
    'database': glyph('Database', UI, 'data storage records cylinder',
        line('M5 6.5C5 2.2 19 2.2 19 6.5V17.5C19 21.8 5 21.8 5 17.5Z'),
        line('M5 6.5C5 10.8 19 10.8 19 6.5M5 12C5 16.3 19 16.3 19 12', 'accent')),
    'server': glyph('Server', UI, 'host infrastructure rack',
        box(3.8, 4.1, 16.4, 6.7), box(3.8, 13.2, 16.4, 6.7),
        line('M8 7.4H9.2M8 16.6H9.2M13.4 7.4H17M13.4 16.6H17', 'accent')),
    'api': glyph('API', UI, 'integration endpoint connected ports',
        line('M9 5H5V19H9M15 5H19V19H15M5 12H9M15 12H19'),
        box(9, 9, 6, 6, 'accent')),
    'shield': glyph('Shield', UI, 'security protection',
        line('M12 3.4L19.5 6.3V11.3C19.5 15.6 16.2 19 12 21C7.8 19 4.5 15.6 4.5 11.3V6.3Z'),
        line('M12 7V16.5', 'accent')),
    'activity': glyph('Activity', STATE, 'pulse heartbeat realtime monitoring',
        line('M3.7 12H7.5L10 5.1L14 18.9L16.3 12H20.3', 'accent')),
    'tax': glyph('Tax', COM, 'percent rate withholding',
        ring(7.5, 7.5, 2.8), ring(16.5, 16.5, 2.8),
        line('M5 19L19 5', 'accent')),
    'code': glyph('Code', UI, 'source developer brackets',
        line('M8 7L3.8 12L8 17M16 7L20.2 12L16 17'), line('M13.5 5.6L10.5 18.4', 'accent')),
    'terminal': glyph('Terminal', UI, 'console prompt cli',
        box(3.5, 5.1, 17, 13.8), line('M7.2 9.2L10.5 12L7.2 14.8M12.7 14.8H16.8', 'accent')),
    'rocket': glyph('Rocket', UI, 'launch deploy start',
        line('M10 16L7.9 13.9C10.5 7.7 15.3 4.5 20.2 3.8C19.5 8.7 16.3 13.5 10 16ZM7.9 13.9L4 14.5L5.8 10.1L10.3 9.6M10 16L9.5 20L13.9 18.2L14.5 13.7'),
        ring(14.9, 9.1, 1.4, 'accent', True), line('M6.4 17.6L3.8 20.2', 'accent')),
    'bug': glyph('Bug', UI, 'debug issue error developer',
        box(7.2, 8.1, 9.6, 11.6), line('M9 8.1V6A3 3 0 0 1 15 6V8.1M12 9V18.8', 'accent'),
        line('M4 9.6L7.2 11.2M4 14H7.2M4 18.6L7.2 17M20 9.6L16.8 11.2M20 14H16.8M20 18.6L16.8 17')),
    'cloud': glyph('Cloud', UI, 'sync remote hosting',
        line('M7.2 18.3A4.1 4.1 0 1 1 8 10.2A5.1 5.1 0 0 1 17.7 11.3A3.55 3.55 0 1 1 17 18.3Z'),
        line('M8.6 15.2H15.4', 'accent')),
    'globe': glyph('Globe', LOC, 'world language international',
        ring(12, 12, 8.3), line('M12 3.8C6.4 8.3 6.4 15.7 12 20.2C17.6 15.7 17.6 8.3 12 3.8Z M4.2 12H19.8', 'accent')),
    'scan': glyph('Scan', ACTION, 'scanner frame scan line',
        *scan_frame(line('M6.4 12H17.6', 'accent'))),
    'network': glyph('Network', UI, 'connections nodes link services',
        line('M12 8.6V12.7M6.1 16.1V12.7H17.9V16.1'),
        ring(12, 5.9, 2.55, 'accent'), box(3.6, 16.1, 5.2, 4.3), box(15.2, 16.1, 5.2, 4.3)),
    'cpu': glyph('CPU', UI, 'chip processor computer hardware',
        box(6.8, 6.8, 10.4, 10.4), box(10, 10, 4, 4, 'accent', True),
        line('M9 4V6.8M15 4V6.8M9 17.2V20M15 17.2V20M4 9H6.8M4 15H6.8M17.2 9H20M17.2 15H20')),
    'module': glyph('Module', UI, 'layout template split panel',
        box(3.9, 4.7, 16.2, 14.6), line('M10 5V19'), box(13, 8, 4.4, 4.3, 'accent', True)),
    'stack': glyph('Stack', UI, 'stacked services panels',
        box(5.5, 4.1, 13, 6.7), line('M5.5 13.8H18.5M5.5 17.1H18.5M5.5 20.4H18.5', 'accent')),
    'tile': glyph('Tile', UI, 'cell block panel square',
        box(4.8, 4.8, 14.4, 14.4), box(8.7, 8.7, 6.6, 6.6, 'accent', True)),
    'palette': glyph('Palette', UI, 'paint color theme swatches',
        line('M12 3.8A8.2 8.2 0 1 0 12 20.2H13.3A1.65 1.65 0 0 0 14.2 17.2A1.4 1.4 0 0 1 15 14.6H17.4A2.8 2.8 0 0 0 20.2 11.8A8.2 8.2 0 0 0 12 3.8Z'),
        ring(7.8, 11.6, 1.1, 'accent', True), ring(10.4, 7.5, 1.1, 'accent', True),
        ring(15.2, 8.1, 1.1, 'accent', True)),
    'heart': glyph('Heart', STATE, 'favorite like wishlist',
        line('M12 20L5.5 13.6C1 9.1 6.2 3.5 10.2 6.6L12 8.1L13.8 6.6C17.8 3.5 23 9.1 18.5 13.6Z'),
        line('M6.5 9.8C6.6 8.9 7.2 8.3 8.1 8.2', 'accent')),
    'star': glyph('Star', STATE, 'favorite rating',
        line('M12 3.7L14.5 9L20.3 9.8L16.2 14L17.2 19.8L12 17L6.8 19.8L7.8 14L3.7 9.8L9.5 9Z'),
        ring(12, 12.1, 1.08, 'accent', True)),
    'target': glyph('Target', UI, 'goal bullseye focus',
        ring(12, 12, 8.25), ring(12, 12, 4.7), ring(12, 12, 1.52, 'accent', True)),
    'megaphone': glyph('Megaphone', UI, 'announcement broadcast marketing',
        line('M4.1 9.2H9.2L17 5.7V16.4L9.2 13H4.1Z M7.1 13L9 19.3H12L10.1 13.4'),
        line('M20 8.1L21 6.7M20.2 11.1H21.2M20 14.1L21 15.5', 'accent')),
    'cursor': glyph('Cursor', UI, 'pointer select selection mouse',
        line('M5.3 3.8L19.9 13.5L13.3 14.5L10.6 20.1Z'), line('M13.3 14.5L17.5 19.1', 'accent')),
    'expand': glyph('Expand', ACTION, 'fullscreen maximize resize',
        line('M9 4H4V9M15 4H20V9M4 15V20H9M20 15V20H15'),
        line('M4 4L8.7 8.7M20 20L15.3 15.3', 'accent')),
    'archive': glyph('Archive', FILES, 'storage store historical',
        box(3.5, 4.2, 17, 4.5), line('M5.4 8.7V19.8H18.6V8.7'), line('M9 12.5H15', 'accent')),
    'keyboard': glyph('Keyboard', UI, 'shortcut input keys',
        box(3.6, 6.1, 16.8, 11.8),
        line('M7.4 10.3H8M11.7 10.3H12.3M16 10.3H16.6M8.5 14.1H15.5', 'accent')),
    'move': glyph('Move', ACTION, 'drag pan reposition four way',
        line('M12 4V20M4 12H20'),
        line('M9.5 6.6L12 4L14.5 6.6M9.5 17.4L12 20L14.5 17.4M6.6 9.5L4 12L6.6 14.5M17.4 9.5L20 12L17.4 14.5', 'accent')),
    'send': glyph('Send', ACTION, 'paper plane message',
        line('M3.8 9.5L20.2 4L15.1 20L11 13.1Z'), line('M11 13.1L20.2 4', 'accent')),
    'hand': glyph('Hand', ACTION, 'pan grab drag move hand',
        line('M7 13.6V6.3Q7 4.8 8.4 4.8Q9.8 4.8 9.8 6.3V11M9.8 8.4V4.7Q9.8 3.4 11.1 3.4Q12.6 3.4 12.6 4.9V11M12.6 8V6.5Q12.6 5.1 14 5.1Q15.4 5.1 15.4 6.5V11.4M15.4 10Q15.4 8.7 16.8 8.7Q18.2 8.7 18.2 10.1V15.1Q18.2 20.4 13.2 20.4H11Q8.9 20.4 7.3 18.5L4.1 14.5Q3.2 13.3 4.3 12.4Q5.3 11.6 7 13.6Z'),
        line('M10.6 16H13.6', 'accent')),
    'zoom-in': glyph('Zoom in', ACTION, 'magnify enlarge yard map',
        ring(9.8, 9.8, 5.6), line('M13.9 13.9L20.2 20.2'),
        line('M6.65 9.8H12.95M9.8 6.65V12.95', 'accent')),
    'zoom-out': glyph('Zoom out', ACTION, 'magnify reduce yard map',
        ring(9.8, 9.8, 5.6), line('M13.9 13.9L20.2 20.2'), line('M6.65 9.8H12.95', 'accent')),
    'wifi-off': glyph('Wi-Fi off', STATE, 'offline network disconnected',
        line('M3.8 8.7A13 13 0 0 1 6.3 7.2M9.8 6.1A13 13 0 0 1 20.2 8.7M6.7 12.1A8.6 8.6 0 0 1 9.2 10.8M13.9 10.5A8.6 8.6 0 0 1 17.3 12.1M9.5 15.3A4 4 0 0 1 12.5 14.5'),
        ring(12, 18.8, 1.1, 'main', True), line('M4.2 4.2L19.8 19.8', 'accent')),
    'unlock': glyph('Unlock', UI, 'unlocked open access',
        box(5.2, 10.3, 13.6, 10), line('M8 10.3V7.4A4 4 0 0 1 15.9 6.6'),
        line('M12 14.1V16.6', 'accent')),
    'paint-brush': glyph('Paint brush', ACTION, 'brush paint draw editor',
        line('M8.9 14.6L17.3 5.1A1.65 1.65 0 0 1 19.9 7.1L12 17'),
        line('M12 17C11.3 20.3 7.7 20.9 3.8 19.8C5.3 18.9 5.7 17.9 6 16.9C6.5 14.9 7.6 14.2 8.9 14.6Z', 'accent')),
    'door-open': glyph('Door open', LOC, 'gate entry exit access',
        line('M5 20.5V4.2H16.4V7.3M16.4 18V20.5H4'),
        line('M8.2 6.6L19.4 4.4V18.4L8.2 20.4Z', 'accent'), ring(16.6, 12.1, .88, 'accent', True)),
    'paint-bucket': glyph('Paint bucket', ACTION, 'fill color editor',
        line('M4.4 12.4L11.8 5L18.7 11.9L11.3 19.3ZM7.9 4.2L12.3 8.6M4.8 12.4H18'),
        line('M20.3 15C22.1 17.2 22.1 19.2 20.3 19.2C18.5 19.2 18.5 17.2 20.3 15Z', 'accent')),
    'pen-tool': glyph('Pen tool', ACTION, 'bezier vector pen editor',
        line('M12 3.7L19.6 15.4L15.4 19.6L3.7 12L8.7 10.5L10.5 8.7Z M12.5 17.7L17.7 12.5'),
        ring(11.7, 11.7, 1.55, 'accent'), line('M10.6 10.6L4.5 4.5', 'accent')),
    'rectangle': glyph('Rectangle', ACTION, 'draw shape horizontal editor',
        box(4.1, 6.4, 15.8, 11.2), line('M4.2 9V6.4H7M16.9 17.6H19.9V14.8', 'accent')),
    'clipboard-check': glyph('Clipboard check', STOCK, 'verified intake review approved checklist',
        *clipboard(line('M8.8 13.1L11.1 15.4L15.7 10.8', 'accent'))),
    'package-check': glyph('Package check', STOCK, 'picked ready fulfilled accepted',
        *package_status(line('M15.2 16.9L16.7 18.4L19.2 15.7', 'accent'))),
    'package-x': glyph('Package X', STOCK, 'remove package unavailable canceled',
        *package_status(line('M15.7 15.4L18.5 18.2M18.5 15.4L15.7 18.2', 'accent'))),
    'boxes': glyph('Boxes', STOCK, 'inventory parts stacked packages',
        box(8.5, 4.1, 7, 6.5), box(4, 12.3, 7.2, 7.6), box(12.8, 12.3, 7.2, 7.6),
        line('M12 4.5V6.8M7.6 12.7V15.1M16.4 12.7V15.1', 'accent')),
    'gauge': glyph('Gauge', REPORT, 'speedometer performance metrics',
        line('M4.2 17.9V12.9A7.8 7.8 0 0 1 19.8 12.9V17.9Z'),
        line('M12 13.8L15.7 9.9', 'accent'), ring(12, 13.8, 1.3, 'accent', True)),
    'images': glyph('Images', MEDIA, 'gallery photos stacked images',
        line('M6.6 5H20V16.6'), box(3.8, 8.2, 13, 11.8),
        line('M4.2 17L8.3 13.9L11.2 16.1L13 14.8L16.6 17.7', 'accent'),
        ring(12.8, 11.4, 1, 'accent', True)),
    'recycle': glyph('Recycle', STOCK, 'salvage circular reuse',
        line('M6.6 8.2L10.5 3.9H13L16.3 9.2M18.4 12.4L20.2 16.2L18.6 18.6H12.6M8.3 18.6H4.9L3.8 16.2L6.5 11.8'),
        line('M12.9 8.6L16.3 9.2L17 5.8M14.8 16.2L12.6 18.6L14.8 20.8M3.8 12.3L6.5 11.8L7.5 14.6', 'accent')),
    'contrast': glyph('Contrast', UI, 'accessibility theme high contrast',
        ring(12, 12, 8), solid('M12 4A8 8 0 0 1 12 20Z', 'accent')),
    'moon': glyph('Moon', UI, 'dark theme night',
        line('M20 14.2A8.3 8.3 0 1 1 9.8 4A7.5 7.5 0 0 0 20 14.2Z'),
        line('M15.3 5.2V9M13.4 7.1H17.2', 'accent')),
    'sun': glyph('Sun', UI, 'light theme daylight',
        ring(12, 12, 4.5, 'accent'),
        line('M12 3.4V5M12 19V20.6M3.4 12H5M19 12H20.6M5.9 5.9L7 7M17 17L18.1 18.1M5.9 18.1L7 17M17 7L18.1 5.9')),
    'replace': glyph('Replace', ACTION, 'swap exchange substitute',
        arrow(4.2, 8.3, 19.8, 8.3, 2.5), arrow(19.8, 15.7, 4.2, 15.7, 2.5, 'main')),
    'shopping-bag': glyph('Shopping bag', COM, 'purchase store basket order',
        box(5, 8.1, 14, 12.1), line('M8.7 11.2V6.7A3.3 3.3 0 0 1 15.3 6.7V11.2', 'accent')),
    'image-off': glyph('Image off', MEDIA, 'missing photo media unavailable',
        line('M4.3 7.3V19H16.7M8.2 5H19.7V15.5M6.2 16L9 13.7M14 12.1L16.6 10'),
        line('M4 4L20 20', 'accent')),
    'sparkles': glyph('Sparkles', UI, 'suggested assistant new feature',
        solid('M10.2 4.2L11.9 9.5L17.1 11.2L11.9 12.9L10.2 18.2L8.5 12.9L3.3 11.2L8.5 9.5Z'),
        solid('M18.5 13.9L19.4 16.5L22 17.4L19.4 18.3L18.5 20.9L17.6 18.3L15 17.4L17.6 16.5Z', 'accent')),
    'file-text': glyph('File text', FILES, 'document notes policy text',
        *document(line('M9 11.6H16.2M9 14.6H16.2M9 17.6H14.2', 'accent'))),
    'ban': glyph('Ban', STATE, 'blocked prohibited unavailable',
        ring(12, 12, 8.15), line('M6.3 6.3L17.7 17.7', 'accent')),
    'banknote': glyph('Banknote', COM, 'cash money currency',
        box(3.8, 6.5, 16.4, 11), ring(12, 12, 2.55, 'accent'),
        line('M7 11.2V12.8M17 11.2V12.8')),
    'parking': glyph('Parking', LOC, 'yard vehicle parking area',
        ring(12, 12, 8.05), line('M9.8 16.1V7.8H12.6A2.5 2.5 0 0 1 12.6 12.8H9.8', 'accent')),
    'scale': glyph('Scale', STOCK, 'weigh balance measure weight',
        line('M12 4V19.8M7.5 19.8H16.5M5.3 7.4H18.7'),
        line('M5.3 7.4L2.9 13H7.7ZM18.7 7.4L16.3 13H21.1Z', 'accent')),
    'shield-alert': glyph('Shield alert', STATE, 'security warning risk',
        line('M12 3.4L19.5 6.3V11.3C19.5 15.6 16.2 19 12 21C7.8 19 4.5 15.6 4.5 11.3V6.3Z'),
        line('M12 8V12.4', 'accent'), ring(12, 15.4, .9, 'accent', True)),
    'signpost': glyph('Signpost', LOC, 'yard directions signs row',
        line('M12 3.7V20.2'), line('M5 6.3H17L20 8.7L17 11.1H5ZM19 13.3H7L4 15.7L7 18.1H19Z', 'accent')),
    'monitor': glyph('Monitor', UI, 'desktop display screen',
        *device(3.8, 4.6, 16.4, 11.9, line('M12 16.5V20M7.5 20H16.5', 'accent'))),
    'smartphone': glyph('Smartphone', UI, 'mobile device phone screen',
        *device(7.1, 3.6, 9.8, 16.8, line('M10.1 16.7H13.9', 'accent'))),
    'tablet': glyph('Tablet', UI, 'touch device screen',
        *device(5.1, 3.8, 13.8, 16.4, line('M10.5 16.7H13.5', 'accent'))),
    'ste-workforce': glyph('STE Workforce', BIZ, 'module brand team payroll',
        ring(12, 7.2, 2.85, 'accent', True), ring(5.7, 9.3, 1.85, 'main', True),
        ring(18.3, 9.3, 1.85, 'main', True),
        solid('M7.2 18.8V16.4A4.8 4.8 0 0 1 16.8 16.4V18.8Z', 'accent'),
        solid('M2.9 17.6V15.2A2.8 2.8 0 0 1 6.8 12.6L6.2 17.6ZM21.1 17.6H17.8L17.2 12.6A2.8 2.8 0 0 1 21.1 15.2Z')),
    'ste-payments': glyph('STE Payments', COM, 'module brand payment card confirmation',
        line('M15 17.1H4.1V6H19.9V11.8M4.1 9.6H19.9'), line('M7.3 13.4H9.9', 'accent'),
        ring(17.6, 17.1, 4.05), line('M15.9 17L17.2 18.3L19.5 15.9', 'accent')),
})
