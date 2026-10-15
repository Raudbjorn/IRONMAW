import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import Input from './Input.svelte';

const swatch = createRawSnippet(() => ({ render: () => '<span data-testid="swatch"></span>' }));

describe('Input', () => {
  it('renders a plain field without a shell', () => {
    const { container } = render(Input, { props: { label: 'Full name', value: 'Sveinbjörn Geirsson' } });
    expect(screen.getByLabelText('Full name')).toHaveValue('Sveinbjörn Geirsson');
    expect(container.querySelector('[data-wm="input-shell"]')).toBeNull();
  });
  it('reads the unit with the field', () => {
    render(Input, { props: { label: 'Font size', type: 'number', value: '11', unit: 'pt' } });
    const field = screen.getByLabelText('Font size');
    const unitId = field.getAttribute('aria-describedby')?.split(' ')[0];
    expect(unitId && document.getElementById(unitId)).toHaveTextContent('pt');
  });
  it('keeps hint after the unit in aria-describedby', () => {
    render(Input, { props: { label: 'Line height', unit: '×', hint: 'Between 1 and 2.' } });
    const ids = screen.getByLabelText('Line height').getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1]!)).toHaveTextContent('Between 1 and 2.');
  });
  it('renders leading content and a decorative icon inside the shell', () => {
    const { container } = render(Input, { props: { label: 'Colour', leading: swatch, icon: 'link' } });
    const shell = container.querySelector('[data-wm="input-shell"]');
    expect(shell).not.toBeNull();
    expect(shell?.querySelector('[data-testid="swatch"]')).not.toBeNull();
    expect(shell?.querySelector('[data-wm="icon"]')).toHaveAttribute('aria-hidden', 'true');
  });
  it('marks the shell on error', () => {
    const { container } = render(Input, { props: { label: 'Website', icon: 'link', error: 'Use a full address.' } });
    expect(container.querySelector('[data-wm="input-shell"]')).toHaveAttribute('data-error');
    expect(screen.getByLabelText('Website')).toHaveAttribute('aria-invalid', 'true');
  });
});
