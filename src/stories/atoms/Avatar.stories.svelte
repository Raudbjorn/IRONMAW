<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Avatar, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Avatar',
    component: Avatar,
    args: { name: 'Sveinbjörn Geirsson', size: 'md' },
    parameters: { docs: { description: { component: 'A person\'s picture, or initials from the first and last word of the name (Icelandic letters kept). Falls back to initials if the image fails.' } } }
  });
</script>

<Story name="Initials" />

<Story name="Sizes" asChild>
  <Stack direction="row" gap={3} align="center">
    <Avatar name="Sveinbjörn Geirsson" size="sm" />
    <Avatar name="Sveinbjörn Geirsson" size="md" />
    <Avatar name="Sveinbjörn Geirsson" size="lg" />
  </Stack>
</Story>

<Story name="Icelandic names" asChild>
  <Stack direction="row" gap={3} align="center">
    <Avatar name="Þórunn Ægisdóttir" size="lg" />
    <Avatar name="Ögmundur Ðalsson" size="lg" />
    <Avatar name="Björk" size="lg" />
  </Stack>
</Story>

<Story name="Broken image falls back" args={{ name: 'Katrín Jónsdóttir', src: '/missing.png', size: 'lg' }} />
