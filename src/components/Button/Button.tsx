import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from 'react';
import { resolveTokens, type ButtonVariant } from '../../theme/resolveTokens';
import styles from './Button.module.css';

type ButtonSize = 's' | 'm';

const sizeTokens: Record<ButtonSize, Record<string, string>> = {
  s: {
    '--button-size-padding-x': '0.75rem',
    '--button-size-padding-y': '0.25rem',
    '--button-size-font': '0.875rem'
  },
  m: {
    '--button-size-padding-x': '1rem',
    '--button-size-padding-y': '0.5rem',
    '--button-size-font': '1rem'
  }
};

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: ButtonVariant;
  color?: string;
  size?: ButtonSize;
  disabled?: boolean;
  children: ReactNode;
  href?: string;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    as: Component = 'button',
    variant = 'solid',
    color = 'primary',
    size = 'm',
    disabled = false,
    className,
    style,
    onClick,
    children,
    ...rest
  },
  ref
) {
  const tokens = resolveTokens({ variant, color });
  const sizeVars = sizeTokens[size];
  const mergedStyle: CSSProperties = {
    ...tokens,
    ...sizeVars,
    ...style
  } as CSSProperties;

  const mergedClassName = [styles.button, className].filter(Boolean).join(' ');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (Component !== 'button') {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
      }
    }
  };

  const nativeInteractive = new Set([
    'button',
    'a',
    'input',
    'select',
    'textarea'
  ]);
  const needsButtonRole =
    typeof Component === 'string' && !nativeInteractive.has(Component);

  return (
    <Component
      ref={ref}
      role={needsButtonRole ? 'button' : undefined}
      tabIndex={needsButtonRole ? 0 : undefined}
      className={mergedClassName}
      style={mergedStyle}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </Component>
  );
});
