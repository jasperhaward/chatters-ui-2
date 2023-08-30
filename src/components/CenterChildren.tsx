import { ComponentChildren } from "preact";
import styles from "./CenterChildren.module.scss";

export interface CenterChildrenProps {
  children: ComponentChildren;
}

export function CenterChildren({ children }: CenterChildrenProps) {
  return <div className={styles.centerChildren}>{children}</div>;
}
