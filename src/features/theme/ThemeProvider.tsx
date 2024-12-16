import { ComponentChildren } from "preact";
import { useLayoutEffect } from "preact/hooks";

import { useLocalStorage } from "@/hooks";
import { Theme } from "./types";
import { ThemeContext } from "./ThemeContext";

export interface ThemeProviderProps {
  children: ComponentChildren;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "dark");

  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
      document.documentElement.classList.add("dark-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}
