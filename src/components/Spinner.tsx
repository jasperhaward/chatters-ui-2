import styles from "./Spinner.module.scss";
import { Icon } from "./Icon";

export interface SpinnerProps {
  className?: string;
  color: "background" | "foreground" | "grey";
  margin: "enabled" | "left" | "right";
}

export function Spinner({ className = "", color, margin }: SpinnerProps) {
  return (
    <Icon
      className={`${styles.spinner} ${styles[color]} ${styles[margin]} ${className}`}
      icon={["fas", "circle-notch"]}
    />
  );
}
