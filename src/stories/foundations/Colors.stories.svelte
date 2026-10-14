<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Colors',
    parameters: {
      controls: { disable: true },
      docs: {
        description: {
          component:
            'Every colour is a `--wm-*` custom property generated from the DTCG token source (`src/lib/tokens/*.tokens.json`). ' +
            'The four brand anchors from identity board B2 are emitted verbatim as `--wm-brand-*`; everything else is a semantic role per edition. ' +
            'Chips read the computed values — switch the toolbar edition between Oxide and Bone.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import { Stack, Suture } from '../../lib/index';
  import TokenChips from './TokenChips.svelte';
</script>

<Story name="Palette" asChild>
  <Stack gap={6}>
    <TokenChips title="Brand anchors (B2, verbatim, edition-independent)" names={['brand-charcoal', 'brand-teal', 'brand-rust', 'brand-slate']} />
    <Suture label="Edition roles" />
    <TokenChips title="Canvas and surfaces" names={['bg', 'surface-1', 'surface-2', 'surface-3', 'selected', 'mark-bg']} />
    <TokenChips title="Boundaries" names={['border', 'border-strong', 'structure', 'structure-text']} />
    <TokenChips title="Ink" names={['text', 'text-strong', 'text-muted', 'text-faint']} />
    <TokenChips title="Interactive" names={['accent', 'accent-ink', 'action', 'action-hover', 'action-ink']} />
    <TokenChips title="Semantic (amber warning, never rust)" names={['success', 'warning', 'error']} />
  </Stack>
</Story>
