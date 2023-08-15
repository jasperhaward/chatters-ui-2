import styles from "./Divider.module.scss";

export interface DividerProps {
  children: string;
}

export function Divider({ children }: DividerProps) {
  return (
    <div className={styles.divider}>
      <hr />
      <span>{children}</span>
      <hr />
    </div>
  );
}
