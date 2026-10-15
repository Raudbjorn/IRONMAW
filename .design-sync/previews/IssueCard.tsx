// Mirrors src/stories/molecules/IssueCard.stories.svelte
import * as React from 'react';
import { Button, IssueCard, Stack, Text } from '@svnbjrn/ironmaw';

const body = (
  <Text size="sm" tone="muted">„2019 til nú“ may be read as a single year. Write a start and end month, for example „mars 2019 – nú“.</Text>
);

const bodyClaim = (
  <Text size="sm" tone="muted">„Lækkaði kostnað verulega“ has no number. Add the amount or percentage, for example „lækkaði kostnað um 18%“.</Text>
);

const bodyContact = (
  <Text size="sm" tone="muted">The phone number and email in the header are part of an image, so they can’t be read or copied. Add them as text.</Text>
);

const bodyLink = (
  <Text size="sm" tone="muted">The portfolio is named but not linked. Add its address so a reader can open it.</Text>
);

const acts = (
  <>
    <Button variant="secondary" size="xs">Show on page</Button>
    <Button variant="ghost" size="xs">Ignore</Button>
  </>
);

export const Warning = () => (
  <IssueCard index={1} category="Parsing" title="Dates are ambiguous" actions={acts}>{body}</IssueCard>
);

export const Active = () => (
  <IssueCard index={2} category="Content" title="Claim has no figure" active actions={acts}>{bodyClaim}</IssueCard>
);

export const StackedList = () => (
  <Stack gap={2}>
    <IssueCard index={1} title="Dates are ambiguous">{body}</IssueCard>
    <IssueCard index={2} title="Contact line is an image" tone="error">{bodyContact}</IssueCard>
    <IssueCard index={3} title="Consider adding a link" tone="accent">{bodyLink}</IssueCard>
  </Stack>
);
