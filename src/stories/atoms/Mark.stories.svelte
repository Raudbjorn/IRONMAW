<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Mark, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Mark',
    component: Mark,
    args: { variant: 'lockup', name: 'IRONMAW', tagline: 'Wormian Bones', size: 'md', plate: false },
    argTypes: {
      variant: { control: 'inline-radio', options: ['bear', 'wordmark', 'lockup'] },
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }
    },
    parameters: { docs: { description: { component: 'The identity. The full bear is the supplied vector master and is used at every size, including small lockups in the navigation bar. `plate` seats the bear on charcoal.' } } }
  });
</script>

<Story name="Lockup" />

<Story name="Bear" asChild>
  <Stack direction="row" gap={6} align="center" wrap>
    <Mark variant="bear" size="sm" />
    <Mark variant="bear" size="md" />
    <Mark variant="bear" size="lg" />
  </Stack>
</Story>

<Story name="On plate" asChild>
  <Mark variant="bear" size="lg" plate />
</Story>

<Story name="Lockup sizes" asChild>
  <Stack gap={6}>
    <Mark variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />
    <Mark variant="lockup" size="md" name="IRONMAW" tagline="Application Assistant" />
  </Stack>
</Story>

<Story name="Wordmark" asChild>
  <Stack gap={6}>
    <Mark variant="wordmark" size="sm" name="IRONMAW" />
    <Mark variant="wordmark" size="md" name="IRONMAW" tagline="Application Assistant" />
    <Mark variant="wordmark" size="lg" name="Wormian Bones" tagline="A system of uncommon parts" />
  </Stack>
</Story>

<Story name="As link" asChild>
  <Mark href="#library" variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />
</Story>
