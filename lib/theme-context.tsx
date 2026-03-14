'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  dark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const storedDark = localStorage.getItem('hypno-dark');
    if (storedDark === 'true') setDark(true);
  }, []);

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('hypno-dark', String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {/*
        display:contents removes the div from layout flow but keeps it in the
        DOM tree. Tailwind's `.dark .dark\:*` selectors match all descendants
        because the `dark` class IS on this element in the DOM.
        This is more reliable than document.documentElement manipulation
        in Next.js App Router, which can be reset during re-renders.
      */}
      <div className={dark ? 'dark' : ''} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
