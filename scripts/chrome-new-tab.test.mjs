import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve('chrome-new-tab');
const read = (path) => readFileSync(resolve(root, path));
const manifest = JSON.parse(read('manifest.json'));
const page = () => new DOMParser().parseFromString(read('index.html').toString(), 'text/html');

describe('Kagi new-tab companion', () => {
  it('overrides only new tabs without scripts, permissions or search-provider changes', () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.chrome_url_overrides).toEqual({ newtab: 'index.html' });
    for (const key of ['permissions', 'host_permissions', 'background', 'content_scripts', 'chrome_settings_overrides']) {
      expect(manifest[key]).toBeUndefined();
    }
    expect(page().querySelector('script')).toBeNull();
    expect(manifest.content_security_policy.extension_pages).toContain("script-src 'none'");
    expect(manifest.content_security_policy.extension_pages).toContain('form-action https://kagi.com https://*.kagi.com');
  });

  it('submits a labeled, nonempty query to Kagi with native form encoding', () => {
    const doc = page();
    const form = doc.querySelector('form');
    const input = form.elements.namedItem('q');
    expect(form.getAttribute('role')).toBe('search');
    expect(form.method).toBe('get');
    expect(form.action).toBe('https://kagi.com/search');
    expect(doc.querySelector(`label[for="${input.id}"]`).textContent).toBe('Search Kagi');
    expect(form.checkValidity()).toBe(false);
    input.value = 'IRONMAW & íslenska + ?';
    expect(form.checkValidity()).toBe(true);
    const query = new URLSearchParams(new FormData(form)).toString();
    expect(new URLSearchParams(query).get('q')).toBe(input.value);
    expect(query).toContain('%26');
    expect(query).toContain('%C3%AD');
  });

  it('ships local resources with the same artwork and tokens as the theme build', () => {
    for (const element of page().querySelectorAll('link[href], img[src]')) {
      const path = element.getAttribute('href') ?? element.getAttribute('src');
      expect(resolve(root, path).startsWith(root + sep)).toBe(true);
      expect(read(path).length).toBeGreaterThan(0);
    }
    const theme = JSON.parse(readFileSync(resolve('chrome-theme/manifest.json')));
    expect(manifest.icons).toEqual(theme.icons);
    for (const path of [...Object.values(manifest.icons), ...Object.values(theme.theme.images)]) {
      expect(read(path)).toEqual(readFileSync(resolve('chrome-theme', path)));
    }
    expect(read('tokens.css').toString()).toBe(
      readFileSync(resolve('src/lib/tokens/scale.css'), 'utf8') + readFileSync(resolve('src/lib/tokens/colors.css'), 'utf8')
    );
  });
});
