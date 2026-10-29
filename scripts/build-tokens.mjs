// Token build: DTCG sources (*.tokens.json + themes.ts) → committed outputs.
//   src/lib/tokens/scale.css                    @layer wm.base (scale + brand anchors)
//   src/lib/tokens/colors.css                   @layer wm.theme, every registry edition
//   src/lib/tokens/palette.ts                   generated TS view
//   src/lib/tokens/resolved/<edition>.tokens.json   flat map for non-JS consumers
// Supported DTCG subset (fail-closed): $value/$type/$description, group-level
// $type inheritance, "{dot.path}" aliases, color as #hex, dimension as
// {value, unit}, fontFamily as string[], fontWeight/number, shadow composite.
// Errors are collected and reported together; the build exits non-zero.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes } from '../src/lib/tokens/themes.ts';

const here = dirname(fileURLToPath(import.meta.url));
export const TOKENS_DIR = join(here, '..', 'src', 'lib', 'tokens');
const PREFIX = 'wm';

const errors = [];
const fail = (path, message) => errors.push(`${path}: ${message}`);

function flatten(doc, source) {
  // Returns Map<path, {type, value, description}> for every $value node.
  const out = new Map();
  const walk = (node, path, inheritedType) => {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) {
      return fail(path || source, 'group must be an object');
    }
    const type = node.$type ?? inheritedType ?? null;
    if ('$value' in node) {
      if (!type) return fail(path, 'token has no $type (own or inherited)');
      out.set(path, { type, value: node.$value, description: node.$description });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (!/^[a-z0-9-]+$/.test(k)) fail(path ? `${path}.${k}` : k, 'names are lowercase kebab-case');
      walk(v, path ? `${path}.${k}` : k, type);
    }
  };
  walk(doc, '', null);
  return out;
}

function resolveAliases(map) {
  const seen = new Set();
  const resolveOne = (path, chain = []) => {
    const tok = map.get(path);
    if (!tok) return fail(chain[chain.length - 1] ?? path, `unknown alias {${path}}`);
    if (typeof tok.value === 'string' && /^\{[^}]+\}$/.test(tok.value)) {
      const target = tok.value.slice(1, -1);
      if (chain.includes(target)) return fail(path, `alias cycle ${[...chain, target].join(' → ')}`);
      const resolved = resolveOne(target, [...chain, path]);
      if (resolved === undefined) return undefined;
      if (resolved.type !== tok.type) fail(path, `alias type mismatch (${tok.type} → ${resolved.type})`);
      tok.value = resolved.value;
    }
    seen.add(path);
    return tok;
  };
  for (const path of map.keys()) resolveOne(path);
}

