// Mirrors src/stories/layout/ChangeMark.stories.svelte
import * as React from 'react';
import { ChangeMark, DocEntry, DocHeader, DocSection, PageSheet } from '@svnbjrn/ironmaw';

const page = (flag: 'margin' | 'edge') => (
  <PageSheet label="Page 1 · A4">
    <DocHeader name="Sveinbjörn Geirsson" headline="Hugbúnaðarsérfræðingur" />
    <DocSection title="Starfsreynsla">
      <ChangeMark kind="edit" flag={flag}>
        <DocEntry title="Vefforritari" subtitle="Dæmafyrirtæki ehf." date="2019 til nú" location="Kópavogur">
          <p>Þróaði og viðhélt innri vefþjónustu fyrir skjalavinnslu.</p>
        </DocEntry>
      </ChangeMark>
      <ChangeMark kind="suggestion" flag={flag}>
        <DocEntry title="Kerfisstjóri" subtitle="Dæmafyrirtæki ehf." date="2015 til 2019" location="Reykjavík">
          <p>Sá um rekstur og eftirlit með þjónustum fyrirtækisins.</p>
        </DocEntry>
      </ChangeMark>
    </DocSection>
  </PageSheet>
);

export const EditAndSuggestion = () => <div style={{ padding: '24px 240px 24px 24px', width: 'max-content' }}>{page('margin')}</div>;

export const EdgeFlag = () => <div style={{ padding: 24, width: 'max-content' }}>{page('edge')}</div>;
