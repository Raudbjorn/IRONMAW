import { createRawSnippet } from 'svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ReorderList, { type ReorderItem } from './ReorderList.svelte';

const items: ReorderItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience', count: 3, expanded: true },
  { id: 'skills', label: 'Skills', count: 12, hidden: true }
];
const detail = createRawSnippet<[ReorderItem]>((item) => ({ render: () => `<p>Detail for ${item().label}</p>` }));

function setup(extra: Record<string, unknown> = {}) {
  const fns = { onmove: vi.fn(), onvisibility: vi.fn(), onexpand: vi.fn(), onmenu: vi.fn() };
  render(ReorderList, { props: { items, 'aria-label': 'Sections', detail, ...fns, ...extra } });
  return fns;
}

describe('ReorderList', () => {
  it('is an ordered list of rows with counts', () => {
    setup();
    expect(screen.getByRole('list', { name: 'Sections' }).tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
  it('gives handles a name and the move instructions', () => {
    setup();
    const h = screen.getByRole('button', { name: 'Move Experience' });
    expect(h).toHaveAccessibleDescription('Press Alt with Up or Down to move.');
  });
  it('Alt+Arrow moves within bounds and announces', async () => {
    const { onmove } = setup();
    await fireEvent.keyDown(screen.getByRole('button', { name: 'Move Experience' }), { key: 'ArrowUp', altKey: true });
    expect(onmove).toHaveBeenCalledWith('experience', 0);
    expect(screen.getByRole('status')).toHaveTextContent('Moved Experience to position 1 of 3.');
    onmove.mockClear();
    await fireEvent.keyDown(screen.getByRole('button', { name: 'Move Summary' }), { key: 'ArrowUp', altKey: true });
    await fireEvent.keyDown(screen.getByRole('button', { name: 'Move Skills' }), { key: 'ArrowDown', altKey: true });
    expect(onmove).not.toHaveBeenCalled();
  });
  it('plain arrows do not move', async () => {
    const { onmove } = setup();
    await fireEvent.keyDown(screen.getByRole('button', { name: 'Move Experience' }), { key: 'ArrowUp' });
    expect(onmove).not.toHaveBeenCalled();
  });
  it('toggles visibility; the label names the next action', async () => {
    const { onvisibility } = setup();
    const hide = screen.getByRole('button', { name: 'Hide Summary' });
    expect(hide).not.toHaveAttribute('aria-pressed');
    await fireEvent.click(hide);
    expect(onvisibility).toHaveBeenCalledWith('summary', true);
    const show = screen.getByRole('button', { name: 'Show Skills' });
    await fireEvent.click(show);
    expect(onvisibility).toHaveBeenCalledWith('skills', false);
  });
  it('expands and renders detail only for expanded rows', async () => {
    const { onexpand } = setup();
    expect(screen.getByText('Detail for Experience')).toBeInTheDocument();
    expect(screen.queryByText('Detail for Summary')).toBeNull();
    expect(screen.getByRole('button', { name: 'Collapse Experience' })).toHaveAttribute('aria-expanded', 'true');
    await fireEvent.click(screen.getByRole('button', { name: 'Expand Summary' }));
    expect(onexpand).toHaveBeenCalledWith('summary', true);
  });
  it('shows a row menu and reports the action', async () => {
    const { onmenu } = setup({ menu: [{ id: 'rename', label: 'Rename' }] });
    await fireEvent.click(screen.getByRole('button', { name: 'More actions for Summary' }));
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onmenu).toHaveBeenCalledWith('summary', 'rename');
  });
  it('drags by the handle to a new index', async () => {
    const { onmove } = setup();
    const rows = screen.getAllByRole('listitem');
    rows.forEach((li, i) => {
      li.getBoundingClientRect = () => ({ top: i * 40, height: 40, bottom: i * 40 + 40, left: 0, right: 100, width: 100, x: 0, y: i * 40, toJSON() {} }) as DOMRect;
    });
    const handle = screen.getByRole('button', { name: 'Move Summary' });
    await fireEvent.pointerDown(handle, { button: 0, pointerId: 1 });
    // jsdom has no PointerEvent; a MouseEvent carries clientY under the same type.
    await fireEvent(handle, new MouseEvent('pointermove', { clientY: 110, bubbles: true }));
    await fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(onmove).toHaveBeenCalledWith('summary', 2);
  });
  it('Escape cancels a drag', async () => {
    const { onmove } = setup();
    const handle = screen.getByRole('button', { name: 'Move Summary' });
    await fireEvent.pointerDown(handle, { button: 0, pointerId: 1 });
    await fireEvent.keyDown(window, { key: 'Escape' });
    await fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(onmove).not.toHaveBeenCalled();
  });
});
