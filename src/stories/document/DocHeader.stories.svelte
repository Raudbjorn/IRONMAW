<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DocEntry, DocHeader, DocSection, PageSheet } from '../../lib/index';

  const contacts = [
    { kind: 'email', value: 'sveinbjorn@example.is' },
    { kind: 'phone', value: '+354 555 1234' },
    { kind: 'location', value: 'Kópavogur' },
    { kind: 'website', value: 'example.is/sveinbjorn', href: 'https://example.is/sveinbjorn' }
  ] as const;

  const { Story } = defineMeta({
    title: 'Document/DocHeader',
    component: DocHeader,
    args: { name: 'Sveinbjörn Geirsson', headline: 'Hugbúnaðarsérfræðingur', contacts: [...contacts] },
    parameters: { docs: { description: { component: 'The top of a CV page: name as the only h1, headline, a wrapping contact list and a suture with the rust tick. Real text throughout so a parser reads what a person sees. Email and phone links are derived when no href is given.' } } }
  });
</script>

<Story name="Header">
  {#snippet template(args)}
    <div data-theme="bone" style="background: var(--wm-bg); color: var(--wm-text); padding: 32px">
      <DocHeader {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Name only" args={{ headline: undefined, contacts: [] }}>
  {#snippet template(args)}
    <div data-theme="bone" style="background: var(--wm-bg); color: var(--wm-text); padding: 32px">
      <DocHeader {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Full page" asChild>
  <PageSheet label="Page 1 · A4">
    <DocHeader name="Sveinbjörn Geirsson" headline="Hugbúnaðarsérfræðingur" contacts={[...contacts]} />

    <DocSection title="Starfsreynsla">
      <DocEntry title="Hugbúnaðarsérfræðingur" subtitle="Dæmafyrirtæki ehf." date="2019 – 2024" location="Reykjavík">
        <ul>
          <li>Hönnun og þróun vefkerfa</li>
          <li>Umsjón með gagnagrunnum</li>
        </ul>
      </DocEntry>
      <DocEntry title="Forritari" subtitle="Dæmafyrirtæki ehf." date="2015 – 2019" location="Kópavogur">
        <p>Þróun innri kerfa og samþætting við þriðja aðila.</p>
      </DocEntry>
    </DocSection>

    <DocSection title="Menntun">
      <DocEntry title="BSc í tölvunarfræði" subtitle="Dæmaháskóli" date="2012 – 2015" />
    </DocSection>

    <DocSection title="Forritunarmál o.fl." columns={2}>
      <DocEntry title="Forritunarmál"><p>Java, C#, Python, C++</p></DocEntry>
      <DocEntry title="Gagnagrunnar"><p>MySQL, SQL Server, PostgreSQL</p></DocEntry>
      <DocEntry title="Vefforritun"><p>JavaScript, HTML/CSS</p></DocEntry>
      <DocEntry title="Annað"><p>Siteimprove</p></DocEntry>
    </DocSection>

    <DocSection title="Tungumál" columns={2}>
      <DocEntry title="Íslenska" subtitle="Móðurmál" />
      <DocEntry title="Enska" subtitle="Reiprennandi" />
    </DocSection>
  </PageSheet>
</Story>
