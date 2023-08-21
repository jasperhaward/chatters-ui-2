import { ComponentChildren } from "preact";
import styles from "./Button.module.scss";

export interface ButtonProps {
  className?: string;
  type?: "submit";
  color?: "ghost";
  disabled?: boolean;
  children: ComponentChildren;
  onClick?: (event: JSX.TargetedEvent<HTMLButtonElement>) => void;
}

export function Button({
  className = "",
  type,
  color,
  disabled,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${color ? styles[color] : ""} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
