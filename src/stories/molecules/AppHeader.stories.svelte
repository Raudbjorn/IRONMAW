<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { AppHeader, Button, Tabs, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/AppHeader',
    component: AppHeader,
    args: { title: 'Ferilskrá 2026', back: { label: 'Back to library', href: '#' } },
    argTypes: {
      heading: { table: { disable: true } },
      status: { table: { disable: true } },
      center: { table: { disable: true } },
      end: { table: { disable: true } }
    },
    parameters: { layout: 'fullscreen', docs: { description: { component: 'The editor\'s top bar: back, document name with a status line, a centre slot for the mode switch and actions at the end. Below 768px the centre moves to its own row.' } } }
  });
</script>

{#snippet modes()}
  <Tabs aria-label="Editor mode" value="write" tabs={[
    { id: 'write', label: 'Write', tabId: 'ah-t1', panelId: 'ah-p1' },
    { id: 'design', label: 'Design', tabId: 'ah-t2', panelId: 'ah-p2' },
    { id: 'check', label: 'Check', count: 4, tabId: 'ah-t3', panelId: 'ah-p3' }
  ]} />
{/snippet}

{#snippet actions()}
  <Button variant="ghost" size="sm" icon="history" label="Version history" />
  <Button variant="secondary" size="sm" icon="share">Share</Button>
  <Button size="sm" icon="download">Download PDF</Button>
{/snippet}

{#snippet saved()}
  <Text size="xs" tone="faint">Saved</Text>
{/snippet}

<Story name="Title only" />

<Story name="Full editor bar" asChild>
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" status={saved} center={modes} end={actions} />
</Story>

<Story name="Long title" asChild>
  <div style="width: 420px">
    <AppHeader back={{ label: 'Back to library' }} title="Umsókn um starf hugbúnaðarsérfræðings hjá Dæmafyrirtæki ehf. í Kópavogi" end={actions} />
  </div>
</Story>
