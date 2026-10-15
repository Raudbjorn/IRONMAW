// Mirrors src/stories/layout/Workspace.stories.svelte
import * as React from 'react';
import {
  AppHeader, Button, Disclosure, DocEntry, DocHeader, DocSection, Input, PageCanvas, PageSheet, SaveStatus, Stack, Text, Workspace,
} from '@svnbjrn/ironmaw';

const side = (
  <Stack gap={3}>
    <Input label="Document name" value="Ferilskrá 2026" />
    <Disclosure title="Starfsreynsla" meta="2 entries" open>
      <Stack gap={2}>
        <Input label="Title" value="Hugbúnaðarsérfræðingur" />
        <Input label="Employer" value="Dæmafyrirtæki ehf." />
      </Stack>
    </Disclosure>
    <Disclosure title="Menntun" meta="1 entry">
      <Text size="sm" tone="muted">BSc í tölvunarfræði, Dæmaháskóli</Text>
    </Disclosure>
    <Disclosure title="Tungumál" meta="2 entries">
      <Text size="sm" tone="muted">Íslenska, enska</Text>
    </Disclosure>
  </Stack>
);

const top = (
  <AppHeader
    back={{ label: 'Back to library', href: '#' }}
    title="Ferilskrá 2026"
    status={<SaveStatus state="saved" />}
    end={
      <>
        <Button variant="secondary" size="sm" icon="share">Share</Button>
        <Button size="sm" icon="download">Download PDF</Button>
      </>
    }
  />
);

const page = (
  <PageCanvas zoom="fit" aria-label="Document preview">
    <PageSheet label="Page 1 · A4">
      <DocHeader
        name="Sveinbjörn Geirsson"
        headline="Hugbúnaðarsérfræðingur"
        contacts={[{ kind: 'email', value: 'sveinbjorn@example.is' }, { kind: 'location', value: 'Kópavogur' }]}
      />
      <DocSection title="Starfsreynsla">
        <DocEntry title="Hugbúnaðarsérfræðingur" subtitle="Dæmafyrirtæki ehf." date="2019 – 2024" location="Reykjavík" />
      </DocSection>
    </PageSheet>
  </PageCanvas>
);

export const EditorFrame = () => (
  <div style={{ height: 640 }}>
    <Workspace sidebarLabel="Editor" header={top} sidebar={side}>{page}</Workspace>
  </div>
);

export const WideSidebar = () => (
  <div style={{ height: 640 }}>
    <Workspace sidebarLabel="Editor" sidebarWidth="420px" header={top} sidebar={side}>{page}</Workspace>
  </div>
);
