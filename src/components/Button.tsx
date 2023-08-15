import { forwardRef, ForwardedRef } from "preact/compat";
import styles from "./Button.module.scss";
import { ComponentChildren } from "preact";

export interface ButtonProps {
  className?: string;
  type?: "submit";
  color?: "ghost";
  disabled?: boolean;
  children: ComponentChildren;
  onClick?: (event: JSX.TargetedEvent<HTMLButtonElement>) => void;
}

function ButtonComponent(
  { className = "", type, color, disabled, children, onClick }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={`${styles.button} ${color ? styles[color] : ""} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonComponent);
