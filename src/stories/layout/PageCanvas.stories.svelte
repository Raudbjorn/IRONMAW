<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Heading, PageCanvas, PageSheet, Tabs, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/PageCanvas',
    component: PageCanvas,
    args: { zoom: 'fit', pageWidth: 794, 'aria-label': 'Document preview' },
    argTypes: {
      children: { table: { disable: true } },
      toolbar: { table: { disable: true } },
      overlay: { table: { disable: true } }
    },
    parameters: { layout: 'fullscreen', docs: { description: { component: 'The scrolling ground the page sheets sit on; the darkest surface in Oxide so the paper reads. Zoom scales the sheet stack; "fit" matches the canvas width (up to 125%). Toolbar floats at top centre, overlay at bottom centre. The scroller is keyboard-focusable.' } } }
  });
</script>

{#snippet sheets()}
  <PageSheet label="Page 1 · A4">
    <Heading level={1}>Sveinbjörn Geirsson</Heading>
    <Text tone="muted">Kópavogur</Text>
  </PageSheet>
  <PageSheet label="Page 2 · A4">
    <Text>Menntun og tungumál: íslenska, enska.</Text>
  </PageSheet>
{/snippet}

{#snippet views()}
  <Tabs aria-label="Preview view" value="person" tabs={[
    { id: 'person', label: 'What a person sees', tabId: 'pc-t1', panelId: 'pc-p1' },
    { id: 'parser', label: 'What a parser reads', tabId: 'pc-t2', panelId: 'pc-p2' }
  ]} />
{/snippet}

{#snippet bar()}
  <Button variant="secondary" size="xs" icon="zoom-fit" label="Fit page" />
{/snippet}

<Story name="Fit" asChild>
  <div style="height: 480px">
    <PageCanvas zoom="fit">{@render sheets()}</PageCanvas>
  </div>
</Story>

<Story name="With toolbar and overlay" asChild>
  <div style="height: 480px">
    <PageCanvas zoom={75} toolbar={views} overlay={bar}>{@render sheets()}</PageCanvas>
  </div>
</Story>

<Story name="Zoomed in" asChild>
  <div style="height: 480px">
    <PageCanvas zoom={125}>{@render sheets()}</PageCanvas>
  </div>
</Story>
