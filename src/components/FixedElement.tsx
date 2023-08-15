import { ComponentChildren } from "preact";
import styles from "./FixedElement.module.scss";

export interface FixedElementProps {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  children: ComponentChildren;
}

export function FixedElement({ position, children }: FixedElementProps) {
  return (
    <div className={`${styles.fixed} ${styles[position]}`}>{children}</div>
  );
}
