// Mirrors src/stories/layout/PageCanvas.stories.svelte
import * as React from 'react';
import { Button, Heading, PageCanvas, PageSheet, Tabs, Text } from '@svnbjrn/ironmaw';

const sheets = (
  <>
    <PageSheet label="Page 1 · A4">
      <Heading level={1}>Sveinbjörn Geirsson</Heading>
      <Text tone="muted">Kópavogur</Text>
    </PageSheet>
    <PageSheet label="Page 2 · A4">
      <Text>Menntun og tungumál: íslenska, enska.</Text>
    </PageSheet>
  </>
);

const views = (
  <Tabs
    aria-label="Preview view"
    value="person"
    tabs={[
      { id: 'person', label: 'What a person sees', tabId: 'pc-t1', panelId: 'pc-p1' },
      { id: 'parser', label: 'What a parser reads', tabId: 'pc-t2', panelId: 'pc-p2' },
    ]}
  />
);

const bar = <Button variant="secondary" size="xs" icon="zoom-fit" label="Fit page" />;

export const Fit = () => (
  <div style={{ height: 480 }}>
    <PageCanvas zoom="fit">{sheets}</PageCanvas>
  </div>
);

export const WithToolbarAndOverlay = () => (
  <div style={{ height: 480 }}>
    <PageCanvas zoom={75} toolbar={views} overlay={bar}>{sheets}</PageCanvas>
  </div>
);

export const ZoomedIn = () => (
  <div style={{ height: 480 }}>
    <PageCanvas zoom={125}>{sheets}</PageCanvas>
  </div>
);
