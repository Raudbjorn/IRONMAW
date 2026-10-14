<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Typography',
    parameters: {
      controls: { disable: true },
      docs: {
        description: {
          component:
            'Three faces, three jobs. **Rajdhani** (display): condensed, uppercase, tracked — short labels, buttons, tabs, the wordmark. ' +
            '**Inter** (sans): interface and prose, never letterspaced or uppercased for titles, excerpts, warnings or Icelandic text. ' +
            '**Iosevka** (mono): paths, locators, technical values. All self-hosted subsets with full Icelandic coverage.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import { Heading, Kicker, Stack, Suture, Text } from '../../lib/index';
  const sample = 'Ferilskrá · ÁÉÍÓÚÝÐÞÆÖ áéíóúýðþæö';
</script>

<Story name="Faces" asChild>
  <Stack gap={6}>
    <Stack gap={2}>
      <Kicker tick>Display · Rajdhani</Kicker>
      <Heading level={1} display>Library</Heading>
      <Heading level={2} display>{sample}</Heading>
      <Kicker tone="strong">Search library · Active filters · Copy passage with source</Kicker>
    </Stack>
    <Suture />
    <Stack gap={2}>
      <Kicker tick>Interface and prose · Inter</Kicker>
      <Heading level={1}>{sample}</Heading>
      <Heading level={2}>cv-sveinbjorn-geirsson.is.pdf</Heading>
      <Text size="lg">16px reading text. Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</Text>
      <Text>14px list text — the excerpt line in a result row, up to three lines before it is clipped.</Text>
      <Text size="sm" tone="muted">13px secondary metadata · Icelandic · Plain text</Text>
      <Text size="xs" tone="faint">12px hints inside chips and status labels</Text>
    </Stack>
    <Suture />
    <Stack gap={2}>
      <Kicker tick>Technical · Iosevka</Kicker>
      <Text mono>library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.is.pdf</Text>
      <Text mono size="sm" tone="muted">Passage 2 · Page 1 · from line 34 · {sample}</Text>
    </Stack>
  </Stack>
</Story>
