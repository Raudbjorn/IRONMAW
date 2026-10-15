import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import DocEntry from './DocEntry.svelte';

describe('DocEntry', () => {
  it('renders an article with an h3 title, subtitle, date and location', () => {
    render(DocEntry, {
      props: { title: 'Hugbúnaðarsérfræðingur', subtitle: 'Dæmafyrirtæki ehf.', date: '2019 – 2024', location: 'Reykjavík' }
    });
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Hugbúnaðarsérfræðingur' })).toBeInTheDocument();
    expect(screen.getByText('Dæmafyrirtæki ehf.')).toBeInTheDocument();
    expect(screen.getByText('2019 – 2024')).toBeInTheDocument();
    expect(screen.getByText('Reykjavík')).toBeInTheDocument();
  });
  it('renders the body only when given', () => {
    const children = createRawSnippet(() => ({ render: () => '<ul><li>Verkefni</li></ul>' }));
    const { container } = render(DocEntry, { props: { title: 'T', children } });
    expect(screen.getByText('Verkefni')).toBeInTheDocument();
    expect(container.querySelector('.right')).toBeNull();
  });
  it('has no body wrapper without children', () => {
    const { container } = render(DocEntry, { props: { title: 'T' } });
    expect(container.querySelector('.body')).toBeNull();
  });
});
