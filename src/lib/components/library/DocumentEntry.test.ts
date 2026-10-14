import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import DocumentEntry from './DocumentEntry.svelte';

describe('DocumentEntry', () => {
  it('makes the title the focusable control and marks selection with aria-current', async () => {
    const onopen = vi.fn();
    render(DocumentEntry, { props: { title: 'cv-text-icelandic.txt', selected: true, onopen, as: 'div' } });
    const title = screen.getByRole('button', { name: 'cv-text-icelandic.txt' });
    await fireEvent.click(title);
    expect(onopen).toHaveBeenCalledTimes(1);
    expect(title.closest('[data-wm="entry"]')).toHaveAttribute('aria-current', 'true');
  });
  it('leads with Known issues and shows file locations only above one', () => {
    render(DocumentEntry, { props: { title: 'a', statuses: ['snapshot', 'known-errors'], locations: 6, as: 'div' } });
    const labels = screen.getAllByText(/Known issues|Preserved snapshot/).map((e) => e.textContent?.trim());
    expect(labels[0]).toContain('Known issues');
    expect(screen.getByText('6 file locations')).toBeInTheDocument();
  });
  it('hides a single location', () => {
    render(DocumentEntry, { props: { title: 'b', locations: 1, as: 'div' } });
    expect(screen.queryByText(/file locations/)).not.toBeInTheDocument();
  });
});
