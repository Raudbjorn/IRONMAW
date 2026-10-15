import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SplitButton from './SplitButton.svelte';

const items = [
  { id: 'pdf', label: 'PDF for people' },
  { id: 'txt', label: 'Plain text for parsers' }
];

function setup() {
  const onclick = vi.fn();
  const onselect = vi.fn();
  render(SplitButton, { props: { label: 'Download PDF', menuLabel: 'More download options', items, onclick, onselect } });
  return { onclick, onselect };
}

describe('SplitButton', () => {
  it('is a labelled group with a main button and a menu trigger', () => {
    setup();
    expect(screen.getByRole('group', { name: 'Download PDF' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More download options' })).toHaveAttribute('aria-haspopup', 'menu');
  });
  it('disables the menu half while loading', () => {
    render(SplitButton, { props: { label: 'Download PDF', menuLabel: 'More download options', items, loading: true } });
    expect(screen.getByRole('button', { name: 'More download options' })).toBeDisabled();
  });
  it('fires the main action without opening the menu', async () => {
    const { onclick } = setup();
    await fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    expect(onclick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('reports a menu selection', async () => {
    const { onselect } = setup();
    await fireEvent.click(screen.getByRole('button', { name: 'More download options' }));
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Plain text for parsers' }));
    expect(onselect).toHaveBeenCalledWith('txt');
  });
  it('chamfers only the trigger on primary', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Download PDF' })).not.toHaveAttribute('data-chamfer');
    expect(screen.getByRole('button', { name: 'More download options' })).toHaveAttribute('data-chamfer');
  });
});
