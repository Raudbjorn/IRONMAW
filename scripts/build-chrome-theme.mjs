// Oxide tokens + approved vectors -> an unpacked Chrome theme (no runtime code).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const { color } = JSON.parse(read('src/lib/tokens/resolved/oxide.tokens.json'));
const rgb = (role) => {
  if (!/^#[0-9a-f]{6}$/i.test(color[role])) throw new Error(`Invalid Oxide color: ${role}`);
  return color[role].slice(1).match(/../g).map((channel) => parseInt(channel, 16));
};
const roles = {
  frame: 'bg', frame_inactive: 'surface-2',
  frame_incognito: 'bg', frame_incognito_inactive: 'surface-2',
  background_tab: 'bg', background_tab_inactive: 'surface-2',
  background_tab_incognito: 'bg', background_tab_incognito_inactive: 'surface-2',
  toolbar: 'surface-1', toolbar_text: 'text', toolbar_button_icon: 'text',
  tab_text: 'text', bookmark_text: 'text',
  tab_background_text: 'text-muted', tab_background_text_inactive: 'text-muted',
  tab_background_text_incognito: 'text-muted', tab_background_text_incognito_inactive: 'text-muted',
  omnibox_background: 'bg', omnibox_text: 'text',
  ntp_background: 'bg', ntp_text: 'text', ntp_link: 'accent', ntp_header: 'structure'
};

// Reuse Panel's actual terrain paths; fail visibly if its source shape changes.
const terrain = read('src/lib/components/layout/Panel.svelte').match(/<svg viewBox="0 0 800 160"[\s\S]*?<\/svg>/)?.[0];
if (!terrain) throw new Error('Panel terrain SVG not found');
const terrainSvg = terrain
  .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  .replace('focusable="false"', `color="${color.structure}"`)
  .replace('class="contours"', `color="${color.accent}" opacity="0.6"`);
const dataUrl = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="fade"><stop stop-color="black"/><stop offset="0.25" stop-color="white"/><stop offset="0.75" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
    <mask id="edges" maskUnits="userSpaceOnUse"><rect x="480" y="888" width="960" height="192" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1920" height="1080" fill="${color.bg}"/>
  <image x="480" y="888" width="960" height="192" opacity="0.22" mask="url(#edges)" href="${dataUrl(terrainSvg)}"/>
  <image x="856" y="916" width="208" height="156" href="${dataUrl(read('assets/brand/bear-mark.svg'))}"/>
</svg>`;

mkdirSync(new URL('chrome-theme/images/', root), { recursive: true });
const render = (svg, filename, size) => execFileSync('rsvg-convert', [
  ...(size ? ['--width', String(size), '--height', String(size)] : []),
  '--output', fileURLToPath(new URL(`chrome-theme/images/${filename}`, root))
], { input: svg, timeout: 30_000, maxBuffer: 1024 * 1024 });
render(background, 'new-tab.png');
const icons = {};
for (const size of [16, 48, 128]) {
  render(read('assets/brand/bear-emblem.svg'), `icon-${size}.png`, size);
  icons[size] = `images/icon-${size}.png`;
}

writeFileSync(new URL('chrome-theme/manifest.json', root), JSON.stringify({
  manifest_version: 3,
  name: 'IRONMAW Oxide',
  version: '1.0.0',
  description: 'Charcoal, teal, rust and slate. The IRONMAW bear and quiet terrain for your browser.',
  icons,
  theme: {
    colors: Object.fromEntries(Object.entries(roles).map(([key, role]) => [key, rgb(role)])),
    images: { theme_ntp_background: 'images/new-tab.png' },
    properties: { ntp_background_alignment: 'bottom', ntp_background_repeat: 'no-repeat', ntp_logo_alternate: 1 }
  }
}, null, 2) + '\n');
console.log('Chrome theme built: chrome-theme/');
