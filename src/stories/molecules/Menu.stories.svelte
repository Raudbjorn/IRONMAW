<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Menu } from '../../lib/index';
  import type { MenuEntry } from '../../lib/components/molecules/Menu.svelte';

  const documentItems: MenuEntry[] = [
    { id: 'rename', label: 'Rename', icon: 'write', hint: 'F2' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'share', label: 'Share link', icon: 'share', submenu: true },
    { separator: true },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true }
  ];

  const sectionItems: MenuEntry[] = [
    { id: 'summary', label: 'Summary', icon: 'summary' },
    { id: 'experience', label: 'Experience', icon: 'experience' },
    { id: 'education', label: 'Education', icon: 'education' },
    { id: 'skills', label: 'Skills', icon: 'skills' },
    { id: 'languages', label: 'Languages', icon: 'languages' },
    { id: 'interests', label: 'Interests', icon: 'interests', disabled: true },
    { id: 'custom', label: 'Custom section', icon: 'plus', wide: true }
  ];

  const { Story } = defineMeta({
    title: 'Molecules/Menu',
    component: Menu,
    args: { label: 'Document actions', items: documentItems, open: false },
    argTypes: { onselect: { table: { disable: true } }, items: { control: 'object' } },
    parameters: { docs: { description: { component: 'A trigger button and its popup of actions. Fixed-positioned from the trigger, flips when out of room. Arrow keys, Home/End, Enter/Space to choose, Escape to close and return focus. Danger rows use the error colour.' } } }
  });
</script>

<Story name="Icon trigger" />

<Story name="Open" args={{ open: true }} />

<Story name="Text trigger, two columns" args={{ label: 'Add section', text: 'Add section', icon: 'plus', variant: 'secondary', items: sectionItems, columns: 2, title: 'Sections', open: true }} />
