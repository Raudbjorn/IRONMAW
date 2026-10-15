// Mirrors src/stories/molecules/ReorderList.stories.svelte
import * as React from 'react';
import { ReorderList, Text } from '@svnbjrn/ironmaw';

type Item = { id: string; label: string; count?: number; hidden?: boolean; expanded?: boolean; meta?: string };

const initial: Item[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience', count: 3 },
  { id: 'education', label: 'Education', count: 2 },
  { id: 'skills', label: 'Skills', count: 12, hidden: true },
  { id: 'languages', label: 'Languages', count: 2, meta: 'Íslenska, Enska' },
];

const menu = [
  { id: 'rename', label: 'Rename', icon: 'write' },
  { id: 'delete', label: 'Remove section', icon: 'trash', danger: true },
] as const;

export const Interactive = () => {
  const [items, setItems] = React.useState<Item[]>(initial);
  const patch = (id: string, p: Partial<Item>) =>
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...p } : i)));
  return (
    <ReorderList
      aria-label="Sections"
      items={items}
      menu={[...menu]}
      onMove={(id: string, to: number) =>
        setItems((cur) => {
          const from = cur.findIndex((i) => i.id === id);
          if (from < 0) return cur;
          const next = cur.slice();
          const [m] = next.splice(from, 1);
          next.splice(to, 0, m);
          return next;
        })
      }
      onVisibility={(id: string, hidden: boolean) => patch(id, { hidden })}
      onExpand={(id: string, expanded: boolean) => patch(id, { expanded })}
      detail={(item: Item) => <Text size="sm" tone="muted">Fields for {item.label} appear here.</Text>}
    />
  );
};

export const Static = () => <ReorderList aria-label="Sections" items={initial} />;
