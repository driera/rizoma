import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button accessibility audit', () => {
  it('solid variant passes axe audit', async () => {
    const { container } = render(<Button variant="solid">Solid</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outline variant passes axe audit', async () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ghost variant passes axe audit', async () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled state passes axe audit', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
