// Oxide tokens + approved vectors -> an unpacked Chrome theme (no runtime code).
import { execFile } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromeRoles, hexToRgb } from './theme-colors.mjs';
import { bearMark, BEAR_MARK_WIDTH, BEAR_MARK_HEIGHT } from '../src/lib/assets/bear-mark.ts';
import { terrainSvg as terrainMaster } from '../src/lib/assets/terrain.ts';

const THEME_VERSION = '1.2.1';
const BACKGROUND_WIDTH_PX = 1920;
const BACKGROUND_HEIGHT_PX = 1080;
const TOOL_TIMEOUT_MS = 30_000;
const TOOL_MAX_BUFFER_BYTES = 1024 * 1024;
const BEAR_WIDTH_PX = 128;
const BEAR_HEIGHT_PX = Math.round(BEAR_WIDTH_PX * BEAR_MARK_HEIGHT / BEAR_MARK_WIDTH);
const ICON_INSET_Y_PX = (BEAR_WIDTH_PX - BEAR_HEIGHT_PX) / 2;
const pack = process.argv.includes('--pack');
const manifestOnly = process.argv.includes('--manifest-only');
if (pack && manifestOnly) throw new Error('--manifest-only cannot be combined with --pack');
const execFileAsync = promisify(execFile);
const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const { color } = JSON.parse(read('src/lib/tokens/resolved/oxide.tokens.json'));
// Validate all palette inputs before generating any artwork.
for (const role of new Set([...Object.values(chromeRoles), ...(!manifestOnly ? ['structure', 'accent'] : [])])) {
  if (!hexToRgb(color[role] ?? '')) throw new Error(`Invalid Oxide color: ${role}`);
}
const icons = Object.fromEntries([16, 48, 128].map((size) => [size, `images/icon-${size}.png`]));
const manifest = {
  manifest_version: 3,
  name: 'IRONMAW Oxide',
  version: THEME_VERSION,
  description: 'Charcoal browser surfaces, misted slate ridges and a teal horizon. The original IRONMAW bear, quietly grounded.',
  icons,
  theme: {
    colors: Object.fromEntries(Object.entries(chromeRoles).map(([key, role]) => [key, hexToRgb(color[role])])),
    images: { theme_ntp_background: 'images/new-tab.png', theme_ntp_attribution: 'images/attribution.png' },
    properties: { ntp_background_alignment: 'bottom', ntp_background_repeat: 'no-repeat', ntp_logo_alternate: 1 }
  }
};
if (!manifestOnly) for (const marker of ['class="contours"', '</svg>']) {
  if (!terrainMaster.includes(marker)) throw new Error(`Terrain styling marker missing: ${marker}`);
}
// Raster-only styling keeps the shared vector free of colors that override consumer CSS.
const terrainSvg = terrainMaster.replace('</svg>', `<style>svg { color: ${color.structure}; } .contours { color: ${color.accent}; }</style></svg>`);
const dataUrl = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
// Keep the center quiet for native search/shortcuts; depth lives along the lower edges.
// Artwork coordinates below are authored in the fixed 1920 x 1080 viewBox.
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${BACKGROUND_WIDTH_PX}" height="${BACKGROUND_HEIGHT_PX}" viewBox="0 0 ${BACKGROUND_WIDTH_PX} ${BACKGROUND_HEIGHT_PX}">
  <defs>
    <linearGradient id="fade"><stop offset="0.01" stop-color="black"/><stop offset="0.12" stop-color="white"/><stop offset="0.88" stop-color="white"/><stop offset="0.99" stop-color="black"/></linearGradient>
    <linearGradient id="ridge" x2="0" y2="1"><stop stop-color="${color.structure}" stop-opacity="0.18"/><stop offset="1" stop-color="${color['surface-2']}" stop-opacity="0.15"/></linearGradient>
    <radialGradient id="haze"><stop stop-color="${color.accent}" stop-opacity="0.10"/><stop offset="1" stop-color="${color.accent}" stop-opacity="0"/></radialGradient>
    <mask id="edges" maskUnits="userSpaceOnUse"><rect width="${BACKGROUND_WIDTH_PX}" height="${BACKGROUND_HEIGHT_PX}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${BACKGROUND_WIDTH_PX}" height="${BACKGROUND_HEIGHT_PX}" fill="${color.bg}"/>
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
const controller = new AbortController();
const interrupt = () => { process.exitCode = 130; controller.abort(); };
const terminate = () => { process.exitCode = 143; controller.abort(); };
process.on('SIGINT', interrupt);
process.on('SIGTERM', terminate);
const runTool = async (file, args, options = {}) => {
  const task = execFileAsync(file, args, {
    timeout: TOOL_TIMEOUT_MS, maxBuffer: TOOL_MAX_BUFFER_BYTES,
    signal: controller.signal, killSignal: 'SIGKILL', ...options
  });
  // Abort rejects before close; wait until the tool can no longer write into staging.
  const closed = new Promise((resolve) => task.child.once('close', resolve));
  try { await task; }
  finally { await closed; }
};
try {
  if (!manifestOnly) {
    mkdirSync(new URL('images/', stage));
    const render = async (svg, filename, size) => {
      const source = new URL(`${filename}.svg`, stage);
      writeFileSync(source, svg);
      await runTool('rsvg-convert', [
        ...(size ? ['--width', String(size), '--height', String(size)] : []),
        '--output', fileURLToPath(new URL(`images/${filename}`, stage)), fileURLToPath(source)
      ]);
    };
    await render(background, 'new-tab.png');
    // Chrome anchors attribution independently of the cropped background and shortcut grid.
    await render(`<svg xmlns="http://www.w3.org/2000/svg" width="${BEAR_WIDTH_PX}" height="${BEAR_HEIGHT_PX}"><image width="${BEAR_WIDTH_PX}" height="${BEAR_HEIGHT_PX}" href="${bearMark}"/></svg>`, 'attribution.png');
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="${BEAR_WIDTH_PX}" height="${BEAR_WIDTH_PX}" viewBox="0 0 ${BEAR_WIDTH_PX} ${BEAR_WIDTH_PX}"><image y="${ICON_INSET_Y_PX}" width="${BEAR_WIDTH_PX}" height="${BEAR_HEIGHT_PX}" href="${bearMark}"/></svg>`;
    for (const size of Object.keys(icons)) {
      await render(icon, `icon-${size}.png`, size);
    }
  }
  writeFileSync(new URL('manifest.json', stage), JSON.stringify(manifest, null, 2) + '\n');
  const files = manifestOnly ? ['manifest.json'] : [...Object.values(icons), ...Object.values(manifest.theme.images), 'manifest.json'];
  if (pack) {
    // ZIP reads the complete staged generation, never arbitrary files in images/.
    await runTool('zip', ['-X', 'theme.zip', ...files], { cwd: stage });
  }
  controller.signal.throwIfAborted();
  const images = new URL('images/', output);
  if (!manifestOnly) mkdirSync(images, { recursive: true });
  // shortcut: per-file renames are not power-loss atomic as a set; use versioned assets if that is required.
  for (const file of files) renameSync(new URL(file, stage), new URL(file, output));
  if (!manifestOnly) for (const entry of readdirSync(images, { withFileTypes: true })) {
    if (entry.isFile() && /\.png$/i.test(entry.name) && !files.includes(`images/${entry.name}`)) {
      rmSync(join(fileURLToPath(images), entry.name));
    }
  }
  if (pack) {
    mkdirSync(new URL('chrome-theme-dist/', root), { recursive: true });
    renameSync(new URL('theme.zip', stage), new URL('chrome-theme-dist/ironmaw-oxide-chrome.zip', root));
  }
  console.log(manifestOnly ? 'Chrome theme manifest built: chrome-theme/manifest.json' : 'Chrome theme built: chrome-theme/');
} catch (error) {
  if (!controller.signal.aborted) throw error;
  console.error('Chrome theme build cancelled.');
} finally {
  rmSync(stage, { recursive: true, force: true });
  process.removeListener('SIGINT', interrupt);
  process.removeListener('SIGTERM', terminate);
}
