// Mirrors src/stories/molecules/Menu.stories.svelte
import * as React from 'react';
import { Menu } from '@svnbjrn/ironmaw';

const documentItems = [
  { id: 'rename', label: 'Rename', icon: 'write', hint: 'F2' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'share', label: 'Share link', icon: 'share', submenu: true },
  { separator: true },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
] as const;

const sectionItems = [
  { id: 'summary', label: 'Summary', icon: 'summary' },
  { id: 'experience', label: 'Experience', icon: 'experience' },
  { id: 'education', label: 'Education', icon: 'education' },
  { id: 'skills', label: 'Skills', icon: 'skills' },
  { id: 'languages', label: 'Languages', icon: 'languages' },
  { id: 'interests', label: 'Interests', icon: 'interests', disabled: true },
  { id: 'custom', label: 'Custom section', icon: 'plus', wide: true },
] as const;

export const IconTrigger = () => <Menu label="Document actions" items={[...documentItems]} />;

export const Open = () => (
  <div style={{ minHeight: 240 }}>
    <Menu label="Document actions" items={[...documentItems]} open />
  </div>
);

export const TextTriggerTwoColumns = () => (
  <div style={{ minHeight: 340 }}>
    <Menu
      label="Add section"
      text="Add section"
      icon="plus"
      variant="secondary"
      items={[...sectionItems]}
      columns={2}
      title="Sections"
      open
    />
  </div>
);
