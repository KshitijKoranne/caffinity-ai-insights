
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize state with null to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');
  // Add a state to track if theme is currently transitioning to prevent multiple toggles
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme class and store in localStorage when it changes
  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const getInitialTheme = (): Theme => {
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) {
          return storedTheme;
        }
        
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      }
      return 'light'; // Default theme
    };
    
    // Set initial theme only on first render
    setThemeState(getInitialTheme());
  }, []);

  // Apply theme changes to document and localStorage
  useEffect(() => {
    if (theme) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Watch for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      // Only update if user hasn't manually set a preference
      if (!savedTheme) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    // Prevent multiple rapid toggles
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    
    // Allow toggling again after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with your CSS transition duration
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
