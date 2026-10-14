// Mirrors src/stories/atoms/Input.stories.svelte
import * as React from 'react';
import { Input, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Input label="Employer display name" placeholder="Seðlabanki Íslands" />;

export const States = () => (
  <Stack gap={4}>
    <Input label="With hint" hint="Shown as the employer name in filters and entries." placeholder="Seðlabanki Íslands" />
    <Input label="With error" value="sedlabanki" error="Use the reviewed Icelandic spelling, not the folder slug." />
    <Input label="Mono" mono value="02-applications/sedlabanki/sedlabanki-2025-01/inputs" />
    <Input label="Disabled" value="Not editable in this slice" disabled />
  </Stack>
);
