import { ComponentChildren } from "preact";
import styles from "./InputGroup.module.scss";

export interface InputGroupProps {
  children: ComponentChildren;
}

export function InputGroup({ children }: InputGroupProps) {
  return <div className={styles.inputGroup}>{children}</div>;
}
