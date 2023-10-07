import { ComponentChildren } from "preact";
import styles from "./Popover.module.scss";

export interface PopoverProps {
  children: ComponentChildren;
}

export function Popover({ children }: PopoverProps) {
  return <div className={styles.popover}>{children}</div>;
}

export interface PopoverContainerProps {
  children: ComponentChildren;
}

export function PopoverContainer({ children }: PopoverContainerProps) {
  return <div className={styles.popoverContainer}>{children}</div>;
}
