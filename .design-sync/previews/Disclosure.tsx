// Mirrors src/stories/molecules/Disclosure.stories.svelte
import * as React from 'react';
import { Avatar, Button, Disclosure, Text } from '@svnbjrn/ironmaw';

export const Section = () => (
  <Disclosure title="Page" open>
    <Text size="sm" tone="muted">Margins, spacing and paper size for every page.</Text>
  </Disclosure>
);

export const Closed = () => (
  <Disclosure title="Typography" meta="Inter · 10.5 pt" open={false}>
    <Text size="sm" tone="muted">Font family and size.</Text>
  </Disclosure>
);

export const CardWithLeadingAndActions = () => (
  <Disclosure
    variant="card"
    title="Sveinbjörn Geirsson"
    meta="Kópavogur"
    headingLevel={2}
    open
    leading={<Avatar name="Sveinbjörn Geirsson" />}
    actions={<Button variant="ghost" size="xs">Edit</Button>}
  >
    <Text size="sm" tone="muted">Rafpóstur, sími og vefsíða birtast efst á ferilskránni.</Text>
  </Disclosure>
);
