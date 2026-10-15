// Mirrors src/stories/layout/Workspace.stories.svelte
import * as React from 'react';
import { Button, Heading, Kicker, Panel, PageCanvas, PageSheet, Stack, Text, Workspace } from '@svnbjrn/ironmaw';

const side = (
  <Stack gap={3}>
    <Kicker>Ferilskrá</Kicker>
    <Panel padding={3}><Text size="sm">Starfsreynsla</Text></Panel>
    <Panel padding={3}><Text size="sm">Menntun</Text></Panel>
    <Panel padding={3}><Text size="sm">Tungumál</Text></Panel>
  </Stack>
);

const top = (
  <Stack direction="row" gap={3} align="center">
    <Heading level={2}>Ferilskrá 2026</Heading>
    <Button size="sm">Share</Button>
  </Stack>
);

export const EditorFrame = () => (
  <div style={{ height: 520 }}>
    <Workspace sidebarLabel="Editor" fill={false} header={top} sidebar={side}>
      <PageCanvas zoom="fit">
        <PageSheet label="Page 1 · A4"><Text>Sveinbjörn Geirsson, Kópavogur</Text></PageSheet>
      </PageCanvas>
    </Workspace>
  </div>
);

export const WideSidebar = () => (
  <div style={{ height: 360 }}>
    <Workspace sidebarLabel="Editor" fill={false} sidebarWidth="420px" sidebar={side}>
      <Text>Main canvas</Text>
    </Workspace>
  </div>
);
