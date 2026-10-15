<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Heading, PageAnnotation, PageSheet, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/PageAnnotation',
    component: PageAnnotation,
    args: { index: 1, label: 'Dates are ambiguous', tone: 'warning', active: false, as: 'div' },
    argTypes: {
      tone: { control: 'inline-radio', options: ['warning', 'error', 'accent'] },
      as: { control: 'inline-radio', options: ['div', 'span'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'Ties a finding to its place on the page without changing the text: a numbered marker in the left margin and a wavy underline under the block. Both are hidden in print. Place it inside a PageSheet so the margin exists.' } } }
  });
</script>

<Story name="On a page" asChild>
  <PageSheet label="Page 1 · A4">
    <Stack gap={4}>
      <Heading level={2}>Starfsreynsla</Heading>
      <PageAnnotation index={1} label="Dates are ambiguous">
        <Text>Vefforritari, Dæmafyrirtæki ehf. · 2019 til nú</Text>
      </PageAnnotation>
      <PageAnnotation index={2} label="Claim has no figure" tone="error" active>
        <Text>Bætti afköst kerfisins verulega.</Text>
      </PageAnnotation>
      <PageAnnotation index={3} label="Consider a link" tone="accent">
        <Text>Þróaði innri vefþjónustu.</Text>
      </PageAnnotation>
    </Stack>
  </PageSheet>
</Story>

<Story name="Inline" asChild>
  <PageSheet label="Page 1 · A4">
    <Text>Reynsla af <PageAnnotation as="span" index="a" label="Vague term">ýmsum tæknilausnum</PageAnnotation> í tíu ár.</Text>
  </PageSheet>
</Story>
