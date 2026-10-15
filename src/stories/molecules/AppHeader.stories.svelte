<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { AppHeader, Button, SaveStatus, SegmentedControl, SplitButton } from '../../lib/index';

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
    parameters: { layout: 'fullscreen', docs: { description: { component: 'The editor\'s top bar: back, document name with a status line, a centre slot for the mode switch and actions at the end. The bar responds to its own width: below 720px the centre moves to its own row.' } } }
  });
</script>

{#snippet modes()}
  <SegmentedControl aria-label="Editor mode" size="sm" value="write" options={[
    { id: 'write', label: 'Write' },
    { id: 'design', label: 'Design' },
    { id: 'check', label: 'Check', count: 4, countTone: 'warning', countLabel: '4 checks to review' }
  ]} />
{/snippet}

{#snippet actions()}
  <Button variant="ghost" size="sm" icon="history" label="Version history" />
  <Button variant="ghost" size="sm" icon="assist" label="Writing assistant" />
  <Button variant="secondary" size="sm" icon="share">Share</Button>
  <SplitButton
    label="Download PDF"
    icon="download"
    menuLabel="More download options"
    items={[
      { id: 'pdf', label: 'PDF for people', icon: 'file' },
      { id: 'text', label: 'Plain text for parsers', icon: 'code' }
    ]}
  />
{/snippet}

{#snippet saved()}
  <SaveStatus state="saved" />
{/snippet}

<Story name="Full editor bar" asChild>
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" status={saved} center={modes} end={actions} />
</Story>

<Story name="Long title" asChild>
  <AppHeader
    back={{ label: 'Back to library' }}
    title="Umsókn um starf hugbúnaðarsérfræðings hjá Dæmafyrirtæki ehf. í Kópavogi"
    status={saved}
    end={actions}
  />
</Story>

<Story name="Title only" asChild>
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" />
</Story>
