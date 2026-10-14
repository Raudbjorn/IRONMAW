<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DocumentEntry, Link, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Library/DocumentEntry',
    component: DocumentEntry,
    args: {
      title: 'cv-text-icelandic.txt',
      context: '01-cv/drive-imports/drive-011346',
      language: 'Icelandic',
      format: 'Plain text',
      statuses: ['review-required'],
      locations: 2,
      selected: false
    },
    argTypes: { excerpt: { table: { disable: true } }, extra: { table: { disable: true } }, onopen: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'One row per document. The title is the focusable control; the whole row supplements it. Selected = tonal fill + rust edge + aria-current. "Known issues" is the only filled label and sorts first. File locations and extra matches are different things and never summed. Passage text here is mock data.' } } }
  });
</script>

<Story name="Browse">
  {#snippet template(args)}
    <Stack as="ul" gap={0}>
      <DocumentEntry {...args} onopen={() => {}} />
    </Stack>
  {/snippet}
</Story>

<Story name="Search, selected" asChild>
  <Stack as="ul" gap={0}>
    <DocumentEntry
      title="cv-sveinbjorn-geirsson.is.pdf"
      context="02-applications/landsnet/landsnet-2025-06"
      language="Icelandic"
      format="PDF"
      statuses={['snapshot']}
      locations={6}
      selected
      onopen={() => {}}
    >
      {#snippet excerpt()}<mark>Ferilskrá</mark> Sveinbjörn Geirsson Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.{/snippet}
      {#snippet extra()}<Link href="#more" quiet>2 more matches in this document</Link>{/snippet}
    </DocumentEntry>
    <DocumentEntry
      title="cv-text-icelandic.txt"
      context="01-cv/drive-imports/drive-011346"
      language="Icelandic"
      format="Plain text"
      statuses={['review-required']}
      locations={2}
      onopen={() => {}}
    >
      {#snippet excerpt()}<mark>Ferilskrá</mark> texti til uppsetningar Ósníðinn texti sem settur er upp í sniðmát. Kaflar: Starfsreynsla, Menntun, Tæknikunnátta.{/snippet}
      {#snippet extra()}<Link href="#more" quiet>1 more match in this document</Link>{/snippet}
    </DocumentEntry>
  </Stack>
</Story>

<Story name="Known issues" asChild>
  <Stack as="ul" gap={0}>
    <DocumentEntry
      title="cover-letter-landsnet.en.md"
      context="02-applications/landsnet/landsnet-2025-06"
      language="English"
      format="Plain text"
      statuses={['snapshot', 'known-errors']}
      onopen={() => {}}
    >
      {#snippet excerpt()}Dear <mark>Landsnet</mark> hiring team, I am applying for the advertised position and attach my CV in English and Icelandic.{/snippet}
    </DocumentEntry>
  </Stack>
</Story>

<Story name="Same title, long name" asChild>
  <Stack as="ul" gap={0}>
    <DocumentEntry title="Sveinbjorn-Geirsson-CV.pdf" context="01-cv/drive-imports/drive-011459" language="English" format="PDF" statuses={['snapshot']} onopen={() => {}} />
    <DocumentEntry title="Sveinbjorn-Geirsson-CV.pdf" context="01-cv/pdf-snapshots/icelandic-cv-2026-09-17/input" language="English" format="PDF" statuses={['snapshot']} onopen={() => {}} />
    <DocumentEntry
      title="[MOCK] Ferilskrá-Sveinbjörn-Geirsson-hugbúnaðarsérfræðingur-endurskoðuð-útgáfa-með-athugasemdum-eftir-yfirlestur-lokaútgáfa-3.pdf"
      context="01-cv/mock/langt-heiti/demi-um-linubrot"
      language="Icelandic"
      format="PDF"
      statuses={['review-required', 'snapshot', 'historical-variant']}
      onopen={() => {}}
    />
  </Stack>
</Story>

<Story name="Metadata only" asChild>
  <Stack as="ul" gap={0}>
    <DocumentEntry title="logo-banner.png" context="02-applications/reitun/archive/cover-letter" language="Unknown" format="Image / asset" statuses={['visual-reference']} onopen={() => {}}>
      {#snippet excerpt()}Matched document metadata: the title or a file path, not the text.{/snippet}
    </DocumentEntry>
  </Stack>
</Story>
