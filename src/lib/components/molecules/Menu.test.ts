import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Menu, { type MenuEntry } from './Menu.svelte';

const items: MenuEntry[] = [
  { id: 'rename', label: 'Rename', hint: 'F2' },
  { id: 'copy', label: 'Duplicate', disabled: true },
  { separator: true },
  { id: 'delete', label: 'Delete', danger: true },
  { id: 'more', label: 'Export', submenu: true }
];

function setup(extra: Record<string, unknown> = {}) {
  const onselect = vi.fn();
  render(Menu, { props: { label: 'Document actions', items, onselect, ...extra } });
  return { onselect, trigger: screen.getByRole('button', { name: 'Document actions' }) };
}

describe('Menu', () => {
  it('exposes the trigger as a menu button', () => {
    const { trigger } = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('places a menu that starts open', async () => {
    setup({ open: true });
    const menu = await screen.findByRole('menu');
    await vi.waitFor(() => expect(menu).toHaveAttribute('data-placed'));
  });
  it('opens on click with menuitems and a separator', async () => {
    const { trigger } = setup();
    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveAttribute('aria-disabled', 'true');
  });
  it('ArrowDown on the trigger focuses the first item, ArrowUp the last', async () => {
    const { trigger } = setup();
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveFocus();
    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    await fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    expect(screen.getByRole('menuitem', { name: /Export/ })).toHaveFocus();
  });
  it('arrows skip disabled items and wrap', async () => {
    const { trigger } = setup();
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');
    await fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await fireEvent.keyDown(menu, { key: 'End' });
    expect(screen.getByRole('menuitem', { name: /Export/ })).toHaveFocus();
    await fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveFocus();
  });
  it('Enter selects, closes and returns focus to the trigger', async () => {
    const { trigger, onselect } = setup();
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await fireEvent.keyDown(screen.getByRole('menuitem', { name: /Rename/ }), { key: 'Enter' });
    expect(onselect).toHaveBeenCalledWith('rename');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });
  it('does not select disabled items; submenu items still fire', async () => {
    const { trigger, onselect } = setup();
    await fireEvent.click(trigger);
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onselect).not.toHaveBeenCalled();
    await fireEvent.click(screen.getByRole('menuitem', { name: /Export/ }));
    expect(onselect).toHaveBeenCalledWith('more');
  });
  it('closes on Escape (focus to trigger), Tab and outside pointerdown', async () => {
    const { trigger } = setup();
    await fireEvent.click(trigger);
    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
    await fireEvent.click(trigger);
    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
    expect(screen.queryByRole('menu')).toBeNull();
    await fireEvent.click(trigger);
    await fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('shows visible text and a title when given', async () => {
    render(Menu, { props: { label: 'Add section', text: 'Add section', icon: 'plus', title: 'Sections', columns: 2, items } });
    await fireEvent.click(screen.getByRole('button', { name: /Add section/ }));
    expect(screen.getByRole('menu', { name: 'Sections' })).toBeInTheDocument();
  });
});
