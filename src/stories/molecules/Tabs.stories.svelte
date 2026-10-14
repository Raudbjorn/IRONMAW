<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Tabs } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/Tabs',
    component: Tabs,
    args: {
      'aria-label': 'Reader views',
      tabs: [
        { id: 'content', label: 'Content', tabId: 'tab-content', panelId: 'panel-content' },
        { id: 'sources', label: 'Sources', count: 6, tabId: 'tab-sources', panelId: 'panel-sources' },
        { id: 'technical', label: 'Technical', tabId: 'tab-technical', panelId: 'panel-technical' }
      ],
      value: 'content'
    },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'The reader\'s view switcher. Rust underline for the active tab; roving tabindex with arrow, Home and End keys. Panels are consumer-rendered.' } } }
  });
</script>

<Story name="Content" />

<Story name="Sources selected" args={{ value: 'sources' }} />
