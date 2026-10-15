// Mirrors src/stories/library/DocumentEntry.stories.svelte
import * as React from 'react';
import { DocumentEntry, Link, Stack } from '@svnbjrn/ironmaw';

export const Browse = () => (
  <Stack as="ul" gap={0}>
    <DocumentEntry title="cv-text-icelandic.txt" context="01-cv/drive-imports/drive-011346" language="Icelandic" format="Plain text" statuses={['review-required']} locations={2} onopen={() => {}} />
  </Stack>
);

export const SearchSelected = () => (
  <Stack as="ul" gap={0}>
    <DocumentEntry
      title="cv-sveinbjorn-geirsson.is.pdf"
      context="02-applications/landsnet/landsnet-2025-06"
      language="Icelandic"
      format="PDF"
      statuses={['snapshot']}
      locations={6}
      selected
      onopen={() => {}}
      excerpt={<><mark>Ferilskrá</mark> Sveinbjörn Geirsson Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</>}
      extra={<Link href="#more" quiet>2 more matches in this document</Link>}
    />
    <DocumentEntry
      title="cv-text-icelandic.txt"
      context="01-cv/drive-imports/drive-011346"
      language="Icelandic"
      format="Plain text"
      statuses={['review-required']}
      locations={2}
      onopen={() => {}}
      excerpt={<><mark>Ferilskrá</mark> texti til uppsetningar Ósníðinn texti sem settur er upp í sniðmát. Kaflar: Starfsreynsla, Menntun, Tæknikunnátta.</>}
      extra={<Link href="#more" quiet>1 more match in this document</Link>}
    />
  </Stack>
);

export const KnownIssues = () => (
  <Stack as="ul" gap={0}>
    <DocumentEntry
      title="cover-letter-landsnet.en.md"
      context="02-applications/landsnet/landsnet-2025-06"
      language="English"
      format="Plain text"
      statuses={['snapshot', 'known-errors']}
      onopen={() => {}}
      excerpt={<>Dear <mark>Landsnet</mark> hiring team, I am applying for the advertised position and attach my CV in English and Icelandic.</>}
    />
  </Stack>
);

export const SameTitleLongName = () => (
  <Stack as="ul" gap={0}>
    <DocumentEntry title="Sveinbjorn-Geirsson-CV.pdf" context="01-cv/drive-imports/drive-011459" language="English" format="PDF" statuses={['snapshot']} onopen={() => {}} />
    <DocumentEntry title="Sveinbjorn-Geirsson-CV.pdf" context="01-cv/pdf-snapshots/icelandic-cv-2026-09-17/input" language="English" format="PDF" statuses={['snapshot']} onopen={() => {}} />
    <DocumentEntry
      title="Ferilskrá-Sveinbjörn-Geirsson-hugbúnaðarsérfræðingur-endurskoðuð-útgáfa-með-athugasemdum-eftir-yfirlestur-lokaútgáfa-3.pdf"
      context="01-cv/mock/langt-heiti/demi-um-linubrot"
      language="Icelandic"
      format="PDF"
      statuses={['review-required', 'snapshot', 'historical-variant']}
      onopen={() => {}}
    />
  </Stack>
);

export const MetadataOnly = () => (
  <Stack as="ul" gap={0}>
    <DocumentEntry title="logo-banner.png" context="02-applications/reitun/archive/cover-letter" language="Unknown" format="Image / asset" statuses={['visual-reference']} onopen={() => {}} excerpt={<>Matched document metadata: the title or a file path, not the text.</>} />
  </Stack>
);
