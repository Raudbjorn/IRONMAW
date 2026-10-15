<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ReorderList, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/ReorderList',
    component: ReorderList,
    args: { 'aria-label': 'Sections' },
    argTypes: {
      items: { control: 'object' },
      detail: { table: { disable: true } },
      onmove: { table: { disable: true } },
      onvisibility: { table: { disable: true } },
      onexpand: { table: { disable: true } },
      onmenu: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'The sortable section list. Controlled: it reports moves, the consumer reorders. Drag the handle, or press Alt with Up or Down on it; moves are announced. The drop line is teal.' } } }
  });
</script>

<script lang="ts">
  import type { ReorderItem } from '../../lib/components/molecules/ReorderList.svelte';
  import type { MenuEntry } from '../../lib/components/molecules/Menu.svelte';

  const initial: ReorderItem[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience', count: 3 },
    { id: 'education', label: 'Education', count: 2 },
    { id: 'skills', label: 'Skills', count: 12, hidden: true },
    { id: 'languages', label: 'Languages', count: 2, meta: 'Íslenska, Enska' }
  ];
  let items = $state<ReorderItem[]>(initial.map((i) => ({ ...i })));
  const menu: MenuEntry[] = [
    { id: 'rename', label: 'Rename', icon: 'write' },
    { id: 'delete', label: 'Remove section', icon: 'trash', danger: true }
  ];

  function move(id: string, to: number) {
    const from = items.findIndex((i) => i.id === id);
    if (from < 0) return;
    const next = items.slice();
    const [m] = next.splice(from, 1);
    if (m) next.splice(to, 0, m);
    items = next;
  }
  const patch = (id: string, p: Partial<ReorderItem>) => (items = items.map((i) => (i.id === id ? { ...i, ...p } : i)));
</script>

<Story name="Interactive" asChild>
  <ReorderList
    {items}
    aria-label="Sections"
    {menu}
    onmove={move}
    onvisibility={(id, hidden) => patch(id, { hidden })}
    onexpand={(id, expanded) => patch(id, { expanded })}
  >
    {#snippet detail(item)}
      <Text size="sm" tone="muted">Fields for {item.label} appear here.</Text>
    {/snippet}
  </ReorderList>
</Story>

<Story name="Static" args={{ items: initial, 'aria-label': 'Sections' }} />
