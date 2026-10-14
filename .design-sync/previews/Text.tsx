// Mirrors src/stories/atoms/Text.stories.svelte
import * as React from 'react';
import { Stack, Text } from '@svnbjrn/ironmaw';

export const Default = () => <Text>Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</Text>;

export const Tones = () => (
  <Stack gap={2}>
    <Text tone="strong">Strong — document titles and the reader heading.</Text>
    <Text>Default — body copy and excerpts.</Text>
    <Text tone="muted">Muted — language · format, secondary metadata.</Text>
    <Text tone="faint">Faint — hints and placeholders, still AA on surface-1.</Text>
    <Text tone="accent">Accent — teal, for links and matched emphasis.</Text>
    <Text tone="action">Action — rust, sparingly, for an active indicator in text.</Text>
  </Stack>
);

export const Sizes = () => (
  <Stack gap={2}>
    <Text size="xs">xs — 12px labels inside chips and status pills</Text>
    <Text size="sm">sm — 13px helper text</Text>
    <Text size="base">base — 14px list text</Text>
    <Text size="lg">lg — 16px reading text</Text>
    <Text size="xl">xl — 18px lead</Text>
  </Stack>
);

export const Mono = () => (
  <Stack gap={2}>
    <Text mono size="sm">library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.pdf</Text>
    <Text mono size="xs" tone="muted">Passage 2 · Page 1 · from line 34</Text>
  </Stack>
);

export const Prose = () => (
  <Text prose>{`Starfsreynsla

Hver færsla tilgreinir starfsheiti, vinnustað og tímabil, ásamt stuttri lýsingu á helstu verkefnum. Extracted text keeps paragraphs, not the original layout.`}</Text>
);
