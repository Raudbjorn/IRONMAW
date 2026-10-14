<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Link, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Link',
    component: Link,
    args: { href: '#sources', external: false, quiet: false },
    argTypes: { children: { table: { disable: true } } }
  });
</script>

<Story name="Internal">
  {#snippet template({ children: _, ...args })}
    <Text>Open the <Link {...args}>Sources</Link> view to inspect all six locations.</Text>
  {/snippet}
</Story>

<Story name="External" asChild>
  <Text>Interaction reference: <Link href="https://mrpeker.github.io/turbopuffer-gui/" external>Turbopuffer GUI</Link></Text>
</Story>

<Story name="Quiet" asChild>
  <Stack gap={2}>
    <Text size="sm"><Link href="#more" quiet>2 more matches in this document</Link></Text>
    <Text size="sm"><Link href="#clear" quiet>Clear filters</Link></Text>
  </Stack>
</Story>
