import { useEffect, useMemo, useState } from "preact/hooks";
import styles from "./Panel.module.scss";

export interface PanelProps {
  className?: string;
  /** Width of the screen in px before the panel becomes visible. */
  minWidth: number;
  children: string;
}

export function Panel({ className = "", minWidth, children }: PanelProps) {
  const query = useMemo(
    () => window.matchMedia(`(min-width: ${minWidth}px)`),
    [minWidth]
  );

  const [isVisible, setIsVisible] = useState(query.matches);

  useEffect(() => {
    function onMatchMediaChange(event: MediaQueryListEvent) {
      setIsVisible(event.matches);
    }

    query.addEventListener("change", onMatchMediaChange);

    return () => {
      query.removeEventListener("change", onMatchMediaChange);
    };
  }, [query]);

  return (
    <div
      className={`${className} ${styles.panel}`}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <h1>{children}</h1>
    </div>
  );
}
