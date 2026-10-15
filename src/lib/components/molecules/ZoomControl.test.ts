import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ZoomControl from './ZoomControl.svelte';

describe('ZoomControl', () => {
  it('is a toolbar named Zoom and shows the value', () => {
    render(ZoomControl, { props: { value: 125 } });
    expect(screen.getByRole('toolbar', { name: 'Zoom' })).toBeInTheDocument();
    expect(screen.getByText('125%')).toBeInTheDocument();
  });
  it('steps in and out', async () => {
    const onchange = vi.fn();
    render(ZoomControl, { props: { value: 100, onchange } });
    await fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(onchange).toHaveBeenLastCalledWith(125);
    await fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(onchange).toHaveBeenLastCalledWith(75);
  });
  it('starts from 100 when fit, and the value toggle flips fit/100', async () => {
    const onchange = vi.fn();
    render(ZoomControl, { props: { value: 'fit', onchange } });
    expect(screen.getByText('Fit')).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(onchange).toHaveBeenLastCalledWith(125);
    await fireEvent.click(screen.getByRole('button', { name: /Fit/ }));
    expect(onchange).toHaveBeenLastCalledWith(100);
  });
  it('returns to fit from a number', async () => {
    const onchange = vi.fn();
    render(ZoomControl, { props: { value: 150, onchange } });
    await fireEvent.click(screen.getByRole('button', { name: /150%/ }));
    expect(onchange).toHaveBeenCalledWith('fit');
  });
  it('disables at the bounds', () => {
    const { unmount } = render(ZoomControl, { props: { value: 25 } });
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
    unmount();
    render(ZoomControl, { props: { value: 400 } });
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
  });
  it('moves focus with Left/Right and pluralises pages', async () => {
    render(ZoomControl, { props: { value: 100, pageCount: 3 } });
    expect(screen.getByText('3 pages')).toBeInTheDocument();
    const out = screen.getByRole('button', { name: 'Zoom out' });
    out.focus();
    await fireEvent.keyDown(out, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: /100%/ })).toHaveFocus();
    await fireEvent.keyDown(screen.getByRole('button', { name: /100%/ }), { key: 'ArrowLeft' });
    expect(out).toHaveFocus();
  });
  it('says 1 page for one', () => {
    render(ZoomControl, { props: { value: 100, pageCount: 1 } });
    expect(screen.getByText('1 page')).toBeInTheDocument();
  });
});
