// Shared build-time color conversion; invalid input is returned as null.
export function hexToRgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const chromeRoles = {
  frame: 'bg', frame_inactive: 'surface-2',
  frame_incognito: 'bg', frame_incognito_inactive: 'surface-2',
  background_tab: 'surface-1', background_tab_inactive: 'surface-1',
  background_tab_incognito: 'surface-1', background_tab_incognito_inactive: 'surface-1',
  toolbar: 'surface-3', toolbar_text: 'text', toolbar_button_icon: 'text',
  tab_text: 'text-strong', bookmark_text: 'text',
  tab_background_text: 'text-muted', tab_background_text_inactive: 'text-muted',
  tab_background_text_incognito: 'text-muted', tab_background_text_incognito_inactive: 'text-muted',
  omnibox_background: 'surface-1', omnibox_text: 'text',
  ntp_background: 'bg', ntp_text: 'text', ntp_link: 'accent', ntp_header: 'structure-text'
};
