import { createContext } from "preact";
import { Theme } from "./types";

export type TThemeContext = [theme: Theme, setTheme: (theme: Theme) => void];

export const ThemeContext = createContext<TThemeContext | null>(null);
