// Mirrors src/stories/molecules/NavBar.stories.svelte
import * as React from 'react';
import { Button, Mark, NavBar } from '@svnbjrn/ironmaw';

const items = [
  { href: '#applications', label: 'Applications' },
  { href: '#ledger', label: 'Ledger' },
  { href: '#intake', label: 'Intake' },
  { href: '#library', label: 'Library', active: true },
];

export const Default = () => (
  <NavBar items={items} brand={<Mark href="#home" variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />}>
    <Button variant="ghost" size="sm" label="Search" icon="search" />
  </NavBar>
);

export const WordmarkOnly = () => (
  <NavBar items={[{ href: '#library', label: 'Library', active: true }, { href: '#applications', label: 'Applications' }]} brand={<Mark variant="wordmark" size="sm" name="IRONMAW" />} />
);
