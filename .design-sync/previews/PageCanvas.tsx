// Mirrors src/stories/layout/PageCanvas.stories.svelte
import * as React from 'react';
import { Heading, PageCanvas, PageSheet, SegmentedControl, Text, ZoomControl } from '@svnbjrn/ironmaw';

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
  <SegmentedControl
    aria-label="Preview view"
    size="sm"
    value="person"
    options={[
      { id: 'person', label: 'What a person sees', icon: 'file' },
      { id: 'parser', label: 'What a parser reads', icon: 'code' },
    ]}
  />
);

const bar = <ZoomControl value="fit" pageCount={2} />;

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
