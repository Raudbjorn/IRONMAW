import { readFileSync, readdirSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromeRoles } from './theme-colors.mjs';
import { contrastRatio } from '../src/lib/internal/contrast.ts';

const root = resolve('chrome-theme');
const manifest = JSON.parse(readFileSync(`${root}/manifest.json`, 'utf8'));
const { color } = JSON.parse(readFileSync('src/lib/tokens/resolved/oxide.tokens.json', 'utf8'));
const hex = (rgb) => '#' + rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('');

describe('Chrome theme distribution', () => {
  it('is a theme-only MV3 manifest with bounded RGB values', () => {
    expect(Object.keys(manifest).sort()).toEqual(['description', 'icons', 'manifest_version', 'name', 'theme', 'version']);
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(Object.keys(manifest.theme).sort()).toEqual(['colors', 'images', 'properties']);
    for (const rgb of Object.values(manifest.theme.colors)) {
      expect(rgb).toHaveLength(3);
      for (const channel of rgb) {
        expect(Number.isInteger(channel)).toBe(true);
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
    }
  });

  it('ships only referenced PNG assets with the intended dimensions', () => {
    // Keep the bear in native attribution so background crops cannot move it into shortcut rows.
    const dimensions = { ...Object.fromEntries(Object.entries(manifest.icons).map(([size, path]) => [path, [Number(size), Number(size)]])),
      [manifest.theme.images.theme_ntp_background]: [1920, 1080],
      [manifest.theme.images.theme_ntp_attribution]: [128, 96] };
    expect(readdirSync(`${root}/images`).sort()).toEqual(Object.keys(dimensions).map((path) => path.slice(7)).sort());
    for (const [path, size] of Object.entries(dimensions)) {
      const absolute = resolve(root, path);
      expect(absolute.startsWith(root + sep)).toBe(true);
      expect(path).toMatch(/^images\/[a-z0-9-]+\.png$/);
      const png = readFileSync(absolute);
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(size);
    }
    expect(manifest.theme.properties).toEqual({ ntp_background_alignment: 'bottom', ntp_background_repeat: 'no-repeat', ntp_logo_alternate: 1 });
  });

  it('keeps the agreed semantic mapping and readable text in both frame states', () => {
    const colors = manifest.theme.colors;
    expect(Object.keys(colors).sort()).toEqual(Object.keys(chromeRoles).sort());
    for (const [key, role] of Object.entries(chromeRoles)) {
      expect(hex(colors[key]).toUpperCase()).toBe(color[role]);
    }
    for (const [foreground, background] of [['tab_text', 'toolbar'], ['bookmark_text', 'toolbar'],
      ['tab_background_text', 'frame'], ['tab_background_text_inactive', 'frame_inactive'],
      ['tab_background_text_incognito', 'frame_incognito'], ['tab_background_text_incognito_inactive', 'frame_incognito_inactive'],
      // Headers must meet the same 4.5:1 target as other normal-sized text.
      ['ntp_header', 'ntp_background'], ['ntp_text', 'ntp_background'], ['ntp_link', 'ntp_background'], ['omnibox_text', 'omnibox_background']]) {
      expect(contrastRatio(hex(colors[foreground]), hex(colors[background]))).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrastRatio(hex(colors.toolbar_button_icon), hex(colors.toolbar))).toBeGreaterThanOrEqual(3);
  });
});
