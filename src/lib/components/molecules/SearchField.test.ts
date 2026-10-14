import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SearchField from './SearchField.svelte';

describe('SearchField', () => {
  it('is a labelled search landmark that submits explicitly', async () => {
    const onsubmit = vi.fn();
    render(SearchField, { props: { value: 'ferilskrá', onsubmit } });
    const input = screen.getByRole('searchbox', { name: 'Search library' });
    expect(input).toHaveValue('ferilskrá');
    await fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onsubmit).toHaveBeenCalledWith('ferilskrá');
  });
  it('clears with an explicit control and returns focus to the field', async () => {
    const onclear = vi.fn();
    render(SearchField, { props: { value: 'umsókn', onclear } });
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onclear).toHaveBeenCalled();
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
  it('stays editable while busy and while rejected', () => {
    render(SearchField, { props: { value: 'x', busy: true, error: 'Search is limited to 512 characters.' } });
    const input = screen.getByRole('searchbox');
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('512');
    expect(screen.getByRole('button', { name: 'Searching…' })).toHaveAttribute('aria-busy', 'true');
  });
});
