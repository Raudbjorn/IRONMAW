// Mirrors src/stories/molecules/Tabs.stories.svelte
import * as React from 'react';
import { Tabs } from '@svnbjrn/ironmaw';

const tabs = [
  { id: 'content', label: 'Content', tabId: 'tab-content', panelId: 'panel-content' },
  { id: 'sources', label: 'Sources', count: 6, tabId: 'tab-sources', panelId: 'panel-sources' },
  { id: 'technical', label: 'Technical', tabId: 'tab-technical', panelId: 'panel-technical' },
];

export const Content = () => <Tabs aria-label="Reader views" tabs={tabs} value="content" />;

export const SourcesSelected = () => <Tabs aria-label="Reader views" tabs={tabs} value="sources" />;
