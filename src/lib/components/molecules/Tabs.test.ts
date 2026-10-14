import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Tabs from './Tabs.svelte';

const tabs = [
  { id: 'content', label: 'Content', tabId: 't1', panelId: 'p1' },
  { id: 'sources', label: 'Sources', count: 6, tabId: 't2', panelId: 'p2' },
  { id: 'technical', label: 'Technical', tabId: 't3', panelId: 'p3' }
];

describe('Tabs', () => {
  it('uses a roving tabindex with the selected tab focusable', () => {
    render(Tabs, { props: { tabs, value: 'sources' } });
    expect(screen.getByRole('tab', { name: /Sources/ })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Content' })).toHaveAttribute('tabindex', '-1');
  });
  it('moves with arrow keys and reports the change', async () => {
    const onchange = vi.fn();
    render(Tabs, { props: { tabs, value: 'content', onchange } });
    await fireEvent.keyDown(screen.getByRole('tab', { name: 'Content' }), { key: 'ArrowRight' });
    expect(onchange).toHaveBeenCalledWith('sources');
    await fireEvent.keyDown(screen.getByRole('tab', { name: /Sources/ }), { key: 'End' });
    expect(onchange).toHaveBeenCalledWith('technical');
  });
  it('falls back to the first tab for an unknown value', () => {
    render(Tabs, { props: { tabs, value: 'nope' } });
    expect(screen.getByRole('tab', { name: 'Content' })).toHaveAttribute('aria-selected', 'true');
  });
});
