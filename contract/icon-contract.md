# UI Style Kit Icon Standard

Contract version: `1.0.0`

This standard separates **semantic implementation icons** from **style-expression extras**.

The goal: when a project changes `data-ui`, the icon ID stays the same and only the visual language changes.

## Contract

- Required core icons: **64**
- File name: `icons/<icon-id>.svg`
- Sprite symbol: `#<style-prefix>-icon-<icon-id>`
- CSS class: `.<style-prefix>-icon`
- IDs are stable semantic names, not visual descriptions.
- Optional style extras are allowed, but they must not replace the required core set.
- Aliases are build-time compatibility helpers only. Published packs should prefer canonical IDs.

## Required Core Icons

| # | ID | Label | Meaning |
| ---: | --- | --- | --- |
| 1 | `home` | Home | Primary landing or app home destination |
| 2 | `dashboard` | Dashboard | Main overview, admin home, metrics hub |
| 3 | `browser` | Browser | Web page, app shell, external web surface |
| 4 | `search` | Search | Find, query, inspect |
| 5 | `user` | User | Single account, profile, member |
| 6 | `users` | Users | Audience, team, members, group |
| 7 | `settings` | Settings | Configuration and preferences |
| 8 | `bell` | Notifications | Alerts, reminders, updates |
| 9 | `message` | Message | Chat, comments, support conversation |
| 10 | `mail` | Email | Email, inbox, message delivery |
| 11 | `calendar` | Calendar | Dates, schedule, publishing plan |
| 12 | `upload` | Upload | Send local content into the app |
| 13 | `download` | Download | Export or retrieve content |
| 14 | `folder` | Folder | Collection, directory, grouped files |
| 15 | `file` | File | Single document or generic file |
| 16 | `image` | Image | Photo, visual asset, thumbnail |
| 17 | `video` | Video | Video media, player, reel |
| 18 | `camera` | Camera | Capture, photo/video source |
| 19 | `database` | Database | Persistent data store |
| 20 | `server` | Server | Backend service or infrastructure |
| 21 | `api` | API | Integration, endpoint, developer interface |
| 22 | `lock` | Lock | Private, secured, restricted |
| 23 | `shield` | Shield | Safety, moderation, protection |
| 24 | `key` | Key | Credentials, access keys, permissions |
| 25 | `chart` | Chart | Analytics, reports, graph |
| 26 | `activity` | Activity | Pulse, usage, live status |
| 27 | `credit-card` | Credit Card | Payment card, billing method |
| 28 | `wallet` | Wallet | Balance, payouts, money account |
| 29 | `cart` | Cart | Checkout cart, purchase flow |
| 30 | `invoice` | Invoice | Receipt, billing document |
| 31 | `tax` | Tax | Tax document, compliance finance |
| 32 | `login` | Login | Sign in, enter account |
| 33 | `logout` | Logout | Sign out, leave account |
| 34 | `edit` | Edit | Modify, compose, revise |
| 35 | `trash` | Trash | Delete, remove, discard |
| 36 | `plus` | Plus | Add, create, increase |
| 37 | `minus` | Minus | Remove, decrease, collapse |
| 38 | `filter` | Filter | Refine visible results |
| 39 | `menu` | Menu | Navigation menu, list |
| 40 | `code` | Code | Source code, embed, developer |
| 41 | `terminal` | Terminal | Console, command line, logs |
| 42 | `rocket` | Rocket | Launch, publish, deploy |
| 43 | `bug` | Bug | Issue, defect, debug |
| 44 | `help` | Help | Question, support, guidance |
| 45 | `link` | Link | URL, connection, relationship |
| 46 | `cloud` | Cloud | Cloud sync, hosted storage |
| 47 | `globe` | Globe | Public web, world, domain |
| 48 | `warning` | Warning | Caution, risk, validation issue |
| 49 | `scan` | Scan | Scan, detect, verify, focus target |
| 50 | `network` | Network | Connected nodes, graph, distributed system |
| 51 | `cpu` | CPU | Compute, processor, AI/system resource |
| 52 | `layers` | Layers | Stacked layers, versions, z-order |
| 53 | `eye` | Eye | View, visibility, preview |
| 54 | `grid` | Grid | Grid view, layout matrix |
| 55 | `module` | Module | Component, widget, reusable block |
| 56 | `stack` | Stack | Stacked cards, queue, layered set |
| 57 | `tile` | Tile | Bento tile, card tile, app block |
| 58 | `phone` | Phone | Mobile device, call, responsive preview |
| 59 | `palette` | Palette | Theme, color, visual style |
| 60 | `heart` | Heart | Favorite, like, affinity |
| 61 | `star` | Star | Featured, rating, saved item |
| 62 | `target` | Target | Goal, campaign, precision |
| 63 | `megaphone` | Megaphone | Announcement, marketing, broadcast |
| 64 | `cursor` | Cursor | Pointer, click, interaction |

## Alias Map

| Alias | Canonical |
| --- | --- |
| `chat` | `message` |
| `credit` | `credit-card` |
| `card` | `credit-card` |
| `media-image` | `image` |
| `media-video` | `video` |
| `brush` | `palette` |
| `sticker` | `star` |
| `stamp` | `target` |
| `flag` | `target` |
| `bolt` | `activity` |
| `lightning` | `activity` |

## Optional Style Extras

| Style | Optional IDs |
| --- | --- |
| `synthwave` | `cassette`, `cd`, `horizon-grid`, `neon-sunset`, `night-drive`, `skyline`, `wave` |
| `cyberpunk` | `circuit`, `chrome-palm`, `crystal`, `orbit`, `starburst` |
| `y2k` | `cd`, `floppy`, `gamepad`, `music`, `sparkle`, `sticker` |
| `brutalism` | `bolt`, `flag`, `stamp` |
| `retro-glass` | `aurora`, `cube`, `droplet`, `lens`, `orb`, `pane`, `prism`, `sparkle`, `window-stack` |
| `bento` | `mosaic`, `split`, `widget` |

## Artwork And Build Rules

1. Standalone SVGs are the canonical semantic artwork. Build scripts must not
   generate or replace semantic geometry.
2. A pack is valid only when every canonical ID exists as `icons/<id>.svg`.
3. Optional extras go after the core list and should be marked as extras in `manifest.json`.
4. The manifest should include `contractVersion`, `requiredIconCount`, `coreIcons`, `optionalIcons`, and `aliases`.
5. The runtime integration should import by semantic ID, never by style-specific ID.
6. Embedded SVG sizing must defer to `--usk-icon-size` so a pack cannot override the runtime host size.
7. Essential icon paint must retain at least 3:1 graphical contrast across every supported color scheme and mode.
8. Generated sprites must merge every distinct source style block used by the pack.
9. Core icons must retain recognizable pack identity when frame surfaces and decoration are hidden.
10. Pack identity must be carried by the semantic object, not by a detached badge or background that obscures meaning.

The borderless construction grammar, prototype approval gate, and research
basis are documented in
[`style-source/reference-led-icon-grammar.md`](../style-source/reference-led-icon-grammar.md).

## Recommended Package Shape

```text
<style>-ui-style-icons/
  dist/<style>-ui-style-icons.css
  dist/<style>-ui-style-icons.svg
  icons/<canonical-id>.svg
  sprite/<style>-ui-style-icons.inline.svg
  style-source/<style>-style-source.md
  manifest.json
  package.json
  README.md
```
