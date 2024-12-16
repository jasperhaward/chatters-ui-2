import { useContext } from "preact/hooks";
import { ThemeContext } from ".";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(`useTheme() must be called from within <ThemeProvider />.`);
  }

  return context;
}
