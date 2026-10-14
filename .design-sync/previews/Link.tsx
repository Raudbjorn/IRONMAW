// Mirrors src/stories/atoms/Link.stories.svelte
import * as React from 'react';
import { Link, Stack, Text } from '@svnbjrn/ironmaw';

export const Internal = () => (
  <Text>Open the <Link href="#sources">Sources</Link> view to inspect all six locations.</Text>
);

export const External = () => (
  <Text>Interaction reference: <Link href="https://mrpeker.github.io/turbopuffer-gui/" external>Turbopuffer GUI</Link></Text>
);

export const Quiet = () => (
  <Stack gap={2}>
    <Text size="sm"><Link href="#more" quiet>2 more matches in this document</Link></Text>
    <Text size="sm"><Link href="#clear" quiet>Clear filters</Link></Text>
  </Stack>
);
