<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, EmptyState } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/EmptyState',
    component: EmptyState,
    args: { title: 'No CV for this application yet', icon: 'file', terrain: true },
    argTypes: {
      icon: { control: 'text' },
      terrain: { control: 'boolean' },
      children: { table: { disable: true } },
      actions: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'Centred block for an empty area: what is missing, why, and the next step. The one rust action goes in `actions`. Terrain is the quiet contour and mountain field the brand allows in empty states.' } } }
  });
</script>

<Story name="A CV for this application">
  {#snippet template({ children: _, ...args })}
    <EmptyState {...args}>
      Adapt one of your main CVs to this job. Your main CV stays as it is, and you choose which changes to keep.
      {#snippet actions()}<Button variant="primary">Adapt main CV</Button>{/snippet}
    </EmptyState>
  {/snippet}
</Story>

<Story name="No results">
  {#snippet template({ children: _, ...args })}
    <EmptyState {...args} title="No documents match" icon="search" terrain={false}>
      Nothing matches “Forritunarmál” with the filters you have on. Remove a filter or search for something else.
      {#snippet actions()}<Button variant="secondary">Clear filters</Button>{/snippet}
    </EmptyState>
  {/snippet}
</Story>
