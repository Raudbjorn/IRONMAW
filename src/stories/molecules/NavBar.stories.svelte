<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Mark, NavBar } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/NavBar',
    component: NavBar,
    args: {
      navLabel: 'Primary',
      menuLabel: 'Menu',
      items: [
        { href: '#applications', label: 'Applications' },
        { href: '#ledger', label: 'Ledger' },
        { href: '#intake', label: 'Intake' },
        { href: '#library', label: 'Library', active: true }
      ]
    },
    argTypes: { brand: { table: { disable: true } }, children: { table: { disable: true } } },
    parameters: {
      layout: 'fullscreen',
      docs: { description: { component: 'Compact branded shell: the bear lockup at left, rust underline on the active destination, actions at right. Below 768px the destinations collapse behind a labelled toggle.' } }
    }
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <NavBar {...args}>
      {#snippet brand()}<Mark href="#home" variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />{/snippet}
      <Button variant="ghost" size="sm" label="Search" icon="search" />
    </NavBar>
  {/snippet}
</Story>

<Story name="Wordmark only" asChild>
  <NavBar items={[{ href: '#library', label: 'Library', active: true }, { href: '#applications', label: 'Applications' }]}>
    {#snippet brand()}<Mark variant="wordmark" size="sm" name="IRONMAW" />{/snippet}
  </NavBar>
</Story>
