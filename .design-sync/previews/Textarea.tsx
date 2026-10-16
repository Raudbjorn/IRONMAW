// Mirrors src/stories/atoms/Textarea.stories.svelte
import * as React from 'react';
import { Textarea, Stack } from '@svnbjrn/ironmaw';

const summary =
  'Hugbúnaðarsérfræðingur með reynslu af vefforritun og gagnagrunnum. Hef unnið í litlum teymum og stærri verkefnum, bæði í opinbera geiranum og einkageiranum.';

export const Default = () => (
  <Textarea label="Summary" placeholder="Two or three sentences about your work." value="" rows={4} />
);

export const WithCount = () => (
  <Stack gap={4}>
    <Textarea label="Summary" maxlength={1000} value={summary} hint="Shown at the top of the CV." />
    <Textarea label="Summary, near the limit" maxlength={165} value={summary} />
  </Stack>
);

export const States = () => (
  <Stack gap={4}>
    <Textarea label="With error" value="Short" error="Write at least two sentences." />
    <Textarea label="Read-only" readonly readonlyHint="Edit this in the main CV." value={summary} />
    <Textarea label="Disabled" disabled value="Not editable in this slice" />
  </Stack>
);
