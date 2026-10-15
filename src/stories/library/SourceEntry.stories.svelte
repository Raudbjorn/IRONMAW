<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SourceEntry, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Library/SourceEntry',
    component: SourceEntry,
    args: {
      index: 1,
      path: 'library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.is.pdf',
      summary: 'Applications · Landsnet',
      copied: false,
      expanded: false,
      fields: [
        { label: 'Filed under', value: 'Applications · Landsnet' },
        { label: 'Purpose', value: 'Preserved PDF for content/layout comparison; not a verified current or send-ready document.' },
        { label: 'Original source', value: 'sources/unpacked/landsnet-2025-06/landsnet-application-2025-06/cv-sveinbjorn-geirsson.is.pdf', mono: true },
        { label: 'Archive', value: 'sources/archives/landsnet-application-2025-06.zip → landsnet-application-2025-06/cv-sveinbjorn-geirsson.is.pdf', mono: true },
        { label: 'Context file', value: 'sources/unpacked/landsnet-2025-06/README.md', mono: true }
      ]
    },
    argTypes: { oncopy: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'One recorded file location. Compact by default; expanding reveals complete provenance. Every field is listed; a missing one says "Not recorded". Paths are copyable text, never file:// links.' } } }
  });
</script>

<Story name="Compact">
  {#snippet template(args)}
    <SourceEntry {...args} oncopy={() => {}} />
  {/snippet}
</Story>

<Story name="Expanded" args={{ expanded: true, copied: true }}>
  {#snippet template(args)}
    <SourceEntry {...args} oncopy={() => {}} />
  {/snippet}
</Story>

<Story name="Identical content, three locations" asChild>
  <Stack gap={0}>
    <Text size="sm" tone="muted">3 locations, identical content. 48,690 bytes each. The document title comes from location 1.</Text>
    <SourceEntry index={1} path="library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.is.pdf" summary="Applications · Landsnet" oncopy={() => {}} fields={[{ label: 'Purpose', value: 'Preserved PDF for comparison.' }]} />
    <SourceEntry index={2} path="library/01-cv/pdf-snapshots/icelandic-cv-2026-09-17/output/cv-sveinbjorn-geirsson.is.pdf" summary="CVs · snapshot" oncopy={() => {}} fields={[{ label: 'Purpose' }, { label: 'Archive', value: 'sources/archives/2026-10-13-additions/drive-download-20261013T011346Z-1-001.zip', mono: true }]} />
    <SourceEntry index={3} path="library/01-cv/drive-imports/drive-011346/cv-sveinbjorn-geirsson.is.pdf" summary="CVs · drive import" oncopy={() => {}} />
  </Stack>
</Story>

<Story name="Partial record" asChild>
  <SourceEntry
    index={1}
    path="library/01-cv/drive-imports/drive-011346/SveinbjörnGeirsson(2).pdf"
    expanded
    oncopy={() => {}}
    fields={[
      { label: 'Filed under', value: 'CVs' },
      { label: 'Purpose', value: 'Historical CV PDF version; compare career facts, wording, and design before selecting a current version.' },
      { label: 'Original source', value: 'sources/unpacked/drive-011346/SveinbjörnGeirsson(2).pdf', mono: true },
      { label: 'Archive' },
      { label: 'Context file' }
    ]}
  />
</Story>
