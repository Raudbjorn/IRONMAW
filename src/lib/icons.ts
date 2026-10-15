// IRONMAW icon set: authored line icons on a 24-unit grid, one stroke weight,
// round joins. Stored as SVG path data (not components) so the same drawings
// serve the Svelte `Icon` component, the React bridge and native consumers
// (the egui app can tessellate these paths). Every glyph is stroke-only:
// render with fill="none" stroke="currentColor".
//
// Small dots are drawn as r=1 circles so the stroke fills them at every size.

const dot = (x: number, y: number) => `M${x - 1} ${y}a1 1 0 1 0 2 0a1 1 0 1 0-2 0`;
const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const ICONS = {
  // Navigation and disclosure
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  more: [dot(5, 12), dot(12, 12), dot(19, 12)].join(''),
  menu: 'M4 7h16M4 12h16M4 17h16',
  grip: [dot(9, 6), dot(15, 6), dot(9, 12), dot(15, 12), dot(9, 18), dot(15, 18)].join(''),

  // Actions
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  search: `${ring(10.5, 10.5, 6.5)}M15.5 15.5L20 20`,
  write: 'M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16zM13.5 6.5l4 4',
  design: `M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z${dot(7.5, 11.5)}${dot(10, 7.5)}${dot(14.5, 7.5)}`,
  checklist: 'M11 6h9M11 12h9M11 18h9M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17',
  history: 'M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8M12 7.5V12l3 2',
  assist: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  share: 'M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  download: 'M12 3v12M7.5 10.5L12 15l4.5-4.5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4',
  copy: 'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM5 15H4.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5V5',
  trash: 'M4 7h16M10 11v6M14 11v6M5.5 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5L18.5 7M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7',
  'zoom-fit': 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
  heading: 'M5 6V4.5h14V6M12 4.5v15M9 19.5h6',

  // Visibility and state
  eye: `M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z${ring(12, 12, 3)}`,
  'eye-off':
    'M3 3l18 18M10.6 5.6A10 10 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7M6.6 6.6C4 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.6 9.6 0 0 0 4.2-.9M9.9 9.9a3 3 0 0 0 4.2 4.2',
  saved: 'M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.6a4.3 4.3 0 0 1-.5 9.9zM9.5 13.5l2 2 3.5-3.5',
  unsaved: 'M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.6a4.3 4.3 0 0 1-.5 9.9zM12 11v3.5M12 16.6v.1',
  warning: 'M12 3.5L21.5 20h-19zM12 10v4M12 16.8v.2',
  info: `${ring(12, 12, 9)}M12 11v5M12 7.9v.2`,
  error: `${ring(12, 12, 9)}M9 9l6 6M15 9l-6 6`,
  success: `${ring(12, 12, 9)}M8 12.5l2.8 2.8L16 10`,
  refresh: 'M20 12a8 8 0 0 1-14.3 4.9M4 12A8 8 0 0 1 18.3 7.1M18.5 3v4.5H14M5.5 21v-4.5H10',

  // Documents and source views
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
  code: 'M8 4H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 4h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1',
  image: `M3.5 5.5A1.5 1.5 0 0 1 5 4h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5zM3.5 16l5-5 4 4 3-3 5 5${dot(15.5, 8.5)}`,
  camera: `M4 8a1.5 1.5 0 0 1 1.5-1.5h2.5L9.5 4h5L16 6.5h2.5A1.5 1.5 0 0 1 20 8v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18z${ring(12, 12.5, 3)}`,
  tag: `M3.5 12.5v-8a1 1 0 0 1 1-1h8l8 8-9 9z${dot(8, 8)}`,

  // Contact
  mail: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3.5 6.5l8.5 6.5 8.5-6.5',
  phone: 'M5 3.5h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6.5 6.5l1.5-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 3.5 5 1.5 1.5 0 0 1 5 3.5z',
  location: `M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z${ring(12, 10, 2.5)}`,
  external: 'M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  globe: `${ring(12, 12, 9)}M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z`,
  user: `${ring(12, 8, 4)}M4.5 20.5a7.5 7.5 0 0 1 15 0`,
  users: `${ring(8.5, 8.5, 3.5)}M2 20a6.5 6.5 0 0 1 13 0M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 14a6.5 6.5 0 0 1 4 6`,

  // Document sections
  summary: 'M4 6h16M4 10h12M4 14h16M4 18h10',
  experience: 'M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5zM9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 13h17',
  education: 'M2.5 9.5L12 5l9.5 4.5L12 14zM6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5M21.5 9.5v5',
  skills: 'M13 3L5 13.5h6l-1 7.5 8-10.5h-6z',
  projects: 'M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5',
  awards: `${ring(12, 9, 5)}M9 13l-1.5 8 4.5-2.5 4.5 2.5L15 13`,
  certifications: 'M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6zM8.8 12l2.2 2.2 4.2-4.2',
  publications: 'M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2zM12 6.5v14',
  volunteer: 'M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 8 2.5C20 15.4 12 20 12 20z',
  languages: 'M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5.5 7M11 5c-.8 4-3.4 7-6.5 8.5M13 21l4-9 4 9M14.3 18h5.4',
  interests: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  references: 'M5 4.5h11.5a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2zM5 17.5a2 2 0 0 1 2-2h11.5M9 8.5h6M9 11.5h4',
  profiles: `M3.5 5.5A1.5 1.5 0 0 1 5 4h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5z${ring(9, 10.5, 2)}M6 16a3 3 0 0 1 6 0M14.5 9.5h3M14.5 13h3`,

  // Brand
  mountain: 'M2.5 19.5l6.5-11 4 6.5 2.5-3.5 6 8zM7.2 11.3L9 13l1.6-1.5'
} as const satisfies Record<string, string>;

export type IconName = keyof typeof ICONS;

/** Every icon name, in declaration order. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Stroke width in grid units for a rendered pixel size: small icons get a slightly heavier stroke so they stay legible. */
export function iconStroke(size: number): number {
  if (size <= 12) return 2.25;
  return size <= 16 ? 2 : 1.75;
}
