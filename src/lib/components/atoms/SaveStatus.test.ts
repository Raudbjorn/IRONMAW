import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SaveStatus from './SaveStatus.svelte';

describe('SaveStatus', () => {
  it.each([
    ['saved', 'Saved'],
    ['saving', 'Saving…'],
    ['unsaved', 'Not saved'],
    ['error', "Couldn't save"]
  ] as const)('shows copy for %s', (state, text) => {
    render(SaveStatus, { props: { state } });
    const s = screen.getByRole('status');
    expect(s).toHaveTextContent(text);
    expect(s).toHaveAttribute('aria-live', 'polite');
  });
  it('accepts a label override', () => {
    render(SaveStatus, { props: { state: 'saved', label: 'Saved just now' } });
    expect(screen.getByRole('status')).toHaveTextContent('Saved just now');
  });
});
