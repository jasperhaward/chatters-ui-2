import { ComponentChildren } from "preact";
import styles from "./Card.module.scss";

export interface CardProps {
  children: ComponentChildren;
}

export function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>;
}
