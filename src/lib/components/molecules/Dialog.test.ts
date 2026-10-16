import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import Dialog from './Dialog.svelte';

// jsdom has no showModal/close; model the native behaviour closely enough.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});
afterEach(() => (document.body.innerHTML = ''));

const dlg = () => document.querySelector('dialog') as HTMLDialogElement;

describe('Dialog', () => {
  it('stays closed until open, then names itself from title and description', async () => {
    const { rerender } = render(Dialog, { props: { title: 'Open a CV', description: 'Pick one.', open: false } });
    expect(dlg()).not.toHaveAttribute('open');
    await rerender({ open: true });
    await tick();
    expect(dlg()).toHaveAttribute('open');
    expect(dlg()).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(dlg().getAttribute('aria-labelledby')!)).toHaveTextContent('Open a CV');
    expect(document.getElementById(dlg().getAttribute('aria-describedby')!)).toHaveTextContent('Pick one.');
  });
  it('renders a Close button when no footer is given and closes on it', async () => {
    const onclose = vi.fn();
    render(Dialog, { props: { title: 'T', open: true, onclose, closeLabel: 'Done' } });
    await tick();
    await fireEvent.click(screen.getByRole('button', { name: 'Done', hidden: true }));
    await tick();
    expect(dlg()).not.toHaveAttribute('open');
    expect(onclose).toHaveBeenCalledTimes(1);
  });
  it('closes on Escape (cancel) when dismissible, not when it is not', async () => {
    render(Dialog, { props: { title: 'T', open: true } });
    await tick();
    const ev = new Event('cancel', { cancelable: true });
    dlg().dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    document.body.innerHTML = '';
    render(Dialog, { props: { title: 'T', open: true, dismissible: false } });
    await tick();
    const ev2 = new Event('cancel', { cancelable: true });
    dlg().dispatchEvent(ev2);
    expect(ev2.defaultPrevented).toBe(true);
  });
  it('closes on backdrop click only when dismissible', async () => {
    render(Dialog, { props: { title: 'T', open: true } });
    await tick();
    await fireEvent.click(dlg());
    await tick();
    expect(dlg()).not.toHaveAttribute('open');
  });
  it('ignores backdrop click when not dismissible and clicks inside', async () => {
    render(Dialog, { props: { title: 'T', open: true, dismissible: false } });
    await tick();
    await fireEvent.click(dlg());
    await tick();
    expect(dlg()).toHaveAttribute('open');
  });
  it('returns focus to the opener on close', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const { rerender } = render(Dialog, { props: { title: 'T', open: false } });
    await rerender({ open: true });
    await tick();
    (screen.getByRole('button', { name: 'Close', hidden: true })).focus();
    await rerender({ open: false });
    await tick();
    expect(document.activeElement).toBe(opener);
  });
  it('sizes via data-size', () => {
    render(Dialog, { props: { title: 'T', size: 'sm' } });
    expect(dlg()).toHaveAttribute('data-size', 'sm');
  });
});
