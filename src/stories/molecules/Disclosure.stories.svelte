<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Avatar, Button, Disclosure, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/Disclosure',
    component: Disclosure,
    args: { title: 'Page', open: true, variant: 'section' },
    argTypes: {
      children: { table: { disable: true } },
      leading: { table: { disable: true } },
      actions: { table: { disable: true } },
      onchange: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'A collapsible group. The heading holds the toggle; actions sit beside it, never inside. Content stays mounted while closed so field values survive.' } } }
  });
</script>

<Story name="Section">
  {#snippet template({ children: _, ...args })}
    <Disclosure {...args}>
      <Text size="sm" tone="muted">Margins, spacing and paper size for every page.</Text>
    </Disclosure>
  {/snippet}
</Story>

<Story name="Closed" args={{ open: false, title: 'Typography', meta: 'Inter · 10.5 pt' }}>
  {#snippet template({ children: _, ...args })}
    <Disclosure {...args}>
      <Text size="sm" tone="muted">Font family and size.</Text>
    </Disclosure>
  {/snippet}
</Story>

<Story name="Card with leading and actions" args={{ variant: 'card', title: 'Sveinbjörn Geirsson', meta: 'Kópavogur', headingLevel: 2 }}>
  {#snippet template({ children: _, ...args })}
    <Disclosure {...args}>
      {#snippet leading()}<Avatar name="Sveinbjörn Geirsson" />{/snippet}
      {#snippet actions()}<Button variant="ghost" size="xs">Edit</Button>{/snippet}
      <Text size="sm" tone="muted">Rafpóstur, sími og vefsíða birtast efst á ferilskránni.</Text>
    </Disclosure>
  {/snippet}
</Story>
