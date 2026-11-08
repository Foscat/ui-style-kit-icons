(() => {
  'use strict';

  const { artwork, icons, styles, themes, aliases } = window.IconCatalog;
  const motion = window.MotionStyle;
  const scope = document.body;
  const byId = (id) => document.getElementById(id);
  const controls = Object.fromEntries(
    ['style', 'theme', 'mode', 'paint', 'size', 'search', 'category'].map((id) => [id, byId(id)]),
  );
  const familyOrder = Object.keys(styles);
  const iconNames = Object.keys(icons);
  const catalog = byId('icons');
  const catalogMotion = byId('catalog-motion');
  const introMotion = byId('intro-motion');
  const inspectorMotion = byId('inspector-motion');
  const largeIcon = byId('large-icon');
  const status = byId('announcement');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const workspace = byId('workspace');
  const inspector = inspectorMotion.parentElement;
  const gallery = byId('gallery');

  function placeInspector() {
    const focused = document.activeElement;
    if (compact.matches) workspace.prepend(inspector);
    else workspace.append(inspector);
    if (inspector.contains(focused)) focused.focus({ preventScroll: true });
  }
  compact.addEventListener('change', placeInspector);
  placeInspector();
  const samples = [16, 24, 32];
  const slots = [...document.querySelectorAll('[data-glyph]')];
  let family = scope.dataset.ui;
  let selection = 'home';

  const titleCase = (id) => id.split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
  const addOption = (select, value, label) => select.add(new Option(label, value));
  controls.style.replaceChildren();
  for (const [id, style] of Object.entries(styles)) addOption(controls.style, id, style.label);
  controls.style.value = family;
  controls.theme.replaceChildren();
  for (const theme of themes) addOption(controls.theme, theme, titleCase(theme));
  controls.theme.value = scope.dataset.theme;
  for (const category of new Set(Object.values(icons).map((icon) => icon.category))) {
    addOption(controls.category, category, titleCase(category));
  }

  function draw(name, paint = controls.paint.value) {
    return window.IconPaint.inlineSvg(artwork[family][paint][name])
      .replace('role="img"', 'aria-hidden="true"')
      .replace(/ aria-label="[^"]*"/, '');
  }

  const tiles = new Map(iconNames.map((name) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'usk-card icon-tile';
    tile.dataset.icon = name;
    tile.setAttribute('aria-pressed', String(name === selection));
    const picture = document.createElement('span');
    const label = document.createElement('span');
    label.className = 'tile-label';
    label.textContent = icons[name].label;
    tile.append(picture, label);
    catalog.append(tile);
    return [name, { tile, picture }];
  }));
  const aliasesByIcon = new Map();
  for (const [alias, name] of Object.entries(aliases)) {
    if (!aliasesByIcon.has(name)) aliasesByIcon.set(name, []);
    aliasesByIcon.get(name).push(alias);
  }
  const searchable = new Map(iconNames.map((name) => [
    name, [name, icons[name].label, icons[name].category, ...icons[name].keywords,
      ...(aliasesByIcon.get(name) ?? [])].join(' ').toLowerCase(),
  ]));

  function renderFilter() {
    const words = controls.search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const category = controls.category.value;
    let shown = 0;
    for (const [name, { tile }] of tiles) {
      const match = (!category || icons[name].category === category)
        && words.every((word) => searchable.get(name).includes(word));
      tile.hidden = !match;
      shown += Number(match);
    }
    byId('results').textContent = shown === iconNames.length
      ? `${shown} icons` : `${shown} of ${iconNames.length}`;
    byId('empty').hidden = shown > 0;
  }

  function renderSelection() {
    const { label, category } = icons[selection];
    byId('inspector-title').textContent = label;
    byId('inspector-category').textContent = titleCase(category);
    byId('icon-name').textContent = selection;
    largeIcon.innerHTML = draw(selection);
    byId('size-samples').innerHTML = samples.map((size) =>
      `<li><span aria-hidden="true">${draw(selection).replace('width="24" height="24"', `width="${size}" height="${size}"`)}</span><small>${size} px</small></li>`,
    ).join('');
  }

  function renderArtwork() {
    for (const [name, { picture }] of tiles) picture.innerHTML = draw(name);
    for (const slot of slots) {
      const paint = slot.closest('#download') ? 'monochrome' : controls.paint.value;
      slot.innerHTML = draw(slot.dataset.glyph, paint);
    }
    byId('export-note').textContent = controls.paint.value === 'monochrome'
      ? 'One-ink SVGs inherit currentColor.' : 'Themed downloads use the current palette.';
    renderSelection();
  }

  function applyFamily(next) {
    family = next;
    scope.dataset.ui = next;
    byId('active-style').textContent = styles[next].label;
    byId('style-description').textContent = styles[next].description;
    const number = String(familyOrder.indexOf(next) + 1).padStart(2, '0');
    byId('style-index').textContent = `${number} / ${familyOrder.length}`;
    renderArtwork();
  }

  function switchFamily() {
    const next = controls.style.value;
    if (next === family || reduceMotion.matches) {
      motion.cancel(catalogMotion);
      motion.cancel(introMotion);
      motion.cancel(inspectorMotion);
      if (next !== family) applyFamily(next);
      return;
    }
    const preset = styles[next].motion;
    // The selector and filters are outside the animated shells. Only the
    // latest replacement gets to commit the UI preset and the icon artwork.
    motion.replace(catalogMotion, () => {
      if (controls.style.value !== next) return;
      applyFamily(next);
      void motion.enter(introMotion, { preset: 'form', duration: 220 });
      void motion.enter(inspectorMotion, { preset, direction: 'up', duration: 220 });
    }, { out: 'form', in: preset, direction: 'up', duration: 155 }).catch((error) => {
      if (controls.style.value === next) applyFamily(next);
      console.error(error);
    });
  }

  function exportSvg() {
    if (controls.paint.value === 'monochrome') return artwork[family].monochrome[selection];
    const live = largeIcon.firstElementChild;
    const copy = live.cloneNode(true);
    const originals = [live, ...live.querySelectorAll('*')];
    const copies = [copy, ...copy.querySelectorAll('*')];
    for (const [index, source] of originals.entries()) {
      const target = copies[index];
      const computed = getComputedStyle(source);
      for (const property of ['fill', 'stroke']) {
        if (source.style.getPropertyValue(property)) {
          target.setAttribute(property, computed.getPropertyValue(property));
        }
      }
      target.removeAttribute('style');
    }
    copy.removeAttribute('aria-hidden');
    copy.removeAttribute('class');
    copy.setAttribute('role', 'img');
    copy.setAttribute('aria-label', icons[selection].label);
    return new XMLSerializer().serializeToString(copy) + '\n';
  }

  controls.style.addEventListener('change', switchFamily);
  controls.theme.addEventListener('change', () => { scope.dataset.theme = controls.theme.value; });
  controls.mode.addEventListener('change', () => { scope.dataset.mode = controls.mode.value; });
  controls.paint.addEventListener('change', renderArtwork);
  controls.size.addEventListener('change', () => scope.style.setProperty('--catalog-size', `${controls.size.value}px`));
  controls.search.addEventListener('input', renderFilter);
  controls.category.addEventListener('change', renderFilter);
  reduceMotion.addEventListener('change', ({ matches }) => {
    if (matches) switchFamily();
  });
  catalog.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-icon]');
    if (!tile) return;
    if (tile.dataset.icon !== selection) {
      tiles.get(selection).tile.setAttribute('aria-pressed', 'false');
      selection = tile.dataset.icon;
      tile.setAttribute('aria-pressed', 'true');
      renderSelection();
      status.textContent = `${icons[selection].label} selected`;
    }
    if (compact.matches) {
      byId('inspector-title').focus({ preventScroll: true });
      inspector.scrollIntoView({ block: 'start' });
    }
  });
  document.querySelector('.back-to-icons').addEventListener('click', (event) => {
    event.preventDefault();
    const { tile } = tiles.get(selection);
    if (tile.hidden) controls.search.focus();
    else tile.focus();
  });
  byId('download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([exportSvg()], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${family}-${selection}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = `Downloaded ${icons[selection].label} SVG`;
  });
  byId('copy').addEventListener('click', async () => {
    const svg = exportSvg();
    try {
      await navigator.clipboard.writeText(svg);
      status.textContent = 'SVG copied';
    } catch {
      const dialog = byId('copy-dialog');
      const code = byId('copy-code');
      code.value = svg;
      dialog.showModal();
      code.focus();
      code.select();
    }
  });

  applyFamily(family);
  renderFilter();
})();
