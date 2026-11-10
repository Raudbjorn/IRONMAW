import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hexToRgb } from './theme-colors.mjs';

it('shares strict hex parsing between theme and native builds', () => {
  expect(hexToRgb('#0f1416')).toEqual([15, 20, 22]);
  for (const invalid of ['#fff', '#00000000', 'garbage', '#GG0000', undefined]) {
    expect(hexToRgb(invalid)).toBeNull();
  }
});

// Executable test doubles avoid requiring librsvg/zip in the unit suite.
describe.skipIf(process.platform === 'win32')('isolated Chrome theme build', () => {
  let dir;
  const outputs = ['manifest.json', 'images/new-tab.png', 'images/attribution.png', 'images/icon-16.png', 'images/icon-48.png', 'images/icon-128.png'];
  const run = (...args) => spawnSync(process.execPath, [join(dir, 'scripts/build-chrome-theme.mjs'), ...args], {
    cwd: dir, encoding: 'utf8', timeout: 10_000,
    env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}` }
  });
  const unchanged = () => {
    for (const file of outputs) expect(readFileSync(join(dir, 'chrome-theme', file), 'utf8')).toBe('previous generation');
  };
  const stub = (name, body) => writeFileSync(join(dir, 'bin', name), `#!${process.execPath}\n${body}`, { mode: 0o755 });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'ironmaw-theme-test-'));
    for (const path of ['scripts/build-chrome-theme.mjs', 'scripts/theme-colors.mjs', 'src/lib/assets/bear-mark.ts',
      'src/lib/assets/terrain.ts', 'src/lib/tokens/resolved/oxide.tokens.json']) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      copyFileSync(resolve(path), join(dir, path));
    }
    mkdirSync(join(dir, 'chrome-theme/images'), { recursive: true });
    mkdirSync(join(dir, 'bin'));
    for (const file of outputs) writeFileSync(join(dir, 'chrome-theme', file), 'previous generation');
    stub('rsvg-convert', `const fs = require('node:fs');
const output = process.argv[process.argv.indexOf('--output') + 1];
fs.writeFileSync(output, fs.readFileSync(0));
if (fs.existsSync('fail-render') && output.endsWith('icon-48.png')) process.exit(1);`);
    stub('zip', `require('node:fs').writeFileSync('theme.zip', JSON.stringify(process.argv.slice(2)));`);
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('preserves all published files when a later render fails and releases the lock', () => {
    writeFileSync(join(dir, 'fail-render'), '');
    expect(run().status).not.toBe(0);
    unchanged();
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it('refuses a concurrent build without touching its staging directory', () => {
    mkdirSync(join(dir, 'chrome-theme/.build-lock'));
    expect(run().stderr).toContain('EEXIST');
    unchanged();
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(true);
  });

  it('preserves the published theme and archive if ZIP creation fails', () => {
    mkdirSync(join(dir, 'chrome-theme-dist'));
    const archive = join(dir, 'chrome-theme-dist/ironmaw-oxide-chrome.zip');
    writeFileSync(archive, 'previous archive');
    stub('zip', 'process.exit(1);');
    expect(run('--pack').status).not.toBe(0);
    unchanged();
    expect(readFileSync(archive, 'utf8')).toBe('previous archive');
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it('rejects missing colors before creating staging or rendering artwork', () => {
    const path = join(dir, 'src/lib/tokens/resolved/oxide.tokens.json');
    const tokens = JSON.parse(readFileSync(path, 'utf8'));
    delete tokens.color.structure;
    writeFileSync(path, JSON.stringify(tokens));
    expect(run().stderr).toContain('Invalid Oxide color: structure');
    unchanged();
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it('fails visibly when the shared terrain loses a required color marker', () => {
    const path = join(dir, 'src/lib/assets/terrain.ts');
    writeFileSync(path, readFileSync(path, 'utf8').replace('var(--wm-accent)', 'currentColor'));
    expect(run().stderr).toContain('Terrain color marker missing');
    unchanged();
  });

  it('packages only the staged manifest references outside the npm dist directory', () => {
    writeFileSync(join(dir, 'chrome-theme/images/old-icon.png'), 'unreferenced');
    const result = run('--pack');
    expect(result.status, result.stderr).toBe(0);
    const args = JSON.parse(readFileSync(join(dir, 'chrome-theme-dist/ironmaw-oxide-chrome.zip'), 'utf8'));
    expect(args.slice(0, 2)).toEqual(['-X', 'theme.zip']);
    expect(args.slice(2).sort()).toEqual([...outputs].sort());
    expect(existsSync(join(dir, 'dist'))).toBe(false);
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
    const icon = readFileSync(join(dir, 'chrome-theme/images/icon-48.png'), 'utf8');
    expect(icon).toContain('height="96"');
    expect(icon).toContain('data:image/svg+xml;base64,');
  });
});
