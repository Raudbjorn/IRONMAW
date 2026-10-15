import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Avatar from './Avatar.svelte';

describe('Avatar', () => {
  it('uses first and last word initials, keeping Icelandic letters', () => {
    render(Avatar, { props: { name: 'Þórunn Ösp Ægisdóttir' } });
    const img = screen.getByRole('img', { name: 'Þórunn Ösp Ægisdóttir' });
    expect(img).toHaveTextContent('ÞÆ');
  });
  it('handles a single word', () => {
    render(Avatar, { props: { name: 'sveinbjörn' } });
    expect(screen.getByRole('img')).toHaveTextContent('S');
  });
  it('renders the picture and falls back to initials on error', async () => {
    const { container } = render(Avatar, { props: { name: 'Sveinbjörn Geirsson', src: 'x.png' } });
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'Sveinbjörn Geirsson');
    await fireEvent.error(img!);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img')).toHaveTextContent('SG');
  });
});
