import { ComponentChildren } from "preact";
import styles from "./Card.module.scss";

export interface CardProps {
  className?: string;
  children: ComponentChildren;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`${styles.card} ${className}`}>{children} </div>;
}
