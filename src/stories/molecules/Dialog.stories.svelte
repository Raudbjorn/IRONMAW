<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Dialog, Stack, Suture, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/Dialog',
    component: Dialog,
    args: { title: 'Open a CV', open: true, size: 'md', dismissible: true },
    argTypes: {
      children: { table: { disable: true } },
      footer: { table: { disable: true } },
      onclose: { table: { disable: true } }
    },
    parameters: {
      layout: 'fullscreen',
      docs: { description: { component: 'A modal on the native dialog element. Focus moves in on open and returns to the opener on close; Escape and a click on the backdrop close it unless dismissible is false. Actions go in the footer, right-aligned, with the one main action last. Without a footer a Close button is added.' } }
    }
  });

  const mainCvs = [
    { name: 'Sveinbjörn Geirsson — aðal ferilskrá', meta: 'Edited yesterday' },
    { name: 'Sveinbjörn Geirsson — English', meta: 'Edited 3 March' }
  ];
  const applications = [
    { name: 'Seðlabanki Íslands — sérfræðingur', meta: 'Adapted from the main CV' },
    { name: 'Dæmafyrirtæki ehf. — forritari', meta: 'Adapted from the English CV' }
  ];
</script>

<Story name="Open a CV">
  {#snippet template({ children: _, footer: __, ...args })}
    <div style="min-height: 720px">
      <Dialog {...args} description="Choose a main CV or an application to work on.">
        <Stack gap={4}>
          <Stack gap={2}>
            <Suture label="Main CVs" />
            {#each mainCvs as c (c.name)}
              <button type="button" class="choice"><span class="name">{c.name}</span><span class="meta">{c.meta}</span></button>
            {/each}
          </Stack>
          <Stack gap={2}>
            <Suture label="Applications" />
            {#each applications as c (c.name)}
              <button type="button" class="choice"><span class="name">{c.name}</span><span class="meta">{c.meta}</span></button>
            {/each}
          </Stack>
        </Stack>
      </Dialog>
    </div>
  {/snippet}
</Story>

<Story name="Confirmation" args={{ title: 'Discard your edits?', icon: 'warning', size: 'sm', dismissible: false }}>
  {#snippet template({ children: _, footer: __, ...args })}
    <div style="min-height: 520px">
      <Dialog {...args} description="Three passages have changes that are not saved. They will be lost.">
        {#snippet footer()}
          <Button variant="secondary">Keep editing</Button>
          <Button variant="danger">Discard edits</Button>
        {/snippet}
      </Dialog>
    </div>
  {/snippet}
</Story>

<Story name="Information with Close" args={{ title: 'About this CV', icon: 'info', size: 'sm' }}>
  {#snippet template({ children: _, footer: __, ...args })}
    <div style="min-height: 520px">
      <Dialog {...args}>
        <Text>This is a copy of your main CV. Changes you make here do not touch the original.</Text>
      </Dialog>
    </div>
  {/snippet}
</Story>

<style>
  .choice {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px var(--wm-space-3);
    text-align: left;
    background: var(--wm-surface-1);
    color: var(--wm-text);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    font-family: var(--wm-font-sans);
    cursor: pointer;
  }
  .choice:hover { background: var(--wm-surface-3); }
  .choice:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  .name { font-size: var(--wm-fs-base); line-height: var(--wm-lh-normal); color: var(--wm-text-strong); }
  .meta { font-size: var(--wm-fs-xs); line-height: var(--wm-lh-normal); color: var(--wm-text-muted); }
</style>
