<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Heading, PageSheet, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/PageSheet',
    component: PageSheet,
    args: { size: 'a4', label: 'Page 1 · A4', edition: 'bone' },
    argTypes: {
      size: { control: 'inline-radio', options: ['a4', 'letter'] },
      edition: { control: 'inline-radio', options: ['bone', 'oxide', 'inherit'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'One sheet of paper at true page size, in the Bone edition by default so it stays pale and print-like inside an Oxide app. The label sits above the sheet. For print, the consumer sets `@page { size: A4; margin: 0 }`; the shadow and label drop away on their own.' } } }
  });
</script>

<Story name="A4 page" asChild>
  <PageSheet label="Page 1 · A4">
    <Stack gap={3}>
      <Heading level={1}>Sveinbjörn Geirsson</Heading>
      <Text tone="muted">Hugbúnaðarsérfræðingur · Kópavogur</Text>
      <Text>Reynsla af vefforritun, gagnagrunnum og þjónustuþróun hjá Dæmafyrirtæki ehf.</Text>
    </Stack>
  </PageSheet>
</Story>

<Story name="Letter page" asChild>
  <PageSheet size="letter" label="Page 1 · Letter">
    <Stack gap={3}>
      <Heading level={1}>Sveinbjörn Geirsson</Heading>
      <Text>Software engineer, Kópavogur.</Text>
    </Stack>
  </PageSheet>
</Story>

<Story name="Follows the app edition" asChild>
  <PageSheet edition="inherit" label="Page 1 · A4">
    <Text>This sheet takes the surrounding edition instead of Bone.</Text>
  </PageSheet>
</Story>
