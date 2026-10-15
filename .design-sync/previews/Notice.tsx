// Mirrors src/stories/molecules/Notice.stories.svelte
import * as React from 'react';
import { Button, Link, Notice, Stack } from '@svnbjrn/ironmaw';

export const Info = () => <Notice tone="info" dismissLabel="Dismiss" ondismiss={() => {}}>Icelandic shows documents tagged Icelandic only. Documents that mix both languages are under Mixed.</Notice>;

export const ServiceUnavailable = () => (
  <Notice tone="error" title="Can’t reach the library service." action={<Button variant="secondary" size="sm">Retry</Button>}>
    Your search, filters and open document are kept. What you see was loaded before the connection dropped.
  </Notice>
);

export const KnownIssues = () => (
  <Notice tone="warning" title="Known issues: read the context before quoting.">
    The source package records corrections for this document. They aren’t in the index yet; they’re in this file: <Link href="#context">sources/unpacked/landsnet-2025-06/README.md</Link>
  </Notice>
);

export const IndexRefreshed = () => (
  <Notice tone="status" dismissLabel="Dismiss" ondismiss={() => {}}>Index updated 2026-10-13 14:02. Results were refreshed; your search and filters are kept.</Notice>
);

export const Clipboard = () => (
  <Stack gap={3}>
    <Notice tone="success" dismissLabel="Dismiss" ondismiss={() => {}}>Copied the passage with its source and the known-issues caution.</Notice>
    <Notice tone="error">Could not copy. Select the text and copy it manually.</Notice>
  </Stack>
);
