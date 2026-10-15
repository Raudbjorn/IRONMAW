<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Heading, Kicker, Panel, PageCanvas, PageSheet, Stack, Text, Workspace } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/Workspace',
    component: Workspace,
    args: { sidebarLabel: 'Editor', fill: false },
    argTypes: {
      header: { table: { disable: true } },
      sidebar: { table: { disable: true } },
      children: { table: { disable: true } }
    },
    parameters: { layout: 'fullscreen', docs: { description: { component: 'The editor frame: optional header, a scrolling sidebar and a main canvas. With `fill` it takes the viewport height and each pane scrolls on its own; below 1024px it stacks into one column at natural height.' } } }
  });
</script>

{#snippet side()}
  <Stack gap={3}>
    <Kicker>Ferilskrá</Kicker>
    <Panel padding={3}><Text size="sm">Starfsreynsla</Text></Panel>
    <Panel padding={3}><Text size="sm">Menntun</Text></Panel>
    <Panel padding={3}><Text size="sm">Tungumál</Text></Panel>
  </Stack>
{/snippet}

{#snippet top()}
  <Stack direction="row" gap={3} align="center">
    <Heading level={2}>Ferilskrá 2026</Heading>
    <Button size="sm">Share</Button>
  </Stack>
{/snippet}

<Story name="Editor frame" asChild>
  <div style="height: 520px">
    <Workspace sidebarLabel="Editor" fill={false} header={top} sidebar={side}>
      <PageCanvas zoom="fit">
        <PageSheet label="Page 1 · A4"><Text>Sveinbjörn Geirsson, Kópavogur</Text></PageSheet>
      </PageCanvas>
    </Workspace>
  </div>
</Story>

<Story name="Wide sidebar" asChild>
  <div style="height: 360px">
    <Workspace sidebarLabel="Editor" fill={false} sidebarWidth="420px" sidebar={side}>
      <Text>Main canvas</Text>
    </Workspace>
  </div>
</Story>