const HEX = /^#[0-9A-Fa-f]{6}$/;
function cssValue(path, tok) {
  const { type, value } = tok;
  switch (type) {
    case 'color':
      if (typeof value !== 'string' || !HEX.test(value)) return fail(path, 'color must be a 6-digit hex string');
      return value.toUpperCase();
    case 'dimension':
      if (typeof value !== 'object' || typeof value.value !== 'number' || !['px', 'rem', 'em', 'ch'].includes(value.unit))
        return fail(path, 'dimension must be {value:number, unit:px|rem|em|ch}');
      return `${value.value}${value.unit}`;
    case 'fontFamily':
      if (!Array.isArray(value) || value.some((f) => typeof f !== 'string')) return fail(path, 'fontFamily must be string[]');
      return value.map((f) => (/[\s]/.test(f) ? `'${f}'` : f)).join(', ');
    case 'fontWeight':
    case 'number':
      if (typeof value !== 'number') return fail(path, `${type} must be a number`);
      return String(value);
    case 'shadow': {
      const s = value;
      if (typeof s !== 'object' || !s.color || !s.offsetX || !s.offsetY || !s.blur) return fail(path, 'shadow needs color/offsetX/offsetY/blur');
      return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.color}`;
    }
    default:
      return fail(path, `unknown $type ${type}`);
  }
}

const read = (file) => JSON.parse(readFileSync(join(TOKENS_DIR, file), 'utf8'));
const primitives = flatten(read('primitives.tokens.json'), 'primitives.tokens.json');
const scaleDoc = flatten(read('scale.tokens.json'), 'scale.tokens.json');

// Editions: merge primitives + each edition file so aliases resolve.
const editions = themes.map((t) => {
  const merged = new Map(primitives);
  for (const f of t.files) for (const [k, v] of flatten(read(f), f)) merged.set(k, v);
  resolveAliases(merged);
  const colors = [...merged].filter(([k]) => k.startsWith('color.'));
  const vars = colors.map(([k, tok]) => [k.slice('color.'.length), cssValue(k, tok), tok.description]);
  return { ...t, vars };
});
if (editions.filter((e) => e.default).length !== 1) fail('themes.ts', 'exactly one edition must be default');

// Scale + brand anchors (no aliases expected, but resolve anyway).
resolveAliases(scaleDoc);
const baseVars = [...scaleDoc].map(([k, tok]) => {
  const name = k.startsWith('scale.') ? k.slice('scale.'.length) : k.replace(/\./g, '-');
  return [name, cssValue(k, tok), tok.description];
});

if (errors.length) {
  for (const e of errors) console.error(`[tokens] ${e}`);
  process.exit(1);
}

const header = '/* GENERATED by scripts/build-tokens.mjs — do not edit by hand. */\n';
// Design-sync kind tags for scale tokens whose kind the value alone does not reveal.
const KIND_TAGS = [[/^lh-/, 'font'], [/^z-/, 'other']];
const kindTag = (n) => {
  const hit = KIND_TAGS.find(([re]) => re.test(n));
  return hit ? ` /* @kind ${hit[1]} */` : '';
};
const block = (sel, vars, indent) =>
  `${indent}${sel} {\n${vars.map(([n, v]) => `${indent}  --${PREFIX}-${n}: ${v};${kindTag(n)}`).join('\n')}\n${indent}}\n`;

const scaleCss = `${header}@layer ${PREFIX}.base {\n${block(':root', baseVars, '  ')}}\n`;
let colorsCss = `${header}@layer ${PREFIX}.theme {\n`;
for (const e of editions) {
  if (e.default) colorsCss += block(':root', e.vars, '  ');
  colorsCss += block(`[data-theme="${e.name}"]`, e.vars, '  ');
}
colorsCss += '}\n';

const names = editions[0].vars.map(([n]) => n);
let paletteTs = `// GENERATED by scripts/build-tokens.mjs — do not edit by hand.
// Source of truth: the DTCG token files (*.tokens.json) + themes.ts.
// Keys mirror the --${PREFIX}-* CSS custom properties (without the prefix).

export type Palette = Record<string, string>;

export type TokenName =
${names.map((n) => `  | '${n}'`).join('\n')};

/** The four declared brand anchors from identity board B2. */
export const brand = {
${baseVars.filter(([n]) => n.startsWith('brand-')).map(([n, v]) => `  '${n.slice(6)}': '${v}'`).join(',\n')}
} as const;

`;
for (const e of editions) {
  paletteTs += `export const ${e.name}: Record<TokenName, string> = {\n${e.vars.map(([n, v]) => `  '${n}': '${v}'`).join(',\n')}\n};\n\n`;
}
paletteTs += `export const editions = {\n${editions.map((e) => `  ${e.name}`).join(',\n')}\n} as const;\n\nexport type EditionName = keyof typeof editions;\n`;

mkdirSync(join(TOKENS_DIR, 'resolved'), { recursive: true });
const outputs = [
  [join(TOKENS_DIR, 'scale.css'), scaleCss],
  [join(TOKENS_DIR, 'colors.css'), colorsCss],
  [join(TOKENS_DIR, 'palette.ts'), paletteTs],
  ...editions.map((e) => [
    join(TOKENS_DIR, 'resolved', `${e.name}.tokens.json`),
    JSON.stringify(
      { $edition: e.name, $prefix: `--${PREFIX}-`, color: Object.fromEntries(e.vars.map(([n, v]) => [n, v])), scale: Object.fromEntries(baseVars.map(([n, v]) => [n, v])) },
      null,
      2
    ) + '\n'
  ])
];
for (const [path, content] of outputs) {
  writeFileSync(path, content);
  console.log('wrote', path);
}
