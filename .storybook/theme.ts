import { create } from 'storybook/theming';
import { oxide } from '../src/lib/tokens/palette';

// The manager chrome dressed in the system's own oxide ramp, read straight
// from the token source so the Storybook UI can't drift from the tokens.
const wm = (token: keyof typeof oxide): string => oxide[token];

export default create({
  base: 'dark',
  brandTitle: 'IRONMAW · Wormian Bones',
  brandUrl: 'https://sveinbjorn.dev',
  brandTarget: '_blank',
  colorPrimary: wm('action'),
  colorSecondary: wm('accent'),
  appBg: wm('bg'),
  appContentBg: wm('surface-1'),
  appPreviewBg: wm('bg'),
  appBorderColor: wm('border'),
  appBorderRadius: 4,
  fontBase: "'Inter', system-ui, sans-serif",
  fontCode: "'Iosevka', ui-monospace, 'Courier New', monospace",
  textColor: wm('text'),
  textInverseColor: wm('bg'),
  textMutedColor: wm('text-muted'),
  barBg: wm('surface-1'),
  barTextColor: wm('text-muted'),
  barHoverColor: wm('accent'),
  barSelectedColor: wm('action'),
  buttonBg: wm('surface-2'),
  buttonBorder: wm('border'),
  booleanBg: wm('surface-2'),
  booleanSelectedBg: wm('surface-3'),
  inputBg: wm('surface-2'),
  inputBorder: wm('border-strong'),
  inputTextColor: wm('text'),
  inputBorderRadius: 2
});
