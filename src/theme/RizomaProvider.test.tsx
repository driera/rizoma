import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RizomaProvider } from './RizomaProvider';
import type { RizomaTheme } from './RizomaProvider';

describe('RizomaProvider', () => {
  it('renders children inside a wrapper element', () => {
    render(
      <RizomaProvider theme={{}}>
        <span>child</span>
      </RizomaProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('theme values appear as CSS custom properties on the wrapper', () => {
    const theme: RizomaTheme = { radius: '8px' };
    const { container } = render(
      <RizomaProvider theme={theme}>
        <span>child</span>
      </RizomaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--rizoma-radius')).toBe('8px');
  });

  it('nested providers override parent values', () => {
    render(
      <RizomaProvider theme={{ radius: '8px' }}>
        <RizomaProvider theme={{ radius: '16px' }}>
          <span data-testid="inner">inner</span>
        </RizomaProvider>
      </RizomaProvider>,
    );
    const inner = screen.getByTestId('inner');
    const wrapper = inner.parentElement as HTMLElement;
    expect(wrapper.style.getPropertyValue('--rizoma-radius')).toBe('16px');
  });

  it('components outside any provider still render', () => {
    render(<span>no provider</span>);
    expect(screen.getByText('no provider')).toBeInTheDocument();
  });
});
