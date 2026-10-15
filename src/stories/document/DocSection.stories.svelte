<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DocEntry, DocSection } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Document/DocSection',
    component: DocSection,
    args: { title: 'Menntun', columns: 1 },
    argTypes: { columns: { control: 'inline-radio', options: [1, 2] }, children: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'A titled CV section: an h2 in the display face (uppercase by CSS only) with a rust tick, then entries in one or two columns.' } } }
  });
</script>

<Story name="One column">
  {#snippet template({ children: _, ...args })}
    <div data-theme="bone" style="background: var(--wm-bg); color: var(--wm-text); padding: 32px">
      <DocSection {...args}>
        <DocEntry title="BSc í tölvunarfræði" subtitle="Dæmaháskóli" date="2012 – 2015" />
        <DocEntry title="Stúdentspróf" subtitle="Dæmaskóli" date="2008 – 2012" />
      </DocSection>
    </div>
  {/snippet}
</Story>

<Story name="Two columns" args={{ title: 'Forritunarmál o.fl.', columns: 2 }}>
  {#snippet template({ children: _, ...args })}
    <div data-theme="bone" style="background: var(--wm-bg); color: var(--wm-text); padding: 32px">
      <DocSection {...args}>
        <DocEntry title="Forritunarmál"><p>Java, C#, Python, C++</p></DocEntry>
        <DocEntry title="Gagnagrunnar"><p>MySQL, SQL Server, PostgreSQL</p></DocEntry>
        <DocEntry title="Vefforritun"><p>JavaScript, HTML/CSS</p></DocEntry>
        <DocEntry title="Annað"><p>Siteimprove</p></DocEntry>
      </DocSection>
    </div>
  {/snippet}
</Story>
