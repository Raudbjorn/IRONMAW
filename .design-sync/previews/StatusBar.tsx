// Mirrors src/stories/layout/StatusBar.stories.svelte
import * as React from 'react';
import { StatusBar } from '@svnbjrn/ironmaw';

export const Neutral = () => <StatusBar label="Local workspace" status="All changes saved on this device." />;

export const Warning = () => <StatusBar label="Local workspace" tone="warning" status="2 changes are not saved yet." />;

export const ErrorWithExtras = () => (
  <StatusBar label="Local workspace" tone="error" status="Couldn’t save. Your edits are kept on this page." end={<span>Page 1 of 2</span>} />
);
