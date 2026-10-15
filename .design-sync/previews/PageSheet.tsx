// Mirrors src/stories/layout/PageSheet.stories.svelte
import * as React from 'react';
import { Heading, PageSheet, Stack, Text } from '@svnbjrn/ironmaw';

export const A4Page = () => (
  <PageSheet size="a4" label="Page 1 · A4" edition="bone">
    <Stack gap={3}>
      <Heading level={1}>Sveinbjörn Geirsson</Heading>
      <Text tone="muted">Hugbúnaðarsérfræðingur · Kópavogur</Text>
      <Text>Reynsla af vefforritun, gagnagrunnum og þjónustuþróun hjá Dæmafyrirtæki ehf.</Text>
    </Stack>
  </PageSheet>
);

export const LetterPage = () => (
  <PageSheet size="letter" label="Page 1 · Letter">
    <Stack gap={3}>
      <Heading level={1}>Sveinbjörn Geirsson</Heading>
      <Text>Software engineer, Kópavogur.</Text>
    </Stack>
  </PageSheet>
);

export const FollowsTheAppEdition = () => (
  <PageSheet edition="inherit" label="Page 1 · A4">
    <Text>This sheet takes the surrounding edition instead of Bone.</Text>
  </PageSheet>
);
