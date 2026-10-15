<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DocEntry } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Document/DocEntry',
    component: DocEntry,
    args: { title: 'Hugbúnaðarsérfræðingur', subtitle: 'Dæmafyrirtæki ehf.', date: '2019 – 2024', location: 'Reykjavík' },
    argTypes: { children: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'One CV entry: title (h3) and subtitle left, date and place right, optional body below. Wraps on narrow pages.' } } }
  });
</script>

<Story name="With details">
  {#snippet template({ children: _, ...args })}
    <DocEntry {...args}>
      <ul>
        <li>Hönnun og þróun vefkerfa</li>
        <li>Umsjón með gagnagrunnum</li>
      </ul>
    </DocEntry>
  {/snippet}
</Story>

<Story name="Title only" args={{ title: 'Íslenska', subtitle: undefined, date: undefined, location: undefined }} />

<Story name="With paragraph">
  {#snippet template({ children: _, ...args })}
    <DocEntry {...args} title="Forritari" date="2015 – 2019" location="Kópavogur">
      <p>Þróun innri kerfa og samþætting við þriðja aðila.</p>
    </DocEntry>
  {/snippet}
</Story>
