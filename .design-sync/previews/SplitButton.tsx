// Mirrors src/stories/molecules/SplitButton.stories.svelte
import * as React from 'react';
import { SplitButton } from '@svnbjrn/ironmaw';

const items = [
  { id: 'pdf', label: 'PDF for people', icon: 'file' },
  { id: 'text', label: 'Plain text for parsers', icon: 'code' },
  { id: 'docx', label: 'Word document', icon: 'file', disabled: true },
] as const;

export const Primary = () => (
  <SplitButton label="Download PDF" icon="download" menuLabel="More download options" items={[...items]} />
);

export const Secondary = () => (
  <SplitButton label="Download PDF" icon="download" menuLabel="More download options" items={[...items]} variant="secondary" size="md" />
);

export const Loading = () => (
  <SplitButton label="Download PDF" icon="download" menuLabel="More download options" items={[...items]} loading />
);
