import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('test setup', () => {
  it('jest-dom matchers are available', () => {
    render(<button>Hello</button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Hello');
  });

  it('jest-axe toHaveNoViolations is available', async () => {
    const { container } = render(<button>Hello</button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
