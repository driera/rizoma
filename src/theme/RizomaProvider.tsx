import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

export type { RizomaTheme } from './types';
import type { RizomaTheme } from './types';

const RizomaContext = createContext<RizomaTheme>({});

export function useRizomaTheme(): RizomaTheme {
  return useContext(RizomaContext);
}

const TOKEN_PREFIX = '--rizoma-';

const themeKeyToVar: Record<keyof RizomaTheme, string> = {
  radius: `${TOKEN_PREFIX}radius`,
  focusRingColor: `${TOKEN_PREFIX}focus-ring-color`,
  focusRingWidth: `${TOKEN_PREFIX}focus-ring-width`,
  focusRingOffset: `${TOKEN_PREFIX}focus-ring-offset`,
};

function themeToCustomProperties(theme: RizomaTheme): CSSProperties {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    const varName = themeKeyToVar[key as keyof RizomaTheme];
    if (varName && value != null) {
      style[varName] = value;
    }
  }
  return style as CSSProperties;
}

interface RizomaProviderProps {
  theme: RizomaTheme;
  children: ReactNode;
}

export function RizomaProvider({ theme, children }: RizomaProviderProps) {
  const parentTheme = useContext(RizomaContext);
  const merged = { ...parentTheme, ...theme };
  const style = themeToCustomProperties(merged);

  return (
    <RizomaContext.Provider value={merged}>
      <div style={style}>{children}</div>
    </RizomaContext.Provider>
  );
}
