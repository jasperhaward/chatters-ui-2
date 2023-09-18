import { ComponentChildren } from "preact";
import styles from "./Button.module.scss";
import { Spinner } from ".";

export interface ButtonProps {
  className?: string;
  type?: "submit";
  color: "foreground" | "ghost";
  disabled?: boolean;
  spinner?: boolean;
  children: ComponentChildren;
  onClick?: (event: JSX.TargetedEvent<HTMLButtonElement>) => void;
}

export function Button({
  className = "",
  type,
  color,
  disabled,
  spinner,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[color]} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {spinner && (
        <Spinner
          className={styles.spinner}
          color={color === "foreground" ? "background" : "foreground"}
        />
      )}
      {children}
    </button>
  );
}
