<script lang="ts">
  import { tick } from 'svelte';
  // Example screen, not part of the package: a CV editor composed only from
  // IRONMAW parts. Write edits the record, Design restyles the page, Check
  // reports what an applicant-tracking parser would struggle with. Every
  // figure (score, counts, findings) is derived from the record below; the
  // fixes change the record. People and contacts are fictional.
  import {
    AppHeader,
    Avatar,
    Button,
    DocEntry,
    DocHeader,
    DocSection,
    Disclosure,
    Input,
    IssueCard,
    Kbd,
    Menu,
    Notice,
    PageAnnotation,
    PageCanvas,
    PageSheet,
    ReorderList,
    SaveStatus,
    ScoreRing,
    SegmentedControl,
    Select,
    SplitButton,
    Stack,
    Suture,
    SwatchPicker,
    Switch,
    Tabs,
    Text,
    Workspace,
    ZoomControl
  } from '../lib/index';
  import type { DocContact, MenuEntry, ReorderItem } from '../lib/index';

  type Mode = 'write' | 'design' | 'check';
  type Kind = 'experience' | 'education' | 'skills' | 'languages' | 'interests' | 'references' | 'summary' | 'custom';
  interface Entry {
    title: string;
    subtitle?: string;
    date?: string;
    location?: string;
    body?: string;
  }
  interface Section {
    id: string;
    kind: Kind;
    title: string;
    columns: 1 | 2;
    hidden: boolean;
    entries: Entry[];
  }

  interface Props {
    mode?: Mode;
  }
  let { mode = $bindable('check') }: Props = $props();

  // Headings applicant-tracking parsers look for, per section kind.
  const STANDARD: Record<Kind, string | undefined> = {
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    interests: 'Interests',
    references: 'References',
    summary: 'Summary',
    custom: undefined
  };

  // ── The record ──────────────────────────────────────────────────────────
  let profile = $state({
    name: 'Sveinbjörn Geirsson',
    headline: '',
    email: 'sveinbjorn@example.is',
    phone: '555 0100',
    location: 'Kópavogur',
    website: ''
  });

  let sections = $state<Section[]>([
    {
      id: 'skills',
      kind: 'skills',
      title: 'Forritunarmál o.fl.',
      columns: 2,
      hidden: false,
      entries: [
        { title: 'Forritunarmál', body: 'Java, C#, Python, C++' },
        { title: 'Gagnagrunnar', body: 'MySQL, SQL Server, PostgreSQL' },
        { title: 'Vefforritun', body: 'JavaScript, HTML/CSS' },
        { title: 'Annað', body: 'Siteimprove, myndvinnsla' }
      ]
    },
    {
      id: 'references',
      kind: 'references',
      title: 'Meðmælendur',
      columns: 1,
      hidden: false,
      entries: [
        { title: 'Anna Jónsdóttir', subtitle: 'Dæmastofnun' },
        { title: 'Páll Ólafsson', subtitle: 'Dæmafyrirtæki ehf.' }
      ]
    },
    {
      id: 'interests',
      kind: 'interests',
      title: 'Áhugamál',
      columns: 2,
      hidden: false,
      entries: [{ title: 'Tölvur og raftæki' }, { title: 'Elda og baka' }, { title: 'Prjóna' }, { title: 'Bækur' }]
    },
    {
      id: 'languages',
      kind: 'languages',
      title: 'Tungumál',
      columns: 2,
      hidden: false,
      entries: [
        { title: 'Íslenska', subtitle: 'Móðurmál' },
        { title: 'Enska', subtitle: 'Reiprennandi' }
      ]
    }
  ]);

  // ── Check: findings derived from the record ─────────────────────────────
  interface Finding {
    id: string;
    category: string;
    title: string;
    detail: string;
    sectionId?: string;
    fix?: { label: string; icon: 'plus' | 'heading'; run: () => void };
  }

  let ignored = $state<string[]>([]);
  let activeFinding = $state<string | undefined>();

  const visibleSections = $derived(sections.filter((s) => !s.hidden));

  const checks = $derived.by(() => {
    const list: { id: string; pass: boolean }[] = [
      { id: 'name', pass: profile.name.trim().length > 0 },
      { id: 'email', pass: /.+@.+\..+/.test(profile.email) },
      { id: 'phone', pass: profile.phone.trim().length > 0 },
      { id: 'location', pass: profile.location.trim().length > 0 },
      { id: 'experience', pass: visibleSections.some((s) => s.kind === 'experience') },
      { id: 'education', pass: visibleSections.some((s) => s.kind === 'education') },
      { id: 'text-layer', pass: true },
      { id: 'single-column-flow', pass: true },
      { id: 'no-images-of-text', pass: true },
      { id: 'page-count', pass: true }
    ];
    for (const s of visibleSections) {
      const std = STANDARD[s.kind];
      list.push({ id: `heading-${s.id}`, pass: !std || s.title.trim().toLowerCase() === std.toLowerCase() });
    }
    return list;
  });

  const findings = $derived.by((): Finding[] => {
    const out: Finding[] = [];
    if (!visibleSections.some((s) => s.kind === 'experience')) {
      out.push({
        id: 'experience',
        category: 'Sections',
        title: 'No work experience section',
        detail: 'Parsers look for an experience section. Projects or volunteering can show the same history.',
        fix: { label: 'Add experience', icon: 'plus', run: addExperience }
      });
    }
    if (!visibleSections.some((s) => s.kind === 'education')) {
      out.push({
        id: 'education',
        category: 'Sections',
        title: 'No education section',
        detail: 'Most parsers fill an education field. Leave it out only if the role does not ask for it.',
        fix: { label: 'Add education', icon: 'plus', run: () => addSection('education') }
      });
    }
    for (const s of visibleSections) {
      const std = STANDARD[s.kind];
      if (!std || s.title.trim().toLowerCase() === std.toLowerCase()) continue;
      out.push({
        id: `heading-${s.id}`,
        category: 'Section headings',
        title: `“${s.title}” isn't a heading parsers look for`,
        detail: `They look for headings such as Experience, Education and Skills. This section reads as ${std.toLowerCase()}.`,
        sectionId: s.id,
        fix: { label: `Rename to “${std}”`, icon: 'heading', run: () => rename(s.id, std) }
      });
    }
    return out.filter((f) => !ignored.includes(f.id));
  });

  const passed = $derived(checks.filter((c) => c.pass).length);
  const score = $derived(checks.length ? Math.round((passed / checks.length) * 100) : NaN);
  const verdict = $derived(score >= 90 ? 'Reads cleanly' : score >= 70 ? 'Mostly readable' : 'Hard for parsers to read');
  const findingIndex = (id: string) => findings.findIndex((f) => f.id === id) + 1;
  const findingFor = (sectionId: string) => findings.find((f) => f.sectionId === sectionId);

  let checkTab = $state('issues');
  let pageView = $state('person');

  function rename(id: string, title: string) {
    sections = sections.map((s) => (s.id === id ? { ...s, title } : s));
  }

  function show(f: Finding) {
    activeFinding = f.id;
    pageView = 'person';
    // Findings must be readable where they land: leave fit-to-width for actual size.
    if (zoom === 'fit') zoom = 100;
    if (!f.sectionId) return;
    tick().then(() => {
      // Scroll the canvas vertically only, so the page margin and label stay in view.
      const el = document.getElementById(`page-${f.sectionId}`);
      const scroller = el?.closest<HTMLElement>('[data-part="scroller"]');
      if (!el || !scroller) return;
      scroller.scrollLeft = 0;
      if (scroller.scrollHeight > scroller.clientHeight) {
        const top = scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        scroller.scrollTo({ top: Math.max(0, top - scroller.clientHeight / 4), behavior: 'smooth' });
      } else {
        // Stacked layout (narrow screens): the window scrolls, not the canvas.
        window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 96, behavior: 'smooth' });
      }
    });
  }

  // ── Write: sections list ────────────────────────────────────────────────
  let expanded = $state<string[]>([]);

  const listItems = $derived<ReorderItem[]>(
    sections.map((s) => ({
      id: s.id,
      label: s.title,
      count: s.entries.length,
      hidden: s.hidden,
      expanded: expanded.includes(s.id)
    }))
  );

  const rowMenu: MenuEntry[] = [
    { id: 'rename-standard', label: 'Use the standard heading', icon: 'heading' },
    { id: 'columns', label: 'Toggle two columns', icon: 'summary' },
    { separator: true },
    { id: 'remove', label: 'Remove section', icon: 'trash', danger: true }
  ];

  const addMenu: MenuEntry[] = [
    { id: 'summary', label: 'Summary', icon: 'summary' },
    { id: 'profiles', label: 'Profiles', icon: 'profiles' },
    { id: 'education', label: 'Education', icon: 'education' },
    { id: 'projects', label: 'Projects', icon: 'projects' },
    { id: 'awards', label: 'Awards', icon: 'awards' },
    { id: 'certifications', label: 'Certifications', icon: 'certifications' },
    { id: 'publications', label: 'Publications', icon: 'publications' },
    { id: 'volunteer', label: 'Volunteer work', icon: 'volunteer' },
    { separator: true },
    { id: 'custom', label: 'Custom section', icon: 'plus', wide: true, submenu: true }
  ];

  function move(id: string, to: number) {
    const from = sections.findIndex((s) => s.id === id);
    if (from < 0) return;
    const next = sections.slice();
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    sections = next;
  }

  function onRowMenu(itemId: string, action: string) {
    const s = sections.find((x) => x.id === itemId);
    if (!s) return;
    if (action === 'remove') sections = sections.filter((x) => x.id !== itemId);
    if (action === 'columns') sections = sections.map((x) => (x.id === itemId ? { ...x, columns: x.columns === 2 ? 1 : 2 } : x));
    if (action === 'rename-standard' && STANDARD[s.kind]) rename(itemId, STANDARD[s.kind] as string);
  }

  let seq = 0;
  function addSection(kind: string) {
    const kinds: readonly string[] = ['experience', 'education', 'skills', 'languages', 'interests', 'references', 'summary'];
    const known: Kind = kinds.includes(kind) ? (kind as Kind) : 'custom';
    const label = addMenu.find((m) => 'label' in m && m.id === kind);
    const id = `${kind}-${++seq}`;
    const title = STANDARD[known] ?? (label && 'label' in label ? label.label : 'New section');
    const entries: Entry[] =
      known === 'education' ? [{ title: 'Dæmagráða', subtitle: 'Dæmaháskóli', date: '2012 – 2015' }] : [];
    sections = [...sections, { id, kind: known, title, columns: 1, hidden: false, entries }];
    expanded = [...expanded, id];
  }

  function addExperience() {
    const id = `experience-${++seq}`;
    sections = [
      {
        id,
        kind: 'experience',
        title: 'Experience',
        columns: 1,
        hidden: false,
        entries: [{ title: 'Dæmastarf', subtitle: 'Dæmafyrirtæki ehf.', date: '2020 – nú', location: 'Reykjavík' }]
      },
      ...sections
    ];
    expanded = [...expanded, id];
    mode = 'write';
  }

  // ── Design: page settings ───────────────────────────────────────────────
  let bodySize = $state('10.5');
  let lineHeight = $state('1.5');
  let headingWeight = $state('600');
  let hyphenate = $state(false);
  let paper = $state<'a4' | 'letter'>('a4');
  let dateFormat = $state('year');
  let accent = $state('#1A6E6E');
  let designTab = $state('type');

  const accents = [
    { value: '#1A6E6E', label: 'Teal' },
    { value: '#A6461A', label: 'Rust' },
    { value: '#4B6676', label: 'Slate' },
    { value: '#0F1416', label: 'Charcoal' }
  ];

  // Scales the type tokens inside the sheet only; 10.5pt is the system default.
  const pageStyle = $derived.by(() => {
    const k = Math.min(1.4, Math.max(0.75, (Number(bodySize) || 10.5) / 10.5));
    const lh = Math.min(2, Math.max(1.1, Number(lineHeight) || 1.5));
    const fs = (rem: number) => `${(rem * k).toFixed(4)}rem`;
    return [
      `--wm-fs-xs:${fs(0.75)}`,
      `--wm-fs-sm:${fs(0.8125)}`,
      `--wm-fs-base:${fs(0.875)}`,
      `--wm-fs-lg:${fs(1)}`,
      `--wm-fs-3xl:${fs(1.75)}`,
      `--wm-lh-relaxed:${lh}`,
      `--wm-lh-normal:${lh}`,
      `--wm-font-weight-semibold:${headingWeight}`,
      `--wm-accent:${accent}`,
      `hyphens:${hyphenate ? 'auto' : 'manual'}`
    ].join(';');
  });

  // ── Header and canvas ───────────────────────────────────────────────────
  let zoom = $state<number | 'fit'>('fit');
  let saveState = $state<'saved' | 'saving' | 'unsaved' | 'error'>('saved');

  const modes = $derived([
    { id: 'write', label: 'Write', icon: 'write' as const },
    { id: 'design', label: 'Design', icon: 'design' as const },
    {
      id: 'check',
      label: 'Check',
      icon: 'checklist' as const,
      count: findings.length,
      countTone: 'warning' as const,
      countLabel: `${findings.length} findings to review`
    }
  ]);

  const contacts = $derived<DocContact[]>(
    [
      profile.email && { kind: 'email' as const, value: profile.email },
      profile.phone && { kind: 'phone' as const, value: profile.phone },
      profile.location && { kind: 'location' as const, value: profile.location },
      profile.website && { kind: 'website' as const, value: profile.website, href: profile.website }
    ].filter(Boolean) as DocContact[]
  );

  const parsed = $derived<[string, string][]>([
    ['Name', profile.name || '—'],
    ['Email', profile.email || '—'],
    ['Phone', profile.phone || '—'],
    ['Location', profile.location || '—'],
    ...visibleSections.map((s): [string, string] => [
      s.title,
      STANDARD[s.kind] && s.title.toLowerCase() === STANDARD[s.kind]!.toLowerCase()
        ? `${STANDARD[s.kind]} · ${s.entries.length} entries`
        : 'Not recognised: read as plain text'
    ])
  ]);
