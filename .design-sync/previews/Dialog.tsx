// Mirrors src/stories/molecules/Dialog.stories.svelte
import * as React from 'react';
import { Button, Dialog, Stack, Suture, Text } from '@svnbjrn/ironmaw';

const mainCvs = [
  { name: 'Sveinbjörn Geirsson — aðal ferilskrá', meta: 'Edited yesterday' },
  { name: 'Sveinbjörn Geirsson — English', meta: 'Edited 3 March' }
];
const applications = [
  { name: 'Seðlabanki Íslands — sérfræðingur', meta: 'Adapted from the main CV' },
  { name: 'Dæmafyrirtæki ehf. — forritari', meta: 'Adapted from the English CV' }
];

const choiceStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px var(--wm-space-3)',
  textAlign: 'left',
  background: 'var(--wm-surface-1)',
  color: 'var(--wm-text)',
  border: '1px solid var(--wm-border-strong)',
  borderRadius: 'var(--wm-radius-sm)',
  fontFamily: 'var(--wm-font-sans)',
  cursor: 'pointer'
};

const Choice = ({ name, meta }: { name: string; meta: string }) => (
  <button type="button" style={choiceStyle}>
    <span style={{ fontSize: 'var(--wm-fs-base)', lineHeight: 'var(--wm-lh-normal)', color: 'var(--wm-text-strong)' }}>{name}</span>
    <span style={{ fontSize: 'var(--wm-fs-xs)', lineHeight: 'var(--wm-lh-normal)', color: 'var(--wm-text-muted)' }}>{meta}</span>
  </button>
);

export const OpenACV = () => (
  <div style={{ minHeight: 720 }}>
    <Dialog open title="Open a CV" description="Choose a main CV or an application to work on.">
      <Stack gap={4}>
        <Stack gap={2}>
          <Suture label="Main CVs" />
          {mainCvs.map((c) => <Choice key={c.name} {...c} />)}
        </Stack>
        <Stack gap={2}>
          <Suture label="Applications" />
          {applications.map((c) => <Choice key={c.name} {...c} />)}
        </Stack>
      </Stack>
    </Dialog>
  </div>
);

export const Confirmation = () => (
  <div style={{ minHeight: 520 }}>
    <Dialog
      open
      size="sm"
      dismissible={false}
      icon="warning"
      title="Discard your edits?"
      description="Three passages have changes that are not saved. They will be lost."
      footer={
        <>
          <Button variant="secondary">Keep editing</Button>
          <Button variant="danger">Discard edits</Button>
        </>
      }
    />
  </div>
);

export const InformationWithClose = () => (
  <div style={{ minHeight: 520 }}>
    <Dialog open size="sm" icon="info" title="About this CV">
      <Text>This is a copy of your main CV. Changes you make here do not touch the original.</Text>
    </Dialog>
  </div>
);
