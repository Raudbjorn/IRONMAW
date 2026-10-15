// Mirrors src/stories/document/DocEntry.stories.svelte
import * as React from 'react';
import { DocEntry } from '@svnbjrn/ironmaw';

export const WithDetails = () => (
  <div data-theme="bone" style={{ background: 'var(--wm-bg)', color: 'var(--wm-text)', padding: 32 }}>
    <DocEntry title="Hugbúnaðarsérfræðingur" subtitle="Dæmafyrirtæki ehf." date="2019 – 2024" location="Reykjavík">
      <ul>
        <li>Hönnun og þróun vefkerfa</li>
        <li>Umsjón með gagnagrunnum</li>
      </ul>
    </DocEntry>
  </div>
);

export const TitleOnly = () => (
  <div data-theme="bone" style={{ background: 'var(--wm-bg)', color: 'var(--wm-text)', padding: 32 }}>
    <DocEntry title="Íslenska" />
  </div>
);

export const WithParagraph = () => (
  <div data-theme="bone" style={{ background: 'var(--wm-bg)', color: 'var(--wm-text)', padding: 32 }}>
    <DocEntry title="Forritari" subtitle="Dæmafyrirtæki ehf." date="2015 – 2019" location="Kópavogur">
      <p>Þróun innri kerfa og samþætting við þriðja aðila.</p>
    </DocEntry>
  </div>
);
