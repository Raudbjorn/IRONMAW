// Mirrors src/stories/molecules/AppHeader.stories.svelte
import * as React from 'react';
import { AppHeader, Button, Tabs, Text } from '@svnbjrn/ironmaw';

const modes = (
  <Tabs
    aria-label="Editor mode"
    value="write"
    tabs={[
      { id: 'write', label: 'Write', tabId: 'ah-t1', panelId: 'ah-p1' },
      { id: 'design', label: 'Design', tabId: 'ah-t2', panelId: 'ah-p2' },
      { id: 'check', label: 'Check', count: 4, tabId: 'ah-t3', panelId: 'ah-p3' },
    ]}
  />
);

const actions = (
  <>
    <Button variant="ghost" size="sm" icon="history" label="Version history" />
    <Button variant="secondary" size="sm" icon="share">Share</Button>
    <Button size="sm" icon="download">Download PDF</Button>
  </>
);

const saved = <Text size="xs" tone="faint">Saved</Text>;

export const TitleOnly = () => (
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" />
);

export const FullEditorBar = () => (
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" status={saved} center={modes} end={actions} />
);

export const LongTitle = () => (
  <div style={{ width: 420 }}>
    <AppHeader
      back={{ label: 'Back to library' }}
      title="Umsókn um starf hugbúnaðarsérfræðings hjá Dæmafyrirtæki ehf. í Kópavogi"
      end={actions}
    />
  </div>
);
