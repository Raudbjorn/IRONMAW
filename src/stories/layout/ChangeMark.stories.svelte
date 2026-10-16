<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ChangeMark, DocEntry, DocHeader, DocSection, PageSheet } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/ChangeMark',
    component: ChangeMark,
    args: { kind: 'edit', flag: 'margin', as: 'div' },
    argTypes: {
      kind: { control: 'inline-radio', options: ['edit', 'suggestion'] },
      flag: { control: 'inline-radio', options: ['margin', 'edge', 'none'] },
      as: { control: 'inline-radio', options: ['div', 'span'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'Marks a passage that differs from the saved document. An edit is yours: teal wash, solid outline. A suggestion is unreviewed: amber wash, dashed outline. The flag sits right of the sheet and assumes the passage spans the sheet’s content width; use `edge` in narrow windows. Hidden text announces the state; wash, outline and flag are hidden in print.' } } }
  });
</script>

{#snippet page(flag: 'margin' | 'edge')}
  <PageSheet label="Page 1 · A4">
    <DocHeader name="Sveinbjörn Geirsson" headline="Hugbúnaðarsérfræðingur" />
    <DocSection title="Starfsreynsla">
      <ChangeMark kind="edit" {flag}>
        <DocEntry title="Vefforritari" subtitle="Dæmafyrirtæki ehf." date="2019 til nú" location="Kópavogur">
          <p>Þróaði og viðhélt innri vefþjónustu fyrir skjalavinnslu.</p>
        </DocEntry>
      </ChangeMark>
      <ChangeMark kind="suggestion" {flag}>
        <DocEntry title="Kerfisstjóri" subtitle="Dæmafyrirtæki ehf." date="2015 til 2019" location="Reykjavík">
          <p>Sá um rekstur og eftirlit með þjónustum fyrirtækisins.</p>
        </DocEntry>
      </ChangeMark>
    </DocSection>
  </PageSheet>
{/snippet}

<Story name="Edit and suggestion" asChild>
  <div style="padding: 24px 240px 24px 24px; width: max-content;">{@render page('margin')}</div>
</Story>

<Story name="Edge flag" asChild>
  <div style="padding: 24px 24px 24px 24px; width: max-content;">{@render page('edge')}</div>
</Story>
