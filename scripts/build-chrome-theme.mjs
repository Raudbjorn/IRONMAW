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
// Keep the center quiet for native search/shortcuts; depth lives along the lower edges.
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="fade"><stop offset="0.01" stop-color="black"/><stop offset="0.12" stop-color="white"/><stop offset="0.88" stop-color="white"/><stop offset="0.99" stop-color="black"/></linearGradient>
    <linearGradient id="ridge" x2="0" y2="1"><stop stop-color="${color.structure}" stop-opacity="0.18"/><stop offset="1" stop-color="${color['surface-2']}" stop-opacity="0.15"/></linearGradient>
    <radialGradient id="haze"><stop stop-color="${color.accent}" stop-opacity="0.10"/><stop offset="1" stop-color="${color.accent}" stop-opacity="0"/></radialGradient>
    <mask id="edges" maskUnits="userSpaceOnUse"><rect width="1920" height="1080" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1920" height="1080" fill="${color.bg}"/>
  <g mask="url(#edges)">
    <ellipse cx="960" cy="1030" rx="940" ry="290" fill="url(#haze)"/>
    <path d="M0 1004 180 934 310 958 470 814 544 882 600 850 730 974 878 1016 1030 1024 1160 986 1330 824 1400 878 1480 786 1650 930 1760 906 1920 992V1080H0Z" fill="url(#ridge)"/>
    <path d="m310 958 160-144 74 68 56-32m730-26 70 54 80-92 170 144" fill="none" stroke="${color.structure}" stroke-opacity="0.06"/>
    <path d="M0 1038 210 984 350 1002 520 924 676 1018 852 1044 1020 1042 1180 1026 1350 934 1478 1000 1600 956 1770 1010 1920 1040V1080H0Z" fill="${color['surface-2']}"/>
    <path d="M0 1070 180 1030 320 1052 496 1004 670 1058 870 1070 1090 1068 1280 1038 1420 1064 1610 1018 1770 1048 1920 1064V1080H0Z" fill="${color['surface-1']}"/>
    <image x="390" y="840" width="1120" height="224" opacity="0.08" href="${dataUrl(terrainSvg)}"/>
  </g>
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
  // Chrome anchors attribution independently of the cropped background and shortcut grid.
  render(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96"><image width="128" height="96" href="${bearMark}"/></svg>`, 'attribution.png');
  const icons = {};
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><image y="16" width="128" height="96" href="${bearMark}"/></svg>`;
  for (const size of [16, 48, 128]) {
    render(icon, `icon-${size}.png`, size);
    icons[size] = `images/icon-${size}.png`;
  }

  const manifest = {
    manifest_version: 3,
    name: 'IRONMAW Oxide',
    version: '1.2.0',
    description: 'Charcoal browser surfaces, misted slate ridges and a teal horizon. The original IRONMAW bear, quietly grounded.',
    icons,
    theme: {
      colors: Object.fromEntries(Object.entries(chromeRoles).map(([key, role]) => [key, hexToRgb(color[role])])),
      images: { theme_ntp_background: 'images/new-tab.png', theme_ntp_attribution: 'images/attribution.png' },
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
