import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from './Button';
import { palettes } from '../../theme/palettes';

describe('Button', () => {
  // --- Rendering ---

  it('renders a <button> element by default with the CSS Module class', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toMatch(/button/);
  });

  it('as prop changes the rendered element', () => {
    render(<Button as="a" href="#">Link</Button>);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link.tagName).toBe('A');
  });

  // --- Variants ---

  it('variant defaults to solid', () => {
    render(<Button>Solid</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-bg')).toBe(palettes.primary[600]);
    expect(button.style.getPropertyValue('--button-color')).toBe('white');
  });

  it('outline variant applies correct tokens', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-bg')).toBe('transparent');
    expect(button.style.getPropertyValue('--button-color')).toBe(palettes.primary[600]);
    expect(button.style.getPropertyValue('--button-border-color')).toBe(palettes.primary[500]);
  });

  it('ghost variant applies correct tokens', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-bg')).toBe(palettes.primary[50]);
    expect(button.style.getPropertyValue('--button-border-color')).toBe('transparent');
  });

  // --- Color ---

  it('color defaults to primary', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-bg')).toBe(palettes.primary[600]);
  });

  // --- Size ---

  it('size defaults to m', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-size-padding-x')).toBeTruthy();
  });

  it('size s applies smaller dimensions', () => {
    render(<Button size="s">Small</Button>);
    const button = screen.getByRole('button');
    const paddingX = button.style.getPropertyValue('--button-size-padding-x');
    expect(paddingX).toBeTruthy();
  });

  // --- Disabled ---

  it('disabled sets aria-disabled="true", not native disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toHaveAttribute('disabled');
  });

  it('disabled suppresses onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Disabled</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it('Space and Enter activate the button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('Space and Enter are suppressed when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Disabled</Button>);
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
  });

  // --- Style and className merging ---

  it('style prop merges with token custom properties, consumer values win', () => {
    render(<Button style={{ margin: '8px', '--button-bg': 'red' } as React.CSSProperties}>Styled</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('margin')).toBe('8px');
    expect(button.style.getPropertyValue('--button-bg')).toBe('red');
  });

  it('className is appended after the module class', () => {
    render(<Button className="custom-class">Classed</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
    expect(button.className).toMatch(/button/);
  });

  // --- Ref forwarding ---

  it('ref forwarding works', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // --- Hover tokens ---

  it('solid variant has hover custom properties in inline style', () => {
    render(<Button variant="solid">Solid</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-hover-bg')).toBe(palettes.primary[700]);
    expect(button.style.getPropertyValue('--button-hover-border-color')).toBe(palettes.primary[700]);
  });

  it('outline variant has hover custom properties in inline style', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-hover-bg')).toBe(palettes.primary[50]);
    expect(button.style.getPropertyValue('--button-hover-border-color')).toBe(palettes.primary[700]);
  });

  it('ghost variant has hover custom properties in inline style', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--button-hover-bg')).toBe(palettes.primary[100]);
    expect(button.style.getPropertyValue('--button-hover-border-color')).toBe(palettes.primary[200]);
  });

  // --- Spread props ---

  it('remaining native button props are spread through', () => {
    render(<Button data-testid="custom" aria-label="custom label">Spread</Button>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.getByLabelText('custom label')).toBeInTheDocument();
  });
});
