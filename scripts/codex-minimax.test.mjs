import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const launcher = resolve('scripts/codex-minimax.sh');

function runLauncher({ key, helper } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ironmaw-minimax-'));
  const bin = join(dir, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'codex'), '#!/bin/sh\nprintf "%s\\n" "$OPENAI_API_KEY"\n', { mode: 0o755 });
  if (helper) writeFileSync(join(bin, 'minimax-api-key'), `#!/bin/sh\n${helper}\n`, { mode: 0o755 });
  const env = { ...process.env, PATH: `${bin}:/usr/bin:/bin` };
  delete env.OPENAI_API_KEY;
  if (key !== undefined) env.OPENAI_API_KEY = key;
  try {
    return spawnSync(launcher, ['exec'], { cwd: dir, env, encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('MiniMax Codex launcher key selection', () => {
  it('keeps an explicitly set key without running the helper', () => {
    const result = runLauncher({ key: 'explicit-key', helper: 'echo leaked-helper-secret >&2; exit 7' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('explicit-key');
    expect(result.stderr).not.toContain('leaked-helper-secret');
  });

  it('uses the PATH helper when the key is unset', () => {
    const result = runLauncher({ helper: 'echo helper-key' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('helper-key');
  });

  it('reports a missing helper clearly', () => {
    const result = runLauncher();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/minimax-api-key.*not found.*PATH/i);
  });

  it('does not expose output from a failed helper', () => {
    const result = runLauncher({ helper: 'echo leaked-helper-secret; echo leaked-helper-secret >&2; exit 7' });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/minimax-api-key.*failed/i);
    expect(result.stdout + result.stderr).not.toContain('leaked-helper-secret');
  });

  it('reports an empty helper result', () => {
    const result = runLauncher({ helper: 'exit 0' });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/minimax-api-key.*empty/i);
  });

  it('rejects an explicitly empty key without invoking the helper', () => {
    const result = runLauncher({ key: '', helper: 'echo leaked-helper-secret >&2; exit 7' });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/OPENAI_API_KEY.*empty/i);
    expect(result.stderr).not.toContain('leaked-helper-secret');
  });
});
