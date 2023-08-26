import styles from "./Spinner.module.scss";
import { Icon } from "./Icon";

export interface SpinnerProps {
  className?: string;
  color?: "foreground";
}

export function Spinner({ className = "", color }: SpinnerProps) {
  return (
    <Icon
      className={`${styles.spinner} ${className} ${color ? styles[color] : ""}`}
      icon={["fas", "circle-notch"]}
    />
  );
}
