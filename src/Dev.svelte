<script lang="ts">
  // Standalone dev gallery: the Library screen composed from the system,
  // in both editions. Mock passages; real metadata fixtures from the handoff.
  import {
    Button,
    Chip,
    DocumentEntry,
    Heading,
    Kicker,
    Link,
    LoadMore,
    Mark,
    NavBar,
    Notice,
    Panel,
    SearchField,
    Select,
    SourceEntry,
    Stack,
    StatusLabel,
    Suture,
    Tabs,
    Text
  } from './lib/index';

  let theme = $state<'oxide' | 'bone'>('oxide');
  $effect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  });

  let query = $state('ferilskrá');
  let view = $state('content');
  let selected = $state('cv-is');
  let copied = $state(false);
  let offline = $state(false);

  const categories = [
    ['All documents', 356],
    ['CVs', 42],
    ['Applications', 124],
    ['Writing and translation', 20],
    ['Job-search research', 14],
    ['Tools and technical references', 22],
    ['Branding and visual assets', 80],
    ['Templates', 9],
    ['Session notes', 48]
  ] as const;
</script>

<NavBar items={[{ href: '#applications', label: 'Applications' }, { href: '#ledger', label: 'Ledger' }, { href: '#intake', label: 'Intake' }, { href: '#library', label: 'Library', active: true }]}>
  {#snippet brand()}<Mark href="#home" variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />{/snippet}
  <Button variant="ghost" size="sm" chamfer={false} onclick={() => (theme = theme === 'oxide' ? 'bone' : 'oxide')}>{theme === 'oxide' ? 'Bone' : 'Oxide'}</Button>
  <Button variant="ghost" size="sm" chamfer={false} onclick={() => (offline = !offline)}>{offline ? 'Online' : 'Offline'}</Button>
</NavBar>

<main class="page">
  <Stack gap={4}>
    <Notice tone="status">Prototype data — titles, paths, sources, statuses and counts are real (index of 2026-10-13 10:15). Passage text, snippets, match counts and scores are mock.</Notice>
    {#if offline}
      <Notice tone="error" title="Can’t reach the library service.">
        Your search, filters and open document are kept. What you see was loaded before the connection dropped.
        {#snippet action()}<Button variant="secondary" size="sm" onclick={() => (offline = false)}>Retry</Button>{/snippet}
      </Notice>
    {/if}

    <Stack direction="row" gap={4} align="end" justify="between" wrap>
      <Stack gap={1}>
        <Heading level={1} display>Library</Heading>
        <Text size="sm" tone="muted">Index updated 2026-10-13 10:15 · keyword search of titles, file paths and extracted text</Text>
      </Stack>
    </Stack>

    <div class="controls">
      <SearchField bind:value={query} busy={false} />
      <Select label="Employer" options={[{ value: '', label: 'Any employer' }, { value: 'sedlabanki', label: 'Seðlabanki Íslands' }, { value: 'landsnet', label: 'Landsnet' }]} />
      <Select label="Language" value="is" options={[{ value: '', label: 'Any language' }, { value: 'en', label: 'English' }, { value: 'is', label: 'Icelandic' }, { value: 'mixed', label: 'Mixed' }]} />
      <Select label="Format" options={[{ value: '', label: 'Any format' }, { value: 'pdf', label: 'PDF' }, { value: 'text', label: 'Plain text' }]} />
      <Select label="Review status" options={[{ value: '', label: 'Any review status' }, { value: 'known-errors', label: 'Known issues' }]} />
    </div>

    <Stack direction="row" gap={3} align="center" wrap>
      <Kicker>Active filters</Kicker>
      <Chip label="Language: Icelandic" selected onremove={() => {}} />
      <Link href="#clear" quiet>Clear filters</Link>
      <Text size="xs" tone="faint" as="span">Icelandic shows documents tagged Icelandic only. Documents that mix both languages are under Mixed.</Text>
    </Stack>

    <div class="workspace">
      <Panel as="nav" aria-label="Categories" padding={3}>
        <Stack gap={2}>
          <Kicker tick>Categories</Kicker>
          <Stack as="ul" gap={1}>
            {#each categories as [label, count], i (label)}
              <li class="cat" data-active={i === 0 || undefined}>
                <a href="#cat">{label}</a><span class="count">{count}</span>
              </li>
            {/each}
          </Stack>
          <Text size="xs" tone="faint">Counts cover the whole library. Documents can appear in more than one category; totals don’t add up.</Text>
        </Stack>
      </Panel>

      <section class="results" aria-label="Results">
        <Stack direction="row" gap={3} align="baseline" justify="between" wrap>
          <Text as="span">5 documents match <Text as="span" tone="strong">“ferilskrá”</Text> · 8 matching passages</Text>
          <Text size="sm" tone="muted" as="span">Most relevant first</Text>
        </Stack>
        <Suture />
        <Stack as="ul" gap={0}>
          <DocumentEntry title="cv-sveinbjorn-geirsson.is.pdf" context="02-applications/landsnet/landsnet-2025-06" language="Icelandic" format="PDF" statuses={['snapshot']} locations={6} selected={selected === 'cv-is'} onopen={() => (selected = 'cv-is')}>
            {#snippet excerpt()}<mark>Ferilskrá</mark> Sveinbjörn Geirsson Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.{/snippet}
            {#snippet extra()}<Link href="#more" quiet>2 more matches in this document</Link>{/snippet}
          </DocumentEntry>
          <DocumentEntry title="cv-text-icelandic.txt" context="01-cv/drive-imports/drive-011346" language="Icelandic" format="Plain text" statuses={['review-required']} locations={2} selected={selected === 'cv-txt'} onopen={() => (selected = 'cv-txt')}>
            {#snippet excerpt()}<mark>Ferilskrá</mark> texti til uppsetningar Ósníðinn texti sem settur er upp í sniðmát. Kaflar: Starfsreynsla, Menntun, Tæknikunnátta.{/snippet}
            {#snippet extra()}<Link href="#more" quiet>1 more match in this document</Link>{/snippet}
          </DocumentEntry>
          <DocumentEntry title="cover-letter-landsnet.en.md" context="02-applications/landsnet/landsnet-2025-06" language="English" format="Plain text" statuses={['snapshot', 'known-errors']} selected={selected === 'cl'} onopen={() => (selected = 'cl')}>
            {#snippet excerpt()}Dear Landsnet hiring team, I am applying for the advertised position and attach my CV (<mark>ferilskrá</mark>) in English and Icelandic.{/snippet}
          </DocumentEntry>
          <DocumentEntry title="[MOCK] Ferilskrá-Sveinbjörn-Geirsson-hugbúnaðarsérfræðingur-endurskoðuð-útgáfa-með-athugasemdum-eftir-yfirlestur-lokaútgáfa-3.pdf" context="01-cv/mock/langt-heiti/demi-um-linubrot" language="Icelandic" format="PDF" statuses={['review-required', 'snapshot']} selected={selected === 'mock'} onopen={() => (selected = 'mock')} />
        </Stack>
        <LoadMore />
      </section>

      <Panel as="aside" aria-label="Reader" padding={4}>
        {#snippet header()}
          <Stack gap={2}>
            <Stack direction="row" gap={2} justify="between" align="start">
              <Kicker>CVs · Applications · Landsnet</Kicker>
              <Stack direction="row" gap={1}>
                <Button variant="ghost" size="sm" chamfer={false} label="Expand reader">⤢</Button>
                <Button variant="ghost" size="sm" chamfer={false} label="Close reader">×</Button>
              </Stack>
            </Stack>
            <Heading level={2}>cv-sveinbjorn-geirsson.is.pdf</Heading>
            <Stack direction="row" gap={2} align="center" wrap>
              <Text size="sm" tone="muted" as="span">Icelandic · PDF · 6 extracted passages</Text>
              <StatusLabel status="snapshot" />
            </Stack>
            <Text mono size="xs" tone="muted">02-applications/landsnet/landsnet-2025-06</Text>
            <Tabs bind:value={view} aria-label="Reader views" tabs={[{ id: 'content', label: 'Content', tabId: 't-c', panelId: 'p-c' }, { id: 'sources', label: 'Sources', count: 6, tabId: 't-s', panelId: 'p-s' }, { id: 'technical', label: 'Technical', tabId: 't-t', panelId: 'p-t' }]} />
          </Stack>
        {/snippet}
        {#if view === 'content'}
          <div id="p-c" role="tabpanel" aria-labelledby="t-c">
            <Stack gap={4}>
              <Stack direction="row" gap={2} align="center" wrap>
                <Kicker tone="accent">Extracted text · passage 1 of 6</Kicker>
                <Text mono size="xs" tone="muted" as="span">Page 1 · start</Text>
                <Chip label="mock text" />
              </Stack>
              <Text prose><mark class="hit">Ferilskrá</mark>
Sveinbjörn Geirsson

Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</Text>
              <Suture label="Passage 2 · page 1 · from line 34" />
              <Text prose>Starfsreynsla

Hver færsla tilgreinir starfsheiti, vinnustað og tímabil, ásamt stuttri lýsingu á helstu verkefnum.</Text>
              <Stack direction="row" gap={2} align="center">
                <Button variant="secondary" size="sm" disabled>Previous</Button>
                <Button variant="secondary" size="sm">Next</Button>
                <Text size="xs" tone="faint" as="span">Start of the document</Text>
              </Stack>
              <Text size="xs" tone="faint">Extracted text keeps paragraphs, not the original layout. Original preview is not available yet.</Text>
            </Stack>
          </div>
        {:else if view === 'sources'}
          <div id="p-s" role="tabpanel" aria-labelledby="t-s">
            <Stack gap={2}>
              <Text size="sm" tone="muted">6 locations, identical content. 48,690 bytes each. These locations contain identical file content; the document title comes from location 1.</Text>
              <SourceEntry index={1} path="library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.is.pdf" summary="Applications · Landsnet" {copied} oncopy={() => (copied = true)} fields={[{ label: 'Purpose', value: 'Preserved PDF for content/layout comparison; not a verified current or send-ready document.' }, { label: 'Original source', value: 'sources/unpacked/landsnet-2025-06/landsnet-application-2025-06/cv-sveinbjorn-geirsson.is.pdf', mono: true }, { label: 'Archive' }, { label: 'Context file', value: 'sources/unpacked/landsnet-2025-06/README.md', mono: true }]} />
              <SourceEntry index={2} path="library/01-cv/pdf-snapshots/icelandic-cv-2026-09-17/output/cv-sveinbjorn-geirsson.is.pdf" summary="CVs · snapshot" oncopy={() => {}} fields={[{ label: 'Purpose' }]} />
              <SourceEntry index={3} path="library/01-cv/drive-imports/drive-011346/cv-sveinbjorn-geirsson.is.pdf" summary="CVs · drive import" oncopy={() => {}} />
            </Stack>
          </div>
        {:else}
          <div id="p-t" role="tabpanel" aria-labelledby="t-t">
            <Text mono size="xs">document_id: 9a21913066b6803580879fb59524b0de33be70da74429e2048bcc59fe1629c69</Text>
            <Text mono size="xs">chunk_id: 9a219130…:0 · score: 12.41 (ranking value, not confidence)</Text>
          </div>
        {/if}
        {#snippet footer()}
          <Stack direction="row" gap={3} align="center" wrap>
            <Button variant="primary">Copy passage with source</Button>
            <Link href="#copy-text" quiet>Copy text only</Link>
          </Stack>
        {/snippet}
      </Panel>
    </div>
  </Stack>
</main>

<style>
  :global(body) { margin: 0; background: var(--wm-bg); color: var(--wm-text); font-family: var(--wm-font-sans); }
  .page { padding: var(--wm-space-4); max-width: 1440px; margin: 0 auto; }
  .controls { display: grid; grid-template-columns: minmax(280px, 2fr) repeat(4, minmax(140px, 1fr)); gap: var(--wm-space-3); align-items: end; }
  .workspace { display: grid; grid-template-columns: 220px minmax(400px, 1fr) minmax(360px, 520px); gap: var(--wm-space-4); align-items: start; }
  .results { display: flex; flex-direction: column; gap: var(--wm-space-3); min-width: 0; }
  .cat { display: flex; justify-content: space-between; align-items: center; gap: var(--wm-space-2); padding: 6px var(--wm-space-2); border-left: 3px solid transparent; border-radius: 0 var(--wm-radius-sm) var(--wm-radius-sm) 0; font-size: var(--wm-fs-sm); }
  .cat a { color: var(--wm-text); text-decoration: none; }
  .cat:hover { background: var(--wm-surface-2); }
  .cat[data-active] { background: var(--wm-selected); border-left-color: var(--wm-action); }
  .cat .count { font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); color: var(--wm-text-muted); }
  :global(mark.hit) { background: color-mix(in oklab, var(--wm-accent), transparent 72%); color: var(--wm-text-strong); border-bottom: 1px solid var(--wm-accent); }
  @media (max-width: 1100px) {
    .controls { grid-template-columns: 1fr 1fr; }
    .workspace { grid-template-columns: 1fr; }
  }
</style>
