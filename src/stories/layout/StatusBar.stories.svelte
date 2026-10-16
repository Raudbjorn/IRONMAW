<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { StatusBar } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/StatusBar',
    component: StatusBar,
    args: { label: 'Local workspace', status: 'All changes saved on this device.', tone: 'neutral' },
    argTypes: {
      tone: { control: 'inline-radio', options: ['neutral', 'warning', 'error'] },
      end: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'The app’s bottom bar: where the work lives, the current status in a polite live region, and optional extras at the end. Tone colours the status text only; the words carry the meaning.' } } }
  });
</script>

<Story name="Neutral" />

<Story name="Warning">
  {#snippet template(args)}
    <StatusBar {...args} tone="warning" status="2 changes are not saved yet." />
  {/snippet}
</Story>

<Story name="Error with extras">
  {#snippet template(args)}
    <StatusBar {...args} tone="error" status="Couldn’t save. Your edits are kept on this page.">
      {#snippet end()}<span>Page 1 of 2</span>{/snippet}
    </StatusBar>
  {/snippet}
</Story>
