// Subset + convert the self-hosted faces into src/lib/fonts/.
//   Inter Variable  — already woff2; copied verbatim.
//   Iosevka Nerd    — subset TTF → woff2 (Latin-1, punctuation, arrows, box
//                     drawing, scoped Nerd-Font PUA for glyph icons).
//   Rajdhani        — subset TTF → woff2 (Latin-1 + Latin Ext-A covers every
//                     Icelandic letter: ÁÉÍÓÚÝÐÞÆÖ and lowercase; verified
//                     against the cmap on 2026-10-13).
// Needs FontTools (`pyftsubset`). Run via `pnpm run fonts`.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(root, 'src/lib/fonts');
mkdirSync(outDir, { recursive: true });

for (const f of ['InterVariable.woff2', 'InterVariable-Italic.woff2']) {
  copyFileSync(join(root, 'assets/fonts-src', f), join(outDir, f));
}

const subset = (src, dest, unicodes) =>
  execFileSync('pyftsubset', [
    join(root, src),
    `--unicodes=${unicodes}`,
    '--layout-features=*',
    '--no-hinting',
    '--desubroutinize',
    '--flavor=woff2',
    `--output-file=${dest}`
  ]);

const monoRange = [
  'U+0000-00FF', // Latin-1 (all Icelandic letters live here)
  'U+2000-206F', // general punctuation
  'U+2190-21FF', // arrows
  'U+2500-259F', // box drawing
  'U+E000-E00A,U+E0A0-E0A2,U+E0B0-E0B3', // powerline (scoped PUA)
  'U+F000-F2FF' // scoped Nerd-Font icon subset
].join(',');
// The Iosevka Nerd TTF sources are ~13 MB each and gitignored; the woff2
// subsets ARE committed. Drop the TTFs into assets/fonts-src/ (copy from
// ../svnbjrn/design-system/assets/fonts-src or a Nerd Fonts release) to
// regenerate; otherwise the committed subsets are kept as-is.
for (const [src, dest] of [
  ['assets/fonts-src/IosevkaNerdFont-Regular.ttf', 'Iosevka-Regular.woff2'],
  ['assets/fonts-src/IosevkaNerdFont-Bold.ttf', 'Iosevka-Bold.woff2']
]) {
  if (existsSync(join(root, src))) subset(src, join(outDir, dest), monoRange);
  else if (existsSync(join(outDir, dest))) console.warn(`fonts: ${src} absent — keeping committed ${dest}`);
  else throw new Error(`fonts: ${src} absent and ${dest} not built`);
}

const displayRange = ['U+0000-00FF', 'U+0100-017F', 'U+2000-206F', 'U+20AC'].join(',');
for (const w of ['Medium', 'SemiBold', 'Bold']) {
  subset(`assets/fonts-src/Rajdhani-${w}.ttf`, join(outDir, `Rajdhani-${w}.woff2`), displayRange);
}

for (const f of ['Iosevka-Regular.woff2', 'Iosevka-Bold.woff2', 'Rajdhani-Medium.woff2', 'Rajdhani-SemiBold.woff2', 'Rajdhani-Bold.woff2']) {
  if (!existsSync(join(outDir, f))) throw new Error(`missing ${f}`);
}
console.log('fonts built');
