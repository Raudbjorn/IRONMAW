import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Textarea from './Textarea.svelte';

describe('Textarea', () => {
  it('labels the field and honours rows', () => {
    render(Textarea, { props: { label: 'Summary', rows: 6 } });
    const field = screen.getByLabelText('Summary');
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).toHaveAttribute('rows', '6');
  });
  it('shows a visible count and includes it in the description', async () => {
    render(Textarea, { props: { label: 'Summary', maxlength: 1000, value: 'abc' } });
    const field = screen.getByLabelText('Summary');
    expect(screen.getByText('3 of 1000 characters')).toBeInTheDocument();
    expect(field).toHaveAccessibleDescription('3 of 1000 characters');
    await fireEvent.input(field, { target: { value: 'abcd' } });
    expect(screen.getByText('4 of 1000 characters')).toBeInTheDocument();
  });
  it('marks the count as near the limit from 90%', () => {
    render(Textarea, { props: { label: 'A', maxlength: 100, value: 'x'.repeat(90) } });
    expect(screen.getByText('90 of 100 characters')).toHaveAttribute('data-near');
  });
  it('does not mark the count below 90%', () => {
    render(Textarea, { props: { label: 'A', maxlength: 100, value: 'x'.repeat(89) } });
    expect(screen.getByText('89 of 100 characters')).not.toHaveAttribute('data-near');
  });
  it('describes with hint or error and flags invalid', () => {
    render(Textarea, { props: { label: 'A', hint: 'Two sentences.', error: 'Too short.' } });
    const field = screen.getByLabelText('A');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Too short.');
  });
  it('is visibly read-only and swaps in readonlyHint', () => {
    render(Textarea, { props: { label: 'A', readonly: true, hint: 'Edit me', readonlyHint: 'Edit this in the main CV.' } });
    const field = screen.getByLabelText('A');
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveAttribute('data-readonly');
    expect(field).toHaveAccessibleDescription('Edit this in the main CV.');
  });
  it('passes through attributes and disabled', () => {
    render(Textarea, { props: { label: 'A', name: 'summary', disabled: true, placeholder: 'Write' } });
    const field = screen.getByLabelText('A');
    expect(field).toBeDisabled();
    expect(field).toHaveAttribute('name', 'summary');
    expect(field).toHaveAttribute('placeholder', 'Write');
  });
});
