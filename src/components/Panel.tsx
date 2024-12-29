import styles from "./Panel.module.scss";
import { useMediaQuery } from "@/hooks";

export interface PanelProps {
  className?: string;
  /** Width of the screen in px before the panel becomes visible. */
  minWidth: number;
  children: string;
}

export function Panel({ className = "", minWidth, children }: PanelProps) {
  const isLargeScreen = useMediaQuery(`(min-width: ${minWidth}px)`);

  return (
    <div
      className={`${className} ${styles.panel}`}
      style={{ display: isLargeScreen ? "flex" : "none" }}
    >
      <h1>{children}</h1>
    </div>
  );
}
