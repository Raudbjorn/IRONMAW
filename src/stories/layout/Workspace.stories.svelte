<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { AppHeader, Button, Disclosure, DocEntry, DocHeader, DocSection, Input, PageCanvas, PageSheet, SaveStatus, Stack, Text, Workspace } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/Workspace',
    component: Workspace,
    args: { sidebarLabel: 'Editor', fill: false },
    argTypes: {
      header: { table: { disable: true } },
      sidebar: { table: { disable: true } },
      children: { table: { disable: true } }
    },
    parameters: { layout: 'fullscreen', docs: { description: { component: 'The editor frame: optional header, a scrolling sidebar and a main canvas. With `fill` it takes the viewport height and each pane scrolls on its own; below 720px of its own width it stacks into one column.' } } }
  });
</script>

{#snippet side()}
  <Stack gap={3}>
    <Input label="Document name" value="Ferilskrá 2026" />
    <Disclosure title="Starfsreynsla" meta="2 entries" open>
      <Stack gap={2}>
        <Input label="Title" value="Hugbúnaðarsérfræðingur" />
        <Input label="Employer" value="Dæmafyrirtæki ehf." />
      </Stack>
    </Disclosure>
    <Disclosure title="Menntun" meta="1 entry">
      <Text size="sm" tone="muted">BSc í tölvunarfræði, Dæmaháskóli</Text>
    </Disclosure>
    <Disclosure title="Tungumál" meta="2 entries">
      <Text size="sm" tone="muted">Íslenska, enska</Text>
    </Disclosure>
  </Stack>
{/snippet}

{#snippet saved()}
  <SaveStatus state="saved" />
{/snippet}

{#snippet actions()}
  <Button variant="secondary" size="sm" icon="share">Share</Button>
  <Button size="sm" icon="download">Download PDF</Button>
{/snippet}

{#snippet top()}
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" status={saved} end={actions} />
{/snippet}

{#snippet page()}
  <PageCanvas zoom="fit" aria-label="Document preview">
    <PageSheet label="Page 1 · A4">
      <DocHeader name="Sveinbjörn Geirsson" headline="Hugbúnaðarsérfræðingur" contacts={[{ kind: 'email', value: 'sveinbjorn@example.is' }, { kind: 'location', value: 'Kópavogur' }]} />
      <DocSection title="Starfsreynsla">
        <DocEntry title="Hugbúnaðarsérfræðingur" subtitle="Dæmafyrirtæki ehf." date="2019 – 2024" location="Reykjavík" />
      </DocSection>
    </PageSheet>
  </PageCanvas>
{/snippet}

<Story name="Editor frame" asChild>
  <div style="height: 640px">
    <Workspace sidebarLabel="Editor" header={top} sidebar={side}>{@render page()}</Workspace>
  </div>
</Story>

<Story name="Wide sidebar" asChild>
  <div style="height: 640px">
    <Workspace sidebarLabel="Editor" sidebarWidth="420px" header={top} sidebar={side}>{@render page()}</Workspace>
  </div>
</Story>
