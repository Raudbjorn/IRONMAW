import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { bearEmblem } from '../../assets/bear-emblem.ts';
import { bearMark } from '../../assets/bear-mark.ts';
import Mark from './Mark.svelte';

describe('Mark', () => {
  it('uses the compact supplied emblem in small lockups without repeating the name', () => {
    render(Mark, { props: { variant: 'lockup', size: 'sm', name: 'IRONMAW' } });
    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('src', bearEmblem);
    expect(image).toHaveAttribute('alt', '');
    expect(screen.getByText('IRONMAW')).toBeInTheDocument();
  });

  it('keeps the full bear mark and description when shown alone', () => {
    render(Mark, { props: { variant: 'bear', size: 'sm' } });
    expect(screen.getByRole('img', { name: /Sveinbjörn bear mark/ })).toHaveAttribute('src', bearMark);
  });
});
