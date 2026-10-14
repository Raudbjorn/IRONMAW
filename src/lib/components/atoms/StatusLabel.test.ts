import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import StatusLabel from './StatusLabel.svelte';
import { REVIEW_STATUS, sortReviewStatuses } from '../../review-status.ts';

describe('StatusLabel', () => {
  it('maps stored values to the handoff display copy', () => {
    render(StatusLabel, { props: { status: 'known-errors' } });
    const el = screen.getByText('Known issues', { exact: false });
    expect(el.closest('[data-wm="status"]')).toHaveAttribute('data-tone', 'act');
  });
  it('shows unknown statuses raw in the plain tone instead of hiding them', () => {
    render(StatusLabel, { props: { status: 'private-browser-capture' } });
    expect(screen.getByText('private-browser-capture').closest('[data-wm="status"]')).toHaveAttribute('data-tone', 'context');
  });
  it('never uses a green/verified tone', () => {
    for (const copy of Object.values(REVIEW_STATUS)) {
      expect(['act', 'care', 'context']).toContain(copy.tone);
      expect(copy.label.toLowerCase()).not.toContain('verified');
    }
  });
  it('sorts Known issues first', () => {
    expect(sortReviewStatuses(['snapshot', 'review-required', 'known-errors'])).toEqual(['known-errors', 'review-required', 'snapshot']);
  });
});
