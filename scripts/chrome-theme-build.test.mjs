import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
fs.writeFileSync(output, fs.readFileSync(process.argv.at(-1)));
if (fs.existsSync('fail-render') && output.endsWith('icon-48.png')) process.exit(1);`);
    stub('zip', `require('node:fs').writeFileSync('theme.zip', JSON.stringify(process.argv.slice(2)));`);
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it.each([
    ['rsvg-convert', 'SIGINT', 130], ['rsvg-convert', 'SIGTERM', 143],
    ['zip', 'SIGINT', 130], ['zip', 'SIGTERM', 143]
  ])('cancels %s on %s before releasing the lock', async (tool, signal, exitCode) => {
    mkdirSync(join(dir, 'chrome-theme-dist'));
    const archive = join(dir, 'chrome-theme-dist/ironmaw-oxide-chrome.zip');
    writeFileSync(archive, 'previous archive');
    stub(tool, `require('node:fs').writeFileSync('tool.pid', String(process.pid)); setInterval(() => {}, 1000);`);
    const build = spawn(process.execPath, [join(dir, 'scripts/build-chrome-theme.mjs'), '--pack'], {
      cwd: dir, stdio: 'ignore', timeout: 10_000, killSignal: 'SIGKILL',
      env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}` }
    });
    const finished = new Promise((resolve) => build.once('exit', (code, signal) => resolve({ code, signal })));
    const pidFile = join(dir, tool === 'zip' ? 'chrome-theme/.build-lock/tool.pid' : 'tool.pid');
    let toolPid;
    try {
      await vi.waitFor(() => expect(existsSync(pidFile)).toBe(true), { timeout: 5000 });
      toolPid = Number(readFileSync(pidFile, 'utf8'));
      build.kill(signal);
      expect(await finished).toEqual({ code: exitCode, signal: null });
      expect(() => process.kill(toolPid, 0)).toThrow();
      unchanged();
      expect(readFileSync(archive, 'utf8')).toBe('previous archive');
      expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
      stub(tool, `require('node:fs').writeFileSync(process.argv[process.argv.indexOf('--output') + 1] || 'theme.zip', 'rendered');`);
      expect(run().status).toBe(0);
    } finally {
      build.kill('SIGKILL');
      if (toolPid) {
        try { process.kill(toolPid, 'SIGKILL'); }
        catch (error) { if (error.code !== 'ESRCH') throw error; }
      }
      await finished;
    }
  });

  it('preserves all published files when a later render fails and releases the lock', () => {
    writeFileSync(join(dir, 'chrome-theme/images/old-icon.png'), 'unreferenced');
    writeFileSync(join(dir, 'fail-render'), '');
    expect(run().status).not.toBe(0);
    unchanged();
    expect(readFileSync(join(dir, 'chrome-theme/images/old-icon.png'), 'utf8')).toBe('unreferenced');
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it('cancels publication after the ZIP process exits but before its output pipe closes', async () => {
    stub('zip', `const fs = require('node:fs');
fs.writeFileSync('theme.zip', 'new archive');
fs.writeFileSync('tool.pid', String(process.pid));
require('node:child_process').spawn(process.execPath, ['-e', 'setTimeout(() => {}, 1200)'], { stdio: ['ignore', 1, 2] }).unref();`);
    const build = spawn(process.execPath, [join(dir, 'scripts/build-chrome-theme.mjs'), '--pack'], {
      cwd: dir, timeout: 10_000, killSignal: 'SIGKILL',
      env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}` }
    });
    let stdout = '';
    build.stdout.on('data', (chunk) => { stdout += chunk; });
    build.stderr.resume();
    const finished = new Promise((resolve) => build.once('exit', (code) => resolve(code)));
    try {
      await vi.waitFor(() => {
        const pid = Number(readFileSync(join(dir, 'chrome-theme/.build-lock/tool.pid'), 'utf8'));
        expect(() => process.kill(pid, 0)).toThrow();
      }, { timeout: 5000 });
      build.kill('SIGINT');
      expect(await finished).toBe(130);
      expect(stdout).not.toContain('Chrome theme built');
      unchanged();
      expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
    } finally {
      build.kill('SIGKILL');
      await finished;
    }
  });

  it('recreates a missing published images directory', () => {
    rmSync(join(dir, 'chrome-theme/images'), { recursive: true });
    const result = run();
    expect(result.status, result.stderr).toBe(0);
    for (const file of outputs) expect(existsSync(join(dir, 'chrome-theme', file))).toBe(true);
  });

  it('refreshes only manifest colors without external tools', () => {
    const path = join(dir, 'src/lib/tokens/resolved/oxide.tokens.json');
    const tokens = JSON.parse(readFileSync(path, 'utf8'));
    tokens.color.bg = '#010203';
    writeFileSync(path, JSON.stringify(tokens));
    const result = spawnSync(process.execPath, [join(dir, 'scripts/build-chrome-theme.mjs'), '--manifest-only'], {
      cwd: dir, encoding: 'utf8', timeout: 10_000, env: { ...process.env, PATH: '' }
    });
    expect(result.status, result.stderr).toBe(0);
    const manifest = JSON.parse(readFileSync(join(dir, 'chrome-theme/manifest.json'), 'utf8'));
    expect(manifest.theme.colors.frame).toEqual([1, 2, 3]);
    for (const file of outputs.slice(1)) expect(readFileSync(join(dir, 'chrome-theme', file), 'utf8')).toBe('previous generation');
    expect(existsSync(join(dir, 'chrome-theme-dist'))).toBe(false);
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it('rejects manifest-only packaging without modifying published files', () => {
    expect(run('--manifest-only', '--pack').stderr).toContain('--manifest-only cannot be combined with --pack');
    unchanged();
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
  });

  it.each([[], ['--manifest-only']])('refuses a concurrent build with %j without touching its staging directory', (...args) => {
    mkdirSync(join(dir, 'chrome-theme/.build-lock'));
    expect(run(...args).stderr).toContain('EEXIST');
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

  it('fails visibly when the shared terrain loses its styling hook', () => {
    const path = join(dir, 'src/lib/assets/terrain.ts');
    writeFileSync(path, readFileSync(path, 'utf8').replace('class=\\"contours\\"', 'class=\\"renamed\\"'));
    expect(run().stderr).toContain('Terrain styling marker missing');
    unchanged();
  });

  it('packages only the staged manifest references outside the npm dist directory', () => {
    writeFileSync(join(dir, 'chrome-theme/images/old#icon.PNG'), 'unreferenced');
    writeFileSync(join(dir, 'chrome-theme/images/notes.txt'), 'keep');
    const result = run('--pack');
    expect(result.status, result.stderr).toBe(0);
    const args = JSON.parse(readFileSync(join(dir, 'chrome-theme-dist/ironmaw-oxide-chrome.zip'), 'utf8'));
    expect(args.slice(0, 2)).toEqual(['-X', 'theme.zip']);
    expect(args.slice(2).sort()).toEqual([...outputs].sort());
    expect(existsSync(join(dir, 'dist'))).toBe(false);
    expect(existsSync(join(dir, 'chrome-theme/.build-lock'))).toBe(false);
    expect(existsSync(join(dir, 'chrome-theme/images/old#icon.PNG'))).toBe(false);
    expect(readFileSync(join(dir, 'chrome-theme/images/notes.txt'), 'utf8')).toBe('keep');
    const icon = readFileSync(join(dir, 'chrome-theme/images/icon-48.png'), 'utf8');
    expect(icon).toContain('height="96"');
    expect(icon).toContain('data:image/svg+xml;base64,');
  });
});
