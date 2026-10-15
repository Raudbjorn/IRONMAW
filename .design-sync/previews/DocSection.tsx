// Mirrors src/stories/document/DocSection.stories.svelte
import * as React from 'react';
import { DocEntry, DocSection } from '@svnbjrn/ironmaw';

export const OneColumn = () => (
  <DocSection title="Menntun" columns={1}>
    <DocEntry title="BSc í tölvunarfræði" subtitle="Dæmaháskóli" date="2012 – 2015" />
    <DocEntry title="Stúdentspróf" subtitle="Dæmaskóli" date="2008 – 2012" />
  </DocSection>
);

export const TwoColumns = () => (
  <DocSection title="Forritunarmál o.fl." columns={2}>
    <DocEntry title="Forritunarmál"><p>Java, C#, Python, C++</p></DocEntry>
    <DocEntry title="Gagnagrunnar"><p>MySQL, SQL Server, PostgreSQL</p></DocEntry>
    <DocEntry title="Vefforritun"><p>JavaScript, HTML/CSS</p></DocEntry>
    <DocEntry title="Annað"><p>Siteimprove</p></DocEntry>
  </DocSection>
);
