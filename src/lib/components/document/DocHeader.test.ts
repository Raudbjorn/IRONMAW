import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DocHeader from './DocHeader.svelte';

describe('DocHeader', () => {
  it('renders the name as the h1 and the headline as text', () => {
    render(DocHeader, { props: { name: 'Sveinbjörn Geirsson', headline: 'Hugbúnaðarsérfræðingur' } });
    expect(screen.getByRole('heading', { level: 1, name: 'Sveinbjörn Geirsson' })).toBeInTheDocument();
    expect(screen.getByText('Hugbúnaðarsérfræðingur')).toBeInTheDocument();
  });
  it('derives mailto and tel hrefs and honours explicit ones', () => {
    render(DocHeader, {
      props: {
        name: 'A',
        contacts: [
          { kind: 'email', value: 'a@example.is' },
          { kind: 'phone', value: '+354 555 1234' },
          { kind: 'website', value: 'example.is', href: 'https://example.is' },
          { kind: 'location', value: 'Kópavogur' }
        ]
      }
    });
    expect(screen.getByRole('link', { name: 'a@example.is' })).toHaveAttribute('href', 'mailto:a@example.is');
    expect(screen.getByRole('link', { name: '+354 555 1234' })).toHaveAttribute('href', 'tel:+3545551234');
    expect(screen.getByRole('link', { name: 'example.is' })).toHaveAttribute('href', 'https://example.is');
    expect(screen.getByText('Kópavogur').closest('a')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
  it('omits the list without contacts', () => {
    render(DocHeader, { props: { name: 'A' } });
    expect(screen.queryByRole('list')).toBeNull();
  });
});
