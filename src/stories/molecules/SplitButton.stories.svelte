<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SplitButton } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/SplitButton',
    component: SplitButton,
    args: {
      label: 'Download PDF',
      icon: 'download',
      menuLabel: 'More download options',
      items: [
        { id: 'pdf', label: 'PDF for people', icon: 'file' },
        { id: 'text', label: 'Plain text for parsers', icon: 'code' },
        { id: 'docx', label: 'Word document', icon: 'file', disabled: true }
      ]
    },
    argTypes: { onclick: { table: { disable: true } }, onselect: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'One action with its alternatives. The main half runs the default; the chevron opens the rest. Primary is the single rust action of a view; the chamfer sits on the outer corner only.' } } }
  });
</script>

<Story name="Primary" />

<Story name="Secondary" args={{ variant: 'secondary', size: 'md' }} />

<Story name="Loading" args={{ loading: true }} />
