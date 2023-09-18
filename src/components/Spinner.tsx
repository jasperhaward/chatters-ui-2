import styles from "./Spinner.module.scss";
import { Icon } from "./Icon";

export interface SpinnerProps {
  className?: string;
  color: "background" | "foreground" | "grey";
}

export function Spinner({ className = "", color }: SpinnerProps) {
  return (
    <Icon
      className={`${styles.spinner} ${styles[color]} ${className}`}
      icon={["fas", "circle-notch"]}
    />
  );
}