</script>

{#snippet header()}
  <AppHeader back={{ label: 'Back to CVs', href: '#cvs' }}>
    {#snippet heading()}
      <Menu
        label="Document actions"
        text={profile.name}
        icon="file"
        iconEnd="chevron-down"
        variant="ghost"
        size="sm"
        plain
        items={[
          { id: 'rename', label: 'Rename', icon: 'write' },
          { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
          { separator: true },
          { id: 'delete', label: 'Delete CV', icon: 'trash', danger: true }
        ]}
      />
    {/snippet}
    {#snippet status()}<SaveStatus state={saveState} />{/snippet}
    {#snippet center()}
      <SegmentedControl options={modes} bind:value={mode} aria-label="Editor mode" size="sm" />
    {/snippet}
    {#snippet end()}
      <Button variant="ghost" size="sm" icon="history" label="Version history" />
      <Button variant="ghost" size="sm" icon="assist" label="Writing assistant" />
      <Button variant="secondary" size="sm" icon="share">Share</Button>
      <SplitButton
        label="Download PDF"
        icon="download"
        menuLabel="More download options"
        items={[
          { id: 'txt', label: 'Plain text', icon: 'file', hint: '.txt' },
          { id: 'json', label: 'Structured data', icon: 'code', hint: '.json' }
        ]}
      />
    {/snippet}
  </AppHeader>
{/snippet}

{#snippet checkSidebar()}
  <Stack gap={3}>
    <div class="score">
      <ScoreRing value={score} label="Parse readability" tone={score >= 70 ? 'accent' : 'warning'} />
      <div class="score-copy">
        <Text tone="strong">{verdict}</Text>
        <Text size="sm" tone="muted">{passed} of {checks.length} checks pass. {findings.length} to review.</Text>
        <Text size="xs" tone="faint">Updates as you edit</Text>
      </div>
    </div>
    <Tabs
      aria-label="Check views"
      bind:value={checkTab}
      tabs={[
        { id: 'issues', label: 'Findings', count: findings.length, tabId: 'tab-findings', panelId: 'panel-findings' },
        { id: 'match', label: 'Job match', tabId: 'tab-match', panelId: 'panel-match' },
        { id: 'writing', label: 'Writing', tabId: 'tab-writing', panelId: 'panel-writing' }
      ]}
    />
    <div id="panel-findings" role="tabpanel" aria-labelledby="tab-findings" hidden={checkTab !== 'issues'}>
      <Stack gap={2}>
        {#each findings as f, i (f.id)}
          <IssueCard index={i + 1} category={f.category} title={f.title} active={activeFinding === f.id}>
            {f.detail}
            {#snippet actions()}
              {#if f.fix}<Button variant="secondary" size="sm" icon={f.fix.icon} onclick={f.fix.run}>{f.fix.label}</Button>{/if}
              {#if f.sectionId}<Button variant="ghost" size="sm" onclick={() => show(f)}>Show on page</Button>{/if}
              <Button variant="ghost" size="sm" onclick={() => (ignored = [...ignored, f.id])}>Ignore</Button>
            {/snippet}
          </IssueCard>
        {:else}
          <Notice tone="status" title="Nothing to review">Every check passes for this CV.</Notice>
        {/each}
        {#if ignored.length}
          <Button variant="ghost" size="sm" icon="refresh" onclick={() => (ignored = [])}>
            Show {ignored.length} ignored {ignored.length === 1 ? 'finding' : 'findings'}
          </Button>
        {/if}
      </Stack>
    </div>
    <div id="panel-match" role="tabpanel" aria-labelledby="tab-match" hidden={checkTab !== 'match'}>
      <Notice tone="status" title="No job selected">Pick an application to compare this CV with its job description.</Notice>
    </div>
    <div id="panel-writing" role="tabpanel" aria-labelledby="tab-writing" hidden={checkTab !== 'writing'}>
      <Notice tone="status" title="Writing checks not run">Run them from the writing assistant.</Notice>
    </div>
  </Stack>
{/snippet}

{#snippet designSidebar()}
  <Stack gap={4}>
    <Tabs
      aria-label="Design settings"
      bind:value={designTab}
      tabs={[
        { id: 'type', label: 'Type', tabId: 'tab-type', panelId: 'panel-type' },
        { id: 'colour', label: 'Colour', tabId: 'tab-colour', panelId: 'panel-colour' },
        { id: 'page', label: 'Page', tabId: 'tab-page', panelId: 'panel-page' }
      ]}
    />
    <div id="panel-type" role="tabpanel" aria-labelledby="tab-type" hidden={designTab !== 'type'}>
      <Stack gap={4}>
        <Suture label="Body" />
        <Select label="Font family" value="inter" options={[{ value: 'inter', label: 'Inter' }]} disabled />
        <div class="pair">
          <Input label="Size" type="number" step="0.5" min="8" max="14" bind:value={bodySize} unit="pt" />
          <Input label="Line height" type="number" step="0.05" min="1.1" max="2" bind:value={lineHeight} />
        </div>
        <Suture label="Headings" />
        <Select
          label="Weight"
          bind:value={headingWeight}
          options={[
            { value: '550', label: 'Medium' },
            { value: '600', label: 'Semibold' },
            { value: '650', label: 'Bold' }
          ]}
        />
        <Switch
          bind:checked={hyphenate}
          label="Hyphenation"
          description="Breaks long words between syllables, using the language set for the page."
        />
      </Stack>
    </div>
    <div id="panel-colour" role="tabpanel" aria-labelledby="tab-colour" hidden={designTab !== 'colour'}>
      <Stack gap={4}>
        <Suture label="Accent" />
        <SwatchPicker colors={accents} bind:value={accent} aria-label="Accent colour" columns={4} />
        <Input label="Custom accent" mono bind:value={accent}>
          {#snippet leading()}<span class="swatch" style:background={accent}></span>{/snippet}
        </Input>
        <Text size="xs" tone="faint">Icons and links use the accent. Pick a colour that keeps text readable on paper.</Text>
      </Stack>
    </div>
    <div id="panel-page" role="tabpanel" aria-labelledby="tab-page" hidden={designTab !== 'page'}>
      <Stack gap={4}>
        <Select
          label="Paper"
          bind:value={paper}
          options={[
            { value: 'a4', label: 'A4 (210 × 297 mm)' },
            { value: 'letter', label: 'US Letter (8.5 × 11 in)' }
          ]}
        />
        <Disclosure title="Advanced" variant="section">
          <Select
            label="Date format"
            bind:value={dateFormat}
            options={[
              { value: 'year', label: '2022' },
              { value: 'month', label: 'mars 2022' },
              { value: 'numeric', label: '03/2022' }
            ]}
          />
        </Disclosure>
      </Stack>
    </div>
  </Stack>
{/snippet}

{#snippet writeSidebar()}
  <Stack gap={4}>
    <Disclosure variant="card" title={profile.name || 'Your name'} meta={profile.location} open>
      {#snippet leading()}<Avatar name={profile.name || '?'} />{/snippet}
      <Stack gap={3}>
        <Notice tone="info">
          No photo. Most applicant-tracking systems ignore photos; some regions expect one.
          {#snippet action()}<Button variant="secondary" size="xs" icon="camera">Add</Button>{/snippet}
        </Notice>
        <Input label="Full name" bind:value={profile.name} autocomplete="name" />
        <Input label="Headline" bind:value={profile.headline} placeholder="Hugbúnaðarsérfræðingur" />
        <Input label="Email" type="email" bind:value={profile.email} autocomplete="email" />
        <div class="pair">
          <Input label="Phone" type="tel" bind:value={profile.phone} autocomplete="tel" />
          <Input label="Location" bind:value={profile.location} />
        </div>
        <Input label="Website" type="url" bind:value={profile.website} placeholder="https://" icon="link" />
      </Stack>
    </Disclosure>

    <div class="list-head">
      <Suture label="Sections · print order" />
      <Kbd keys={['⌥', '↑', '↓']} label="Alt plus Up or Down moves a section" />
    </div>
    <ReorderList
      items={listItems}
      aria-label="Sections in print order"
      menu={rowMenu}
      onmove={move}
      onvisibility={(id, hidden) => (sections = sections.map((s) => (s.id === id ? { ...s, hidden } : s)))}
      onexpand={(id, open) => (expanded = open ? [...expanded, id] : expanded.filter((x) => x !== id))}
      onmenu={onRowMenu}
    >
      {#snippet detail(item)}
        {@const section = sections.find((s) => s.id === item.id)}
        <Stack gap={1}>
          {#each section?.entries ?? [] as entry, i (i)}
            <div class="entry-row">
              <Text size="sm">{entry.title}</Text>
              {#if entry.subtitle || entry.date}<Text size="xs" tone="muted">{[entry.subtitle, entry.date].filter(Boolean).join(' · ')}</Text>{/if}
            </div>
          {:else}
            <Text size="xs" tone="faint">No entries yet.</Text>
          {/each}
          <Button variant="ghost" size="xs" icon="plus">Add entry</Button>
        </Stack>
      {/snippet}
    </ReorderList>
    <Menu
      label="Add section"
      text="Add section"
      icon="plus"
      variant="dashed"
      size="md"
      columns={2}
      items={addMenu}
      onselect={addSection}
    />
    <Text size="xs" tone="faint">Hidden sections keep their content but are not printed or shared. Fields save as you type.</Text>
  </Stack>
{/snippet}

{#snippet page()}
  <PageSheet size={paper} label={`Page 1 · ${paper === 'a4' ? 'A4' : 'Letter'}`} aria-label="CV, page 1">
    <div class="page" style={pageStyle}>
      <DocHeader name={profile.name} headline={profile.headline || undefined} {contacts} />
      {#each visibleSections as s (s.id)}
        {@const f = mode === 'check' ? findingFor(s.id) : undefined}
        <div id="page-{s.id}" class="page-section">
          {#if f}
            <PageAnnotation index={findingIndex(f.id)} label={f.title} active={activeFinding === f.id}>
              {@render sectionBody(s)}
            </PageAnnotation>
          {:else}
            {@render sectionBody(s)}
          {/if}
        </div>
      {/each}
    </div>
  </PageSheet>
{/snippet}

{#snippet sectionBody(s: Section)}
  <DocSection title={s.title} columns={s.columns}>
    {#each s.entries as e, i (i)}
      <DocEntry title={e.title} subtitle={e.subtitle} date={e.date} location={e.location}>
        {#if e.body}<p>{e.body}</p>{/if}
      </DocEntry>
    {/each}
  </DocSection>
{/snippet}

{#snippet parserPage()}
  <PageSheet size={paper} label="Extracted fields" aria-label="What a parser reads">
    <dl class="parsed">
      {#each parsed as [k, v], i (i)}
        <dt>{k}</dt>
        <dd data-miss={v.startsWith('Not recognised') || undefined}>{v}</dd>
      {/each}
    </dl>
  </PageSheet>
{/snippet}

<Workspace sidebarWidth="344px" sidebarLabel={mode === 'check' ? 'Check results' : mode === 'design' ? 'Design settings' : 'CV content'} {header}>
  {#snippet sidebar()}
    {#if mode === 'check'}{@render checkSidebar()}{:else if mode === 'design'}{@render designSidebar()}{:else}{@render writeSidebar()}{/if}
  {/snippet}
  <PageCanvas {zoom} pageWidth={paper === 'a4' ? 794 : 816}>
    {#snippet toolbar()}
      {#if mode === 'check'}
        <SegmentedControl
          bind:value={pageView}
          aria-label="Preview"
          size="sm"
          options={[
            { id: 'person', label: 'What a person sees', icon: 'file' },
            { id: 'parser', label: 'What a parser reads', icon: 'code' }
          ]}
        />
      {/if}
    {/snippet}
    {#snippet overlay()}
      <ZoomControl value={zoom} onchange={(v) => (zoom = v)} pageCount={1} />
    {/snippet}
    {#if mode === 'check' && pageView === 'parser'}{@render parserPage()}{:else}{@render page()}{/if}
  </PageCanvas>
</Workspace>

<style>
  .score {
    display: flex;
    align-items: center;
    gap: var(--wm-space-4);
    padding: var(--wm-space-3) var(--wm-space-4);
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-md);
    background: var(--wm-surface-2);
  }
  .score-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wm-space-3); }
  .list-head { display: flex; align-items: center; gap: var(--wm-space-3); }
  .list-head :global([data-wm='suture']) { flex: 1; }
  .entry-row { display: flex; flex-direction: column; padding-block: 2px; }
  .swatch { display: block; width: 16px; height: 16px; border-radius: var(--wm-radius-sm); }
  .page-section { scroll-margin: var(--wm-space-12); }
  .parsed {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--wm-space-2) var(--wm-space-6);
    margin: 0;
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-sm);
  }
  .parsed dt { color: var(--wm-text-muted); }
  .parsed dd { margin: 0; color: var(--wm-text); }
  .parsed dd[data-miss] { color: var(--wm-warning); }
</style>
