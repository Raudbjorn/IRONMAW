// Mirrors src/stories/molecules/IssueCard.stories.svelte
import * as React from 'react';
import { Button, IssueCard, Stack, Text } from '@svnbjrn/ironmaw';

const body = (
  <Text size="sm" tone="muted">"2019 til nú" may be read as a single year. Write a start and end month, for example "mars 2019 – nú".</Text>
);

const acts = (
  <>
    <Button variant="secondary" size="xs">Show on page</Button>
    <Button variant="ghost" size="xs">Dismiss</Button>
  </>
);

export const Warning = () => (
  <IssueCard index={1} category="Parsing" title="Dates are ambiguous" actions={acts}>{body}</IssueCard>
);

export const Active = () => (
  <IssueCard index={2} category="Content" title="Claim has no figure" active actions={acts}>{body}</IssueCard>
);

export const StackedList = () => (
  <Stack gap={2}>
    <IssueCard index={1} title="Dates are ambiguous">{body}</IssueCard>
    <IssueCard index={2} title="Contact line is an image" tone="error">{body}</IssueCard>
    <IssueCard index={3} title="Consider adding a link" tone="accent">{body}</IssueCard>
  </Stack>
);
