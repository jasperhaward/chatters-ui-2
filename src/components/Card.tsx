import { ComponentChildren } from "preact";
import styles from "./Card.module.scss";

export interface CardProps {
  className?: string;
  flex?: boolean;
  children: ComponentChildren;
}

export function Card({ className = "", flex, children }: CardProps) {
  return (
    <div className={`${styles.card} ${flex ? styles.flex : ""} ${className}`}>
      {children}{" "}
    </div>
  );
}
