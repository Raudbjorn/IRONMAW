// Oxide tokens + approved vectors -> an unpacked Chrome theme (no runtime code).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromeRoles, hexToRgb } from './theme-colors.mjs';
import { bearMark } from '../src/lib/assets/bear-mark.ts';
import { terrainSvg as terrainMaster } from '../src/lib/assets/terrain.ts';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const { color } = JSON.parse(read('src/lib/tokens/resolved/oxide.tokens.json'));
// Validate all palette inputs before generating any artwork.
for (const role of new Set([...Object.values(chromeRoles), 'structure', 'accent'])) {
  if (!hexToRgb(color[role] ?? '')) throw new Error(`Invalid Oxide color: ${role}`);
}
let terrainSvg = terrainMaster;
for (const role of ['structure', 'accent']) {
  const marker = `var(--wm-${role})`;
  if (!terrainSvg.includes(marker)) throw new Error(`Terrain color marker missing: ${marker}`);
  terrainSvg = terrainSvg.replaceAll(marker, color[role]);
}
const dataUrl = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="fade"><stop stop-color="black"/><stop offset="0.25" stop-color="white"/><stop offset="0.75" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
    <mask id="edges" maskUnits="userSpaceOnUse"><rect x="480" y="888" width="960" height="192" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1920" height="1080" fill="${color.bg}"/>
  <image x="480" y="888" width="960" height="192" opacity="0.22" mask="url(#edges)" href="${dataUrl(terrainSvg)}"/>
  <image x="856" y="916" width="208" height="156" href="${bearMark}"/>
</svg>`;

const output = new URL('chrome-theme/', root);
const stage = new URL('.build-lock/', output);
// Exclusive staging also keeps a second build from publishing during packaging.
mkdirSync(stage);
try {
  mkdirSync(new URL('images/', stage));
  const render = (svg, filename, size) => execFileSync('rsvg-convert', [
    ...(size ? ['--width', String(size), '--height', String(size)] : []),
    '--output', fileURLToPath(new URL(`images/${filename}`, stage))
  ], { input: svg, timeout: 30_000, maxBuffer: 1024 * 1024 });
  render(background, 'new-tab.png');
  const icons = {};
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><image y="16" width="128" height="96" href="${bearMark}"/></svg>`;
  for (const size of [16, 48, 128]) {
    render(icon, `icon-${size}.png`, size);
    icons[size] = `images/icon-${size}.png`;
  }

  const manifest = {
    manifest_version: 3,
    name: 'IRONMAW Oxide',
    version: '1.0.0',
    description: 'Charcoal, teal, rust and slate. The IRONMAW bear and quiet terrain for your browser.',
    icons,
    theme: {
      colors: Object.fromEntries(Object.entries(chromeRoles).map(([key, role]) => [key, hexToRgb(color[role])])),
      images: { theme_ntp_background: 'images/new-tab.png' },
      properties: { ntp_background_alignment: 'bottom', ntp_background_repeat: 'no-repeat', ntp_logo_alternate: 1 }
    }
  };
  writeFileSync(new URL('manifest.json', stage), JSON.stringify(manifest, null, 2) + '\n');
  const files = [...Object.values(icons), ...Object.values(manifest.theme.images), 'manifest.json'];
  if (process.argv.includes('--pack')) {
    // ZIP reads the complete staged generation, never arbitrary files in images/.
    execFileSync('zip', ['-X', 'theme.zip', ...files], {
      cwd: stage, timeout: 30_000, maxBuffer: 1024 * 1024
    });
  }
  // shortcut: per-file renames are not power-loss atomic as a set; use versioned assets if that is required.
  for (const file of files) renameSync(new URL(file, stage), new URL(file, output));
  if (process.argv.includes('--pack')) {
    mkdirSync(new URL('chrome-theme-dist/', root), { recursive: true });
    renameSync(new URL('theme.zip', stage), new URL('chrome-theme-dist/ironmaw-oxide-chrome.zip', root));
  }
  console.log('Chrome theme built: chrome-theme/');
} finally {
  rmSync(stage, { recursive: true, force: true });
}
