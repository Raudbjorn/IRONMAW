// Built-in edition registry — the single place a compiled-in edition is
// declared. The token build iterates this list; adding an edition is one
// .tokens.json file plus one entry here.
//
// Editions, in the Wormian vernacular:
//   oxide — the charcoal, teal, rust and slate expression (default, dark).
//   bone  — the paper-toned expression proposed for documents and reading.
//           Opt-in only (data-theme="bone"); it never auto-switches on
//           prefers-color-scheme because the dark direction is the one the
//           owner selected.
//
// Node's native type-stripping runs this file directly from the build script,
// so keep the syntax erasable (no enums, no parameter properties).

export interface ThemeSpec {
  /** data-theme attribute value and output file stem. */
  name: string;
  /** Token documents merged over primitives + scale; later files win. */
  files: string[];
  /** Emitted at :root (exactly one edition must set this). */
  default?: boolean;
}

export const themes: readonly ThemeSpec[] = [
  { name: 'oxide', files: ['oxide.tokens.json'], default: true },
  { name: 'bone', files: ['bone.tokens.json'] }
];
