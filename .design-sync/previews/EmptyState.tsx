// Mirrors src/stories/molecules/EmptyState.stories.svelte
import * as React from 'react';
import { Button, EmptyState } from '@svnbjrn/ironmaw';

export const ACvForThisApplication = () => (
  <EmptyState title="No CV for this application yet" icon="file" terrain actions={<Button variant="primary">Adapt main CV</Button>}>
    Adapt one of your main CVs to this job. Your main CV stays as it is, and you choose which changes to keep.
  </EmptyState>
);

export const NoResults = () => (
  <EmptyState title="No documents match" icon="search" actions={<Button variant="secondary">Clear filters</Button>}>
    Nothing matches “Forritunarmál” with the filters you have on. Remove a filter or search for something else.
  </EmptyState>
);
