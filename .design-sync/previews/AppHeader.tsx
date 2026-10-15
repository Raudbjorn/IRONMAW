// Mirrors src/stories/molecules/AppHeader.stories.svelte
import * as React from 'react';
import { AppHeader, Button, SaveStatus, SegmentedControl, SplitButton } from '@svnbjrn/ironmaw';

const modes = (
  <SegmentedControl
    aria-label="Editor mode"
    size="sm"
    value="write"
    options={[
      { id: 'write', label: 'Write' },
      { id: 'design', label: 'Design' },
      { id: 'check', label: 'Check', count: 4, countTone: 'warning', countLabel: '4 checks to review' },
    ]}
  />
);

const actions = (
  <>
    <Button variant="ghost" size="sm" icon="history" label="Version history" />
    <Button variant="ghost" size="sm" icon="assist" label="Writing assistant" />
    <Button variant="secondary" size="sm" icon="share">Share</Button>
    <SplitButton
      label="Download PDF"
      icon="download"
      menuLabel="More download options"
      items={[
        { id: 'pdf', label: 'PDF for people', icon: 'file' },
        { id: 'text', label: 'Plain text for parsers', icon: 'code' },
      ]}
    />
  </>
);

const saved = <SaveStatus state="saved" />;

export const FullEditorBar = () => (
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" status={saved} center={modes} end={actions} />
);

export const LongTitle = () => (
  <AppHeader
    back={{ label: 'Back to library' }}
    title="Umsókn um starf hugbúnaðarsérfræðings hjá Dæmafyrirtæki ehf. í Kópavogi"
    status={saved}
    end={actions}
  />
);

export const TitleOnly = () => (
  <AppHeader back={{ label: 'Back to library', href: '#' }} title="Ferilskrá 2026" />
);
