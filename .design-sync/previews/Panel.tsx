// Mirrors src/stories/layout/Panel.stories.svelte
import * as React from 'react';
import { Heading, Kicker, Panel, Stack, StatusLabel, Text } from '@svnbjrn/ironmaw';

export const Basic = () => (
  <Panel>
    <Text>Select a document to read its content and sources.</Text>
  </Panel>
);

export const ReaderHeader = () => (
  <Panel
    as="section"
    aria-label="Reader"
    padding={4}
    header={
      <Stack gap={2}>
        <Kicker>CVs · Applications · Landsnet</Kicker>
        <Heading level={2}>cv-sveinbjorn-geirsson.is.pdf</Heading>
        <Stack direction="row" gap={2} align="center" wrap>
          <Text size="sm" tone="muted" as="span">Icelandic · PDF · 6 extracted passages</Text>
          <StatusLabel status="snapshot" />
        </Stack>
      </Stack>
    }
    footer={<Text size="xs" tone="faint">Extracted text keeps paragraphs, not the original layout. Original preview is not available yet.</Text>}
  >
    <Text prose>{`Ferilskrá
Sveinbjörn Geirsson

Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.`}</Text>
  </Panel>
);

export const Surfaces = () => (
  <Stack direction="row" gap={3} wrap>
    <Panel surface={1}><Text>surface-1</Text></Panel>
    <Panel surface={2}><Text>surface-2</Text></Panel>
    <Panel surface={3}><Text>surface-3</Text></Panel>
    <Panel surface={2} elevated><Text>elevated</Text></Panel>
  </Stack>
);
