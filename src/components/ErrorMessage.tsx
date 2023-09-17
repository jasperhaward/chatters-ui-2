import styles from "./ErrorMessage.module.scss";

export interface ErrorMessageProps {
  children: string;
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return <div className={styles.errorMessage}>{children}</div>;
}
