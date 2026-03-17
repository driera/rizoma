import { describe, it, expect } from 'vitest';
import { Button, RizomaProvider, useRizomaTheme } from './index';
import type { ButtonProps, RizomaTheme } from './index';

describe('library barrel', () => {
  it('exports Button', () => {
    expect(Button).toBeDefined();
  });

  it('exports ButtonProps type', () => {
    const props: ButtonProps = { children: 'test' };
    expect(props).toBeDefined();
  });

  it('exports RizomaProvider', () => {
    expect(RizomaProvider).toBeDefined();
  });

  it('exports useRizomaTheme', () => {
    expect(useRizomaTheme).toBeDefined();
  });

  it('exports RizomaTheme type', () => {
    const theme: RizomaTheme = { radius: '4px' };
    expect(theme).toBeDefined();
  });
});
